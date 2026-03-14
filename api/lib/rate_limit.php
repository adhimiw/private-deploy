<?php
require_once __DIR__ . '/db.php';

function check_rate_limit($key, $max, $windowSeconds) {
    $pdo = db();
    $now = time();
    $stmt = $pdo->prepare('SELECT count, reset_at FROM rate_limits WHERE key = :key');
    $stmt->execute([':key' => $key]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        $resetAt = $now + $windowSeconds;
        $insert = $pdo->prepare('INSERT INTO rate_limits (key, count, reset_at) VALUES (:key, :count, :reset_at)');
        $insert->execute([':key' => $key, ':count' => 1, ':reset_at' => $resetAt]);
        return true;
    }

    if ($row['reset_at'] <= $now) {
        $resetAt = $now + $windowSeconds;
        $update = $pdo->prepare('UPDATE rate_limits SET count = 1, reset_at = :reset_at WHERE key = :key');
        $update->execute([':reset_at' => $resetAt, ':key' => $key]);
        return true;
    }

    if ((int)$row['count'] >= $max) {
        return false;
    }

    $update = $pdo->prepare('UPDATE rate_limits SET count = count + 1 WHERE key = :key');
    $update->execute([':key' => $key]);
    return true;
}
