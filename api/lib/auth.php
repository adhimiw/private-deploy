<?php
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

function get_bearer_token() {
    $header = get_auth_header();
    if (!$header) {
        return '';
    }
    if (stripos($header, 'Bearer ') === 0) {
        return trim(substr($header, 7));
    }
    return '';
}

function require_auth($config) {
    $token = get_bearer_token();
    if (!$token) {
        json_response(['error' => 'Access token required'], 401);
    }
    $payload = jwt_decode($token, $config['jwt_secret']);
    if (!$payload) {
        json_response(['error' => 'Invalid or expired token'], 403);
    }
    return $payload;
}
