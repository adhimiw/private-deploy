<?php
$baseConfig = [
    'jwt_secret' => getenv('JWT_SECRET') ?: 'varman-constructions-dev-secret-key-2024-do-not-use-in-prod',
    'jwt_exp' => 60 * 60 * 24,
    'db_path' => dirname(__DIR__) . '/storage/varman.sqlite',
    'uploads_dir' => dirname(__DIR__) . '/assets/uploads',
    'uploads_url' => './assets/uploads',
    'admin_whatsapp' => '919944508736',
    'default_country_code' => '91',
    'admin_default_user' => 'admin',
    'admin_default_pass' => 'varman@2024',
    'admin_email' => getenv('ADMIN_EMAIL') ?: 'info@varmanconstructions.in',
    'smtp' => [
        'host' => getenv('SMTP_HOST') ?: '',
        'port' => getenv('SMTP_PORT') ?: 587,
        'user' => getenv('SMTP_USER') ?: '',
        'pass' => getenv('SMTP_PASS') ?: '',
        'from' => getenv('SMTP_FROM') ?: '',
        'secure' => getenv('SMTP_SECURE') ?: 'tls'
    ]
];

$overridePath = dirname(__DIR__) . '/storage/config.php';
if (file_exists($overridePath)) {
    $override = include $overridePath;
    if (is_array($override)) {
        $baseConfig = array_replace_recursive($baseConfig, $override);
    }
}

return $baseConfig;
