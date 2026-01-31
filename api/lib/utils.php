<?php
function get_json_body() {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function sanitize_input($value, $max = 5000) {
    if (!is_string($value)) {
        return $value;
    }
    $value = trim($value);
    $value = preg_replace('/[<>]/', '', $value);
    if (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

function get_client_ip() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($parts[0]);
    }
    if (!empty($_SERVER['REMOTE_ADDR'])) {
        return $_SERVER['REMOTE_ADDR'];
    }
    return 'unknown';
}

function get_auth_header() {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return $headers['Authorization'];
        }
        if (isset($headers['authorization'])) {
            return $headers['authorization'];
        }
    }
    return '';
}

function normalize_phone($phone, $defaultCountryCode = '91') {
    if (!is_string($phone)) {
        return '';
    }
    $digits = preg_replace('/\\D+/', '', $phone);
    if ($digits === '') {
        return '';
    }
    if (strpos($digits, '00') === 0) {
        $digits = substr($digits, 2);
    }
    if (strpos($digits, '0') === 0 && strlen($digits) > 10) {
        $digits = ltrim($digits, '0');
    }
    if (strlen($digits) === 10 && $defaultCountryCode) {
        $digits = $defaultCountryCode . $digits;
    }
    return $digits;
}
