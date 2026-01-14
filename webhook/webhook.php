<?php
/**
 * VARMAN CONSTRUCTIONS - GitHub Webhook Handler
 * 
 * Setup:
 * 1. Go to GitHub repo → Settings → Webhooks → Add webhook
 * 2. Payload URL: https://varmanconstructions.in/webhook.php
 * 3. Content type: application/json
 * 4. Secret: varman-webhook-secret-2024
 * 5. Events: Just the push event
 */

$secret = 'varman-webhook-secret-2024';
$branch = 'main2';
$logFile = '/home/u244089748/deploy.log';

// Verify request
$headers = getallheaders();
$hubSignature = isset($headers['X-Hub-Signature-256']) ? $headers['X-Hub-Signature-256'] : '';

$payload = file_get_contents('php://input');
$payloadHash = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($payloadHash, $hubSignature)) {
    http_response_code(401);
    die('Unauthorized');
}

$data = json_decode($payload, true);

if (isset($data['ref']) && $data['ref'] === 'refs/heads/' . $branch) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Webhook received\n", FILE_APPEND);
    
    $deployScript = '/home/u244089748/domains/varmanconstructions.in/public_html/webhook/deploy.sh';
    exec("bash $deployScript >> $logFile 2>&1 &");
    
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Deployment triggered']);
} else {
    http_response_code(200);
    echo json_encode(['status' => 'skipped', 'message' => 'Not target branch']);
}
?>
