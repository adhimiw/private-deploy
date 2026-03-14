<?php

$backendPublic = dirname(__DIR__).'/backend/public';
$requestUri = $_SERVER['REQUEST_URI'] ?? '/api';
$parsed = parse_url($requestUri);
$path = $parsed['path'] ?? '/api';

if ($path === '/api') {
    $path = '/';
} elseif (str_starts_with($path, '/api/')) {
    $path = substr($path, 4);
}

$_SERVER['REQUEST_URI'] = $path.(isset($parsed['query']) ? '?'.$parsed['query'] : '');
$_SERVER['SCRIPT_FILENAME'] = $backendPublic.'/index.php';
$_SERVER['SCRIPT_NAME'] = '/api/index.php';
$_SERVER['PHP_SELF'] = '/api/index.php';

chdir($backendPublic);

require $backendPublic.'/index.php';
