<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function newsletterRespond(int $status, string $message): never {
    http_response_code($status);
    echo json_encode(['message' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    newsletterRespond(405, 'Method not allowed');
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $host = parse_url($origin, PHP_URL_HOST);
    $requestHost = explode(':', $_SERVER['HTTP_HOST'] ?? '')[0];
    if (!is_string($host) || strcasecmp($host, $requestHost) !== 0) {
        newsletterRespond(403, 'Forbidden');
    }
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 5000) newsletterRespond(413, 'Request too large');
$body = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($body)) newsletterRespond(400, 'Invalid request');

if (!empty($body['website'])) newsletterRespond(200, 'Confirmation email requested');
$email = trim((string) ($body['email'] ?? ''));
$token = (string) ($body['turnstileToken'] ?? '');
if (empty($body['consent']) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    newsletterRespond(422, 'Please provide a valid email and consent');
}
if ($token === '' || strlen($token) > 2048) newsletterRespond(403, 'Verification required');

$turnstileFile = dirname(__DIR__) . '/turnstile-keys.php';
$brevoFile = dirname(__DIR__) . '/brevo-keys.php';
if (!is_file($turnstileFile) || !is_file($brevoFile)) newsletterRespond(503, 'Newsletter not configured');
$turnstile = require $turnstileFile;
$brevo = require $brevoFile;
$secret = is_array($turnstile) ? ($turnstile['secret_key'] ?? '') : '';
$apiKey = is_array($brevo) ? ($brevo['api_key'] ?? '') : '';
$listId = is_array($brevo) ? ($brevo['list_id'] ?? 0) : 0;
$templateId = is_array($brevo) ? ($brevo['template_id'] ?? 0) : 0;
if (!is_string($secret) || $secret === '' || $secret === 'REPLACE_WITH_SECRET_KEY'
    || !is_string($apiKey) || $apiKey === '' || $apiKey === 'REPLACE_WITH_BREVO_API_KEY'
    || !is_int($listId) || $listId <= 0 || !is_int($templateId) || $templateId <= 0) {
    newsletterRespond(503, 'Newsletter not configured');
}

session_start();
if (time() - (int) ($_SESSION['last_subscribe_at'] ?? 0) < 60) {
    newsletterRespond(429, 'Please wait before trying again');
}

$verify = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
if ($verify === false) newsletterRespond(503, 'Verification unavailable');
curl_setopt_array($verify, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query(['secret' => $secret, 'response' => $token]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_TIMEOUT => 8,
]);
$verifiedResponse = curl_exec($verify);
$verifiedStatus = curl_getinfo($verify, CURLINFO_HTTP_CODE);
curl_close($verify);
$verified = is_string($verifiedResponse) ? json_decode($verifiedResponse, true) : null;
if ($verifiedStatus !== 200 || !is_array($verified) || ($verified['success'] ?? false) !== true
    || !in_array(strtolower((string) ($verified['hostname'] ?? '')), ['korafc.com', 'www.korafc.com'], true)) {
    newsletterRespond(403, 'Spam verification failed');
}

$payload = json_encode([
    'email' => $email,
    'includeListIds' => [$listId],
    'templateId' => $templateId,
    'redirectionUrl' => 'https://korafc.com/?newsletter=confirmed#newsletter',
]);
$request = curl_init('https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
if ($request === false || $payload === false) newsletterRespond(503, 'Newsletter unavailable');
curl_setopt_array($request, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json', 'api-key: ' . $apiKey],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 12,
]);
curl_exec($request);
$status = curl_getinfo($request, CURLINFO_HTTP_CODE);
curl_close($request);
if ($status < 200 || $status >= 300) {
    // Never reveal whether an email already exists in the subscriber database.
    newsletterRespond(502, 'Unable to request confirmation email');
}

$_SESSION['last_subscribe_at'] = time();
newsletterRespond(200, 'Confirmation email requested');
