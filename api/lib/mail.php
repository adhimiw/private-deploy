<?php
require_once __DIR__ . '/utils.php';

function send_email_notification($config, $subject, $body, $to = null) {
    $to = $to ?: ($config['admin_email'] ?? '');
    if (!$to) {
        return false;
    }

    $smtp = $config['smtp'] ?? [];
    if (!empty($smtp['host']) && !empty($smtp['user'])) {
        return smtp_send($smtp, $to, $subject, $body);
    }

    $headers = "From: " . ($smtp['from'] ?: $to) . "\r\n";
    $headers .= "Reply-To: " . ($smtp['from'] ?: $to) . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    return @mail($to, $subject, $body, $headers);
}

function smtp_send($smtp, $to, $subject, $body) {
    $host = $smtp['host'];
    $port = (int)($smtp['port'] ?? 587);
    $user = $smtp['user'];
    $pass = $smtp['pass'] ?? '';
    $secure = strtolower($smtp['secure'] ?? 'tls');
    $from = $smtp['from'] ?: $user;

    $remote = ($secure === 'ssl') ? 'ssl://' . $host : $host;
    $fp = @fsockopen($remote, $port, $errno, $errstr, 10);
    if (!$fp) {
        return false;
    }

    if (!smtp_expect($fp, 220)) {
        fclose($fp);
        return false;
    }

    smtp_cmd($fp, 'EHLO ' . gethostname());
    smtp_read($fp);

    if ($secure === 'tls') {
        smtp_cmd($fp, 'STARTTLS');
        if (!smtp_expect($fp, 220)) {
            fclose($fp);
            return false;
        }
        stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        smtp_cmd($fp, 'EHLO ' . gethostname());
        smtp_read($fp);
    }

    if (!empty($user)) {
        smtp_cmd($fp, 'AUTH LOGIN');
        if (!smtp_expect($fp, 334)) {
            fclose($fp);
            return false;
        }
        smtp_cmd($fp, base64_encode($user));
        if (!smtp_expect($fp, 334)) {
            fclose($fp);
            return false;
        }
        smtp_cmd($fp, base64_encode($pass));
        if (!smtp_expect($fp, 235)) {
            fclose($fp);
            return false;
        }
    }

    smtp_cmd($fp, 'MAIL FROM: <' . $from . '>');
    if (!smtp_expect($fp, 250)) {
        fclose($fp);
        return false;
    }

    smtp_cmd($fp, 'RCPT TO: <' . $to . '>');
    if (!smtp_expect($fp, 250)) {
        fclose($fp);
        return false;
    }

    smtp_cmd($fp, 'DATA');
    if (!smtp_expect($fp, 354)) {
        fclose($fp);
        return false;
    }

    $headers = "From: {$from}\r\n";
    $headers .= "To: {$to}\r\n";
    $headers .= "Subject: {$subject}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";

    $message = $headers . $body;
    $message = str_replace("\n.", "\n..", $message);

    fwrite($fp, $message . "\r\n.\r\n");
    if (!smtp_expect($fp, 250)) {
        fclose($fp);
        return false;
    }

    smtp_cmd($fp, 'QUIT');
    fclose($fp);
    return true;
}

function smtp_cmd($fp, $cmd) {
    fwrite($fp, $cmd . "\r\n");
}

function smtp_read($fp) {
    $data = '';
    while ($line = fgets($fp, 515)) {
        $data .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtp_expect($fp, $code) {
    $response = smtp_read($fp);
    return strpos($response, (string)$code) === 0;
}
