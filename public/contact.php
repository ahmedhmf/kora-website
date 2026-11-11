<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $code, string $message): never {
    http_response_code($code);
    echo json_encode(['message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed');
}

// Only accept requests from the website itself, not third-party pages.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $requestHost = explode(':', $_SERVER['HTTP_HOST'] ?? '')[0];
    if (!is_string($originHost) || strcasecmp($originHost, $requestHost) !== 0) {
        respond(403, 'Forbidden');
    }
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 12000) {
    respond(413, 'Message too long');
}

$data = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($data)) respond(400, 'Invalid request');

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$token = (string) ($data['turnstileToken'] ?? '');

if (!empty($data['website'])) {
    // Return an ordinary success to honeypot-filling bots without sending mail.
    respond(200, 'Message accepted');
}

if ($name === '' || strlen($name) > 120 || preg_match('/[\r\n]/', $name)
    || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254
    || $message === '' || strlen($message) > 5000) {
    respond(422, 'Please check your details');
}

// This file lives one directory ABOVE public_html and must never be web-accessible.
$keysFile = dirname(__DIR__) . '/turnstile-keys.php';
if (!is_file($keysFile)) respond(503, 'Spam protection not configured');
$keys = require $keysFile;
$secret = is_array($keys) ? ($keys['secret_key'] ?? '') : '';
if (!is_string($secret) || $secret === '' || $secret === 'REPLACE_WITH_SECRET_KEY') {
    respond(503, 'Spam protection not configured');
}
if ($token === '' || strlen($token) > 2048) respond(403, 'Verification required');

$verification = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
if ($verification === false) respond(503, 'Verification unavailable');
curl_setopt_array($verification, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query(['secret' => $secret, 'response' => $token]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_TIMEOUT => 8,
]);
$verificationResponse = curl_exec($verification);
$verificationCode = curl_getinfo($verification, CURLINFO_HTTP_CODE);
curl_close($verification);
$result = is_string($verificationResponse) ? json_decode($verificationResponse, true) : null;
if ($verificationCode !== 200 || !is_array($result) || ($result['success'] ?? false) !== true) {
    respond(403, 'Spam verification failed');
}
$verifiedHost = strtolower((string) ($result['hostname'] ?? ''));
if (!in_array($verifiedHost, ['korafc.com', 'www.korafc.com'], true)) {
    respond(403, 'Verification hostname mismatch');
}

// A short per-session pause reduces accidental duplicate submissions.
session_start();
if (time() - (int) ($_SESSION['last_contact_at'] ?? 0) < 30) {
    respond(429, 'Please wait before sending another message');
}

$subject = 'New KORA website enquiry';
$body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = [
    'From: KORA Website <info@korafc.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: KORA Website',
];

if (!mail('info@korafc.com', $subject, $body, implode("\r\n", $headers))) {
    respond(503, 'Email service unavailable');
}

$_SESSION['last_contact_at'] = time();
respond(200, 'Message accepted');
