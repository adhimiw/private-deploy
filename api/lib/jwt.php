<?php
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode($payload, $secret) {
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $segments = [
        base64url_encode(json_encode($header)),
        base64url_encode(json_encode($payload))
    ];
    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, $secret, true);
    $segments[] = base64url_encode($signature);
    return implode('.', $segments);
}

function jwt_decode($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    [$headerB64, $payloadB64, $sigB64] = $parts;
    $signingInput = $headerB64 . '.' . $payloadB64;
    $signature = base64url_decode($sigB64);
    $expected = hash_hmac('sha256', $signingInput, $secret, true);
    if (!hash_equals($expected, $signature)) {
        return null;
    }
    $payloadJson = base64url_decode($payloadB64);
    $payload = json_decode($payloadJson, true);
    if (!is_array($payload)) {
        return null;
    }
    if (isset($payload['exp']) && time() > $payload['exp']) {
        return null;
    }
    return $payload;
}
