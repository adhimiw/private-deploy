<?php
$config = require __DIR__ . '/config.php';

require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/lib/utils.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/jwt.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/rate_limit.php';
require_once __DIR__ . '/lib/mail.php';

no_cache_headers();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = $uriPath;
if (strpos($path, '/api/') === 0) {
    $path = substr($path, 4);
} elseif ($path === '/api') {
    $path = '';
}
$segments = array_values(array_filter(explode('/', trim($path, '/'))));

$pdo = db();

function normalize_list($value) {
    if (is_array($value)) {
        return $value;
    }
    if (is_string($value)) {
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        $lines = array_filter(array_map('trim', explode("\n", $value)));
        return array_values($lines);
    }
    return [];
}

function json_row_list($rows, $key) {
    return json_decode($rows[$key] ?: '[]', true) ?: [];
}

function get_analytics($pdo) {
    $views = (int)$pdo->query('SELECT COALESCE(SUM(views), 0) FROM analytics_views')->fetchColumn();
    $clickRows = $pdo->query('SELECT element, count FROM analytics_clicks')->fetchAll(PDO::FETCH_ASSOC);
    $clicks = [];
    foreach ($clickRows as $row) {
        $clicks[$row['element']] = (int)$row['count'];
    }
    $historyRows = $pdo->query('SELECT date, views FROM analytics_views ORDER BY date DESC LIMIT 7')->fetchAll(PDO::FETCH_ASSOC);
    $history = [];
    foreach ($historyRows as $row) {
        $history[] = ['date' => $row['date'], 'views' => (int)$row['views']];
    }
    return [
        'views' => $views,
        'clicks' => $clicks,
        'history' => $history
    ];
}

function log_security_event($pdo, $type, $path, $ip, $userAgent, $severity = 'HIGH') {
    $stmt = $pdo->prepare('INSERT INTO security_logs (type, path, ip, user_agent, timestamp, severity) VALUES (:t, :p, :i, :u, :ts, :s)');
    $stmt->execute([
        ':t' => $type,
        ':p' => $path,
        ':i' => $ip,
        ':u' => $userAgent,
        ':ts' => gmdate('c'),
        ':s' => $severity
    ]);
}

// ROUTES
if (empty($segments)) {
    json_response(['status' => 'ok', 'message' => 'API is running']);
}

switch ($segments[0]) {
    case 'health':
        if ($method === 'GET') {
            json_response(['status' => 'ok', 'timestamp' => gmdate('c')]);
        }
        break;

    case 'products':
        if ($method === 'GET' && count($segments) === 1) {
            $stmt = $pdo->prepare('SELECT * FROM products WHERE active = 1');
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $products = [];
            foreach ($rows as $row) {
                $products[] = product_from_row($row);
            }
            json_response(['products' => $products]);
        }
        if ($method === 'GET' && count($segments) === 2) {
            $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id AND active = 1');
            $stmt->execute([':id' => $segments[1]]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) {
                json_response(['error' => 'Product not found'], 404);
            }
            json_response(['product' => product_from_row($row)]);
        }
        break;

    case 'faqs':
        if ($method === 'GET') {
            $stmt = $pdo->prepare('SELECT * FROM faqs WHERE active = 1');
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_response(['faqs' => $rows]);
        }
        break;

    case 'contact':
        if ($method === 'POST') {
            $ip = get_client_ip();
            if (!check_rate_limit('contact:' . $ip, 10, 3600)) {
                json_response(['error' => 'Too many submissions, please try again later.'], 429);
            }
            $data = get_json_body();
            $name = sanitize_input($data['name'] ?? '', 100);
            $email = sanitize_input($data['email'] ?? '', 200);
            $phone = sanitize_input($data['phone'] ?? '', 20);
            $material = sanitize_input($data['material'] ?? 'Not specified', 100);
            $message = sanitize_input($data['message'] ?? '', 2000);
            $projectLocation = sanitize_input($data['project_location'] ?? 'Not specified', 200);

            if (!$name || !$email || !$phone || !$message) {
                json_response(['error' => 'Required fields missing'], 400);
            }

            $stmt = $pdo->prepare('INSERT INTO contacts (name, email, phone, material, message, project_location, created_at, read) VALUES (:n, :e, :p, :m, :msg, :pl, :ts, 0)');
            $stmt->execute([
                ':n' => $name,
                ':e' => $email,
                ':p' => $phone,
                ':m' => $material ?: 'Not specified',
                ':msg' => $message,
                ':pl' => $projectLocation,
                ':ts' => gmdate('c')
            ]);

            $adminNumber = $config['admin_whatsapp'] ?? '919944508736';
            $defaultCountryCode = $config['default_country_code'] ?? '91';
            $userNumber = normalize_phone($phone, $defaultCountryCode);

            $whatsappAdminMessage = "New Contact Form Submission!\n\n*Customer Details:*\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\nMaterial: {$material}\nProject Location: {$projectLocation}\n\n*Message:*\n{$message}\n\nPlease follow up promptly.";
            $whatsappAdminUrl = 'https://wa.me/' . $adminNumber . '?text=' . rawurlencode($whatsappAdminMessage);

            $whatsappUserMessage = "Hi {$name}, thanks for contacting VARMAN CONSTRUCTIONS! We received your inquiry for {$material}.\n\nWe will contact you shortly with details. If urgent, you can reply here.\n\nReference: " . gmdate('Ymd-His');
            $whatsappUserUrl = $userNumber ? ('https://wa.me/' . $userNumber . '?text=' . rawurlencode($whatsappUserMessage)) : '';

            $adminEmailBody = "New Contact Form Submission:\n\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\nMaterial: {$material}\nProject Location: {$projectLocation}\n\nMessage:\n{$message}\n\nWhatsApp (Admin): {$whatsappAdminUrl}\nWhatsApp (User): {$whatsappUserUrl}\n";
            $emailSentAdmin = send_email_notification($config, 'New Contact Form - Varman Constructions', $adminEmailBody);

            $userEmailBody = "Hi {$name},\n\nThank you for contacting VARMAN CONSTRUCTIONS!\n\nWe received your inquiry and our team will get back to you shortly.\n\nSummary:\nMaterial: {$material}\nProject Location: {$projectLocation}\nMessage: {$message}\n\nRegards,\nVARMAN CONSTRUCTIONS\nhttps://varmanconstructions.in";
            $emailSentUser = send_email_notification($config, 'Thanks for contacting Varman Constructions', $userEmailBody, $email);

            json_response([
                'success' => true,
                'message' => 'Contact form submitted successfully',
                'whatsapp_url' => $whatsappAdminUrl,
                'whatsapp_admin_url' => $whatsappAdminUrl,
                'whatsapp_user_url' => $whatsappUserUrl,
                'email_sent_admin' => $emailSentAdmin,
                'email_sent_user' => $emailSentUser
            ]);
        }
        break;

    case 'quote':
        if ($method === 'POST') {
            $ip = get_client_ip();
            if (!check_rate_limit('quote:' . $ip, 10, 3600)) {
                json_response(['error' => 'Too many submissions, please try again later.'], 429);
            }
            $data = get_json_body();
            $name = sanitize_input($data['name'] ?? '', 100);
            $email = sanitize_input($data['email'] ?? '', 200);
            $phone = sanitize_input($data['phone'] ?? '', 20);
            $materials = $data['materials'] ?? [];
            $materials = is_array($materials) ? $materials : [$materials];
            $quantity = sanitize_input($data['quantity'] ?? '', 200);
            $projectDetails = sanitize_input($data['project_details'] ?? '', 2000);
            $timeline = sanitize_input($data['timeline'] ?? 'Not specified', 100);

            if (!$name || !$email || !$phone || !$materials || !$quantity) {
                json_response(['error' => 'Required fields missing'], 400);
            }

            $stmt = $pdo->prepare('INSERT INTO quotes (name, email, phone, materials, quantity, project_details, timeline, created_at, status) VALUES (:n, :e, :p, :m, :q, :pd, :t, :ts, :s)');
            $stmt->execute([
                ':n' => $name,
                ':e' => $email,
                ':p' => $phone,
                ':m' => json_encode($materials),
                ':q' => $quantity,
                ':pd' => $projectDetails,
                ':t' => $timeline,
                ':ts' => gmdate('c'),
                ':s' => 'pending'
            ]);

            $materialsList = implode(', ', $materials);
            $whatsappMessage = "Hello Varman Constructions!\n\nI need a quotation for building materials.\n\n*My Details:*\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\n\n*Requirements:*\nMaterials: {$materialsList}\nQuantity: {$quantity}\nTimeline: {$timeline}\n\n*Project Details:*\n{$projectDetails}";
            $whatsappUrl = 'https://wa.me/917708484811?text=' . rawurlencode($whatsappMessage);

            $emailBody = "New Quote Request:\n\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\nMaterials: {$materialsList}\nQuantity: {$quantity}\nTimeline: {$timeline}\n\nProject Details:\n{$projectDetails}\n";
            $emailSent = send_email_notification($config, 'New Quote Request - Varman Constructions', $emailBody);

            json_response([
                'success' => true,
                'message' => 'Quote request submitted successfully',
                'whatsapp_url' => $whatsappUrl,
                'email_sent' => $emailSent
            ]);
        }
        break;

    case 'admin':
        if (count($segments) >= 2 && $segments[1] === 'login' && $method === 'POST') {
            $ip = get_client_ip();
            if (!check_rate_limit('login:' . $ip, 5, 900)) {
                json_response(['error' => 'Too many login attempts, please try again later.'], 429);
            }
            $data = get_json_body();
            $username = strtolower(trim($data['username'] ?? ''));
            $password = $data['password'] ?? '';
            if (!$username || !$password) {
                json_response(['error' => 'Invalid credentials format'], 400);
            }
            $stmt = $pdo->prepare('SELECT * FROM admin_users WHERE username = :u LIMIT 1');
            $stmt->execute([':u' => $username]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$admin || !password_verify($password, $admin['password_hash'])) {
                usleep(100000);
                json_response(['error' => 'Invalid credentials'], 401);
            }
            $payload = [
                'id' => (int)$admin['id'],
                'username' => $admin['username'],
                'role' => $admin['role'],
                'iat' => time(),
                'exp' => time() + $config['jwt_exp']
            ];
            $token = jwt_encode($payload, $config['jwt_secret']);
            json_response(['success' => true, 'token' => $token, 'user' => ['username' => $admin['username'], 'role' => $admin['role']]]);
        }

        if (count($segments) >= 2 && $segments[1] === 'verify' && $method === 'GET') {
            $user = require_auth($config);
            json_response(['valid' => true, 'user' => $user]);
        }

        if (count($segments) >= 2 && $segments[1] === 'upload') {
            $user = require_auth($config);
            $uploadDir = $config['uploads_dir'];
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            if ($method === 'POST') {
                if (!isset($_FILES['image'])) {
                    json_response(['error' => 'No file uploaded'], 400);
                }
                $file = $_FILES['image'];
                if ($file['error'] !== UPLOAD_ERR_OK) {
                    json_response(['error' => 'Upload error'], 400);
                }
                if ($file['size'] > 5 * 1024 * 1024) {
                    json_response(['error' => 'File too large. Maximum size is 5MB.'], 400);
                }
                $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                if (!in_array($ext, $allowedExt, true)) {
                    json_response(['error' => 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'], 400);
                }
                $safeBase = preg_replace('/[^a-zA-Z0-9.-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
                $safeBase = preg_replace('/_{2,}/', '_', $safeBase);
                $unique = bin2hex(random_bytes(6));
                $filename = strtolower($safeBase . '_' . $unique . '.' . $ext);
                $targetPath = rtrim($uploadDir, '/\\') . '/' . $filename;
                if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                    json_response(['error' => 'Failed to save file'], 500);
                }
                $path = rtrim($config['uploads_url'], '/') . '/' . $filename;
                json_response([
                    'success' => true,
                    'filename' => $filename,
                    'path' => $path,
                    'size' => $file['size'],
                    'mimetype' => $file['type']
                ]);
            }

            if ($method === 'DELETE' && count($segments) === 3) {
                $filename = $segments[2];
                if (strpos($filename, '..') !== false || strpos($filename, '/') !== false || strpos($filename, '\\') !== false) {
                    json_response(['error' => 'Invalid filename'], 400);
                }
                $filePath = rtrim($uploadDir, '/\\') . '/' . $filename;
                if (!file_exists($filePath)) {
                    json_response(['error' => 'File not found'], 404);
                }
                if (!unlink($filePath)) {
                    json_response(['error' => 'Failed to delete image'], 500);
                }
                json_response(['success' => true, 'message' => 'Image deleted successfully']);
            }
        }

        if (count($segments) >= 2 && $segments[1] === 'images' && $method === 'GET') {
            $user = require_auth($config);
            $assetsDir = dirname(__DIR__) . '/assets';
            $uploadDir = $config['uploads_dir'];
            $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            $images = [];
            $paths = [$assetsDir, $uploadDir];
            foreach ($paths as $dir) {
                if (!is_dir($dir)) {
                    continue;
                }
                $files = scandir($dir);
                foreach ($files as $file) {
                    if ($file === '.' || $file === '..') {
                        continue;
                    }
                    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    if (!in_array($ext, $allowedExt, true)) {
                        continue;
                    }
                    $filePath = rtrim($dir, '/\\') . '/' . $file;
                    if (!is_file($filePath)) {
                        continue;
                    }
                    $stat = stat($filePath);
                    $relativePath = ($dir === $uploadDir)
                        ? rtrim($config['uploads_url'], '/') . '/' . $file
                        : './assets/' . $file;
                    $images[] = [
                        'filename' => $file,
                        'path' => $relativePath,
                        'size' => $stat['size'],
                        'uploadedAt' => gmdate('c', $stat['mtime'])
                    ];
                }
            }
            usort($images, function ($a, $b) {
                return strtotime($b['uploadedAt']) <=> strtotime($a['uploadedAt']);
            });
            json_response(['images' => $images]);
        }

        if (count($segments) >= 2 && $segments[1] === 'products') {
            $user = require_auth($config);
            if ($method === 'GET' && count($segments) === 2) {
                $rows = $pdo->query('SELECT * FROM products')->fetchAll(PDO::FETCH_ASSOC);
                $products = [];
                foreach ($rows as $row) {
                    $products[] = product_from_row($row);
                }
                json_response(['products' => $products]);
            }
            if ($method === 'POST' && count($segments) === 2) {
                $data = get_json_body();
                $id = sanitize_input($data['id'] ?? '', 100);
                $name = sanitize_input($data['name'] ?? '', 200);
                if (!$id || !$name) {
                    json_response(['error' => 'Product ID and name required'], 400);
                }
                $exists = $pdo->prepare('SELECT COUNT(*) FROM products WHERE id = :id');
                $exists->execute([':id' => $id]);
                if ((int)$exists->fetchColumn() > 0) {
                    json_response(['error' => 'Product ID already exists'], 400);
                }
                $specs = normalize_list($data['specifications'] ?? []);
                $uses = normalize_list($data['uses'] ?? []);
                $advantages = normalize_list($data['advantages'] ?? []);
                $brands = normalize_list($data['brands'] ?? []);
                $sizes = $data['sizes'] ?? [];
                $types = $data['types'] ?? [];
                $grades = $data['grades'] ?? [];

                $stmt = $pdo->prepare('INSERT INTO products (id, icon, name, description, specifications, uses, advantages, unit, image, brands, sizes, types, grades, active)
                    VALUES (:id, :icon, :name, :description, :specs, :uses, :advantages, :unit, :image, :brands, :sizes, :types, :grades, :active)');
                $stmt->execute([
                    ':id' => $id,
                    ':icon' => sanitize_input($data['icon'] ?? 'box', 50),
                    ':name' => $name,
                    ':description' => sanitize_input($data['description'] ?? '', 2000),
                    ':specs' => json_encode($specs),
                    ':uses' => json_encode($uses),
                    ':advantages' => json_encode($advantages),
                    ':unit' => sanitize_input($data['unit'] ?? 'per unit', 50),
                    ':image' => sanitize_input($data['image'] ?? './assets/default.webp', 200),
                    ':brands' => json_encode($brands),
                    ':sizes' => json_encode($sizes),
                    ':types' => json_encode($types),
                    ':grades' => json_encode($grades),
                    ':active' => 1
                ]);
                $row = $pdo->prepare('SELECT * FROM products WHERE id = :id');
                $row->execute([':id' => $id]);
                json_response(['success' => true, 'product' => product_from_row($row->fetch(PDO::FETCH_ASSOC))]);
            }
            if ($method === 'PUT' && count($segments) === 3) {
                $id = $segments[2];
                $data = get_json_body();
                $fields = [];
                $params = [':id' => $id];
                $map = [
                    'icon' => 'icon',
                    'name' => 'name',
                    'description' => 'description',
                    'unit' => 'unit',
                    'image' => 'image',
                    'active' => 'active'
                ];
                foreach ($map as $key => $col) {
                    if (array_key_exists($key, $data)) {
                        $fields[] = "$col = :$key";
                        $params[":$key"] = $key === 'active' ? (int)!empty($data[$key]) : sanitize_input($data[$key], 2000);
                    }
                }
                if (array_key_exists('specifications', $data)) {
                    $fields[] = 'specifications = :specifications';
                    $params[':specifications'] = json_encode(normalize_list($data['specifications']));
                }
                if (array_key_exists('uses', $data)) {
                    $fields[] = 'uses = :uses';
                    $params[':uses'] = json_encode(normalize_list($data['uses']));
                }
                if (array_key_exists('advantages', $data)) {
                    $fields[] = 'advantages = :advantages';
                    $params[':advantages'] = json_encode(normalize_list($data['advantages']));
                }
                if (array_key_exists('brands', $data)) {
                    $fields[] = 'brands = :brands';
                    $params[':brands'] = json_encode(normalize_list($data['brands']));
                }
                if (array_key_exists('sizes', $data)) {
                    $fields[] = 'sizes = :sizes';
                    $params[':sizes'] = json_encode($data['sizes']);
                }
                if (array_key_exists('types', $data)) {
                    $fields[] = 'types = :types';
                    $params[':types'] = json_encode($data['types']);
                }
                if (array_key_exists('grades', $data)) {
                    $fields[] = 'grades = :grades';
                    $params[':grades'] = json_encode($data['grades']);
                }

                if (empty($fields)) {
                    json_response(['error' => 'No fields to update'], 400);
                }
                $sql = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = :id';
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $row = $pdo->prepare('SELECT * FROM products WHERE id = :id');
                $row->execute([':id' => $id]);
                $updated = $row->fetch(PDO::FETCH_ASSOC);
                if (!$updated) {
                    json_response(['error' => 'Product not found'], 404);
                }
                json_response(['success' => true, 'product' => product_from_row($updated)]);
            }
            if ($method === 'DELETE' && count($segments) === 3) {
                $id = $segments[2];
                $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
                $stmt->execute([':id' => $id]);
                if ($stmt->rowCount() === 0) {
                    json_response(['error' => 'Product not found'], 404);
                }
                json_response(['success' => true, 'message' => 'Product deleted permanently']);
            }
        }

        if (count($segments) >= 2 && $segments[1] === 'faqs') {
            $user = require_auth($config);
            if ($method === 'GET' && count($segments) === 2) {
                $rows = $pdo->query('SELECT * FROM faqs')->fetchAll(PDO::FETCH_ASSOC);
                json_response(['faqs' => $rows]);
            }
            if ($method === 'POST' && count($segments) === 2) {
                $data = get_json_body();
                $question = sanitize_input($data['question'] ?? '', 300);
                $answer = sanitize_input($data['answer'] ?? '', 2000);
                $category = sanitize_input($data['category'] ?? 'general', 50);
                if (!$question || !$answer) {
                    json_response(['error' => 'Question and answer required'], 400);
                }
                $stmt = $pdo->prepare('INSERT INTO faqs (question, answer, category, active) VALUES (:q, :a, :c, 1)');
                $stmt->execute([':q' => $question, ':a' => $answer, ':c' => $category]);
                $id = $pdo->lastInsertId();
                $row = $pdo->prepare('SELECT * FROM faqs WHERE id = :id');
                $row->execute([':id' => $id]);
                json_response(['success' => true, 'faq' => $row->fetch(PDO::FETCH_ASSOC)]);
            }
            if ($method === 'PUT' && count($segments) === 3) {
                $id = (int)$segments[2];
                $data = get_json_body();
                $fields = [];
                $params = [':id' => $id];
                foreach (['question', 'answer', 'category'] as $field) {
                    if (array_key_exists($field, $data)) {
                        $fields[] = "$field = :$field";
                        $params[":$field"] = sanitize_input($data[$field], 2000);
                    }
                }
                if (array_key_exists('active', $data)) {
                    $fields[] = 'active = :active';
                    $params[':active'] = (int)!empty($data['active']);
                }
                if (empty($fields)) {
                    json_response(['error' => 'No fields to update'], 400);
                }
                $stmt = $pdo->prepare('UPDATE faqs SET ' . implode(', ', $fields) . ' WHERE id = :id');
                $stmt->execute($params);
                if ($stmt->rowCount() === 0) {
                    json_response(['error' => 'FAQ not found'], 404);
                }
                $row = $pdo->prepare('SELECT * FROM faqs WHERE id = :id');
                $row->execute([':id' => $id]);
                json_response(['success' => true, 'faq' => $row->fetch(PDO::FETCH_ASSOC)]);
            }
            if ($method === 'DELETE' && count($segments) === 3) {
                $id = (int)$segments[2];
                $stmt = $pdo->prepare('DELETE FROM faqs WHERE id = :id');
                $stmt->execute([':id' => $id]);
                if ($stmt->rowCount() === 0) {
                    json_response(['error' => 'FAQ not found'], 404);
                }
                json_response(['success' => true, 'message' => 'FAQ deleted permanently']);
            }
        }

        if (count($segments) >= 2 && $segments[1] === 'contacts') {
            $user = require_auth($config);
            if ($method === 'GET' && count($segments) === 2) {
                $rows = $pdo->query('SELECT * FROM contacts ORDER BY id DESC')->fetchAll(PDO::FETCH_ASSOC);
                json_response(['contacts' => $rows]);
            }
            if ($method === 'PUT' && count($segments) === 3) {
                $id = (int)$segments[2];
                $data = get_json_body();
                $fields = [];
                $params = [':id' => $id];
                if (array_key_exists('read', $data)) {
                    $fields[] = 'read = :read';
                    $params[':read'] = (int)!empty($data['read']);
                }
                if (empty($fields)) {
                    json_response(['error' => 'No fields to update'], 400);
                }
                $stmt = $pdo->prepare('UPDATE contacts SET ' . implode(', ', $fields) . ' WHERE id = :id');
                $stmt->execute($params);
                if ($stmt->rowCount() === 0) {
                    json_response(['error' => 'Contact not found'], 404);
                }
                $row = $pdo->prepare('SELECT * FROM contacts WHERE id = :id');
                $row->execute([':id' => $id]);
                json_response(['success' => true, 'contact' => $row->fetch(PDO::FETCH_ASSOC)]);
            }
            if ($method === 'DELETE' && count($segments) === 3) {
                $id = (int)$segments[2];
                $stmt = $pdo->prepare('DELETE FROM contacts WHERE id = :id');
                $stmt->execute([':id' => $id]);
                if ($stmt->rowCount() === 0) {
                    json_response(['error' => 'Contact not found'], 404);
                }
                json_response(['success' => true, 'message' => 'Contact deleted']);
            }
        }

        if (count($segments) >= 2 && $segments[1] === 'quotes') {
            $user = require_auth($config);
            if ($method === 'GET' && count($segments) === 2) {
                $rows = $pdo->query('SELECT * FROM quotes ORDER BY id DESC')->fetchAll(PDO::FETCH_ASSOC);
                foreach ($rows as &$row) {
                    $row['materials'] = json_decode($row['materials'] ?: '[]', true) ?: [];
                }
                json_response(['quotes' => $rows]);
            }
            if ($method === 'PUT' && count($segments) === 3) {
                $id = (int)$segments[2];
                $data = get_json_body();
                $fields = [];
                $params = [':id' => $id];
                foreach (['status', 'timeline', 'project_details', 'quantity'] as $field) {
                    if (array_key_exists($field, $data)) {
                        $fields[] = "$field = :$field";
                        $params[":$field"] = sanitize_input($data[$field], 2000);
                    }
                }
                if (array_key_exists('materials', $data)) {
                    $fields[] = 'materials = :materials';
                    $params[':materials'] = json_encode(is_array($data['materials']) ? $data['materials'] : [$data['materials']]);
                }
                if (empty($fields)) {
                    json_response(['error' => 'No fields to update'], 400);
                }
                $stmt = $pdo->prepare('UPDATE quotes SET ' . implode(', ', $fields) . ' WHERE id = :id');
                $stmt->execute($params);
                if ($stmt->rowCount() === 0) {
                    json_response(['error' => 'Quote not found'], 404);
                }
                $row = $pdo->prepare('SELECT * FROM quotes WHERE id = :id');
                $row->execute([':id' => $id]);
                $quote = $row->fetch(PDO::FETCH_ASSOC);
                $quote['materials'] = json_decode($quote['materials'] ?: '[]', true) ?: [];
                json_response(['success' => true, 'quote' => $quote]);
            }
            if ($method === 'DELETE' && count($segments) === 3) {
                $id = (int)$segments[2];
                $stmt = $pdo->prepare('DELETE FROM quotes WHERE id = :id');
                $stmt->execute([':id' => $id]);
                if ($stmt->rowCount() === 0) {
                    json_response(['error' => 'Quote not found'], 404);
                }
                json_response(['success' => true, 'message' => 'Quote deleted']);
            }
        }

        if (count($segments) >= 2 && $segments[1] === 'stats' && $method === 'GET') {
            $user = require_auth($config);
            $activeProducts = (int)$pdo->query('SELECT COUNT(*) FROM products WHERE active = 1')->fetchColumn();
            $totalProducts = (int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
            $activeFaqs = (int)$pdo->query('SELECT COUNT(*) FROM faqs WHERE active = 1')->fetchColumn();
            $totalFaqs = (int)$pdo->query('SELECT COUNT(*) FROM faqs')->fetchColumn();
            $pendingQuotes = (int)$pdo->query("SELECT COUNT(*) FROM quotes WHERE status = 'pending'")->fetchColumn();
            $unreadContacts = (int)$pdo->query('SELECT COUNT(*) FROM contacts WHERE read = 0')->fetchColumn();
            $totalContacts = (int)$pdo->query('SELECT COUNT(*) FROM contacts')->fetchColumn();
            $totalQuotes = (int)$pdo->query('SELECT COUNT(*) FROM quotes')->fetchColumn();
            $analytics = get_analytics($pdo);
            $securityEvents = $pdo->query('SELECT * FROM security_logs ORDER BY id DESC LIMIT 50')->fetchAll(PDO::FETCH_ASSOC);

            json_response([
                'products' => $activeProducts,
                'totalProducts' => $totalProducts,
                'faqs' => $activeFaqs,
                'totalFaqs' => $totalFaqs,
                'pendingQuotes' => $pendingQuotes,
                'unreadContacts' => $unreadContacts,
                'totalContacts' => $totalContacts,
                'totalQuotes' => $totalQuotes,
                'analytics' => $analytics,
                'securityEvents' => $securityEvents
            ]);
        }
        break;

    case 'analytics':
        if (count($segments) === 2 && $segments[1] === 'track' && $method === 'POST') {
            $data = get_json_body();
            $type = $data['type'] ?? '';
            if ($type === 'view') {
                $date = gmdate('Y-m-d');
                $stmt = $pdo->prepare('INSERT INTO analytics_views (date, views) VALUES (:d, 1)
                    ON CONFLICT(date) DO UPDATE SET views = views + 1');
                $stmt->execute([':d' => $date]);
            } elseif ($type === 'click' && !empty($data['element'])) {
                $element = sanitize_input($data['element'], 100);
                $stmt = $pdo->prepare('INSERT INTO analytics_clicks (element, count) VALUES (:e, 1)
                    ON CONFLICT(element) DO UPDATE SET count = count + 1');
                $stmt->execute([':e' => $element]);
            }
            json_response(['success' => true]);
        }
        break;

    case 'security':
        if (count($segments) === 2 && $segments[1] === 'alert' && $method === 'POST') {
            $data = get_json_body();
            $type = sanitize_input($data['type'] ?? 'SUSPICIOUS_ACTIVITY', 100);
            $pathValue = sanitize_input($data['path'] ?? 'unknown', 200);
            $userAgent = sanitize_input($data['userAgent'] ?? ($_SERVER['HTTP_USER_AGENT'] ?? ''), 300);
            $ip = sanitize_input($data['ip'] ?? get_client_ip(), 100);
            log_security_event($pdo, $type, $pathValue, $ip, $userAgent, 'HIGH');
            json_response(['success' => true, 'fakeToken' => '8d9a8f9a8d9a8f...']);
        }
        break;
}

json_response(['error' => 'Not found'], 404);
