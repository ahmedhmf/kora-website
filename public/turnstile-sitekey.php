<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$keysFile = dirname(__DIR__) . '/turnstile-keys.php';
$keys = is_file($keysFile) ? require $keysFile : [];
$key = is_array($keys) ? ($keys['site_key'] ?? '') : '';
if (!is_string($key) || $key === '' || $key === 'REPLACE_WITH_SITE_KEY') {
    http_response_code(503);
    echo json_encode(['message' => 'Turnstile is not configured']);
    exit;
}

echo json_encode(['siteKey' => $key]);
