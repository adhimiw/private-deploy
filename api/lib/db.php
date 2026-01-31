<?php
require_once __DIR__ . '/utils.php';

function db() {
    static $pdo = null;
    if ($pdo) {
        return $pdo;
    }
    $config = require __DIR__ . '/../config.php';
    $dbPath = $config['db_path'];
    $dir = dirname($dbPath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA journal_mode = WAL;');
    init_db($pdo, $config);
    return $pdo;
}

function init_db($pdo, $config) {
    $pdo->exec('CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        role TEXT
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        icon TEXT,
        name TEXT,
        description TEXT,
        specifications TEXT,
        uses TEXT,
        advantages TEXT,
        unit TEXT,
        image TEXT,
        brands TEXT,
        sizes TEXT,
        types TEXT,
        grades TEXT,
        active INTEGER DEFAULT 1
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        answer TEXT,
        category TEXT,
        active INTEGER DEFAULT 1
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        material TEXT,
        message TEXT,
        project_location TEXT,
        created_at TEXT,
        read INTEGER DEFAULT 0
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        materials TEXT,
        quantity TEXT,
        project_details TEXT,
        timeline TEXT,
        created_at TEXT,
        status TEXT
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS analytics_views (
        date TEXT PRIMARY KEY,
        views INTEGER DEFAULT 0
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS analytics_clicks (
        element TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        path TEXT,
        ip TEXT,
        user_agent TEXT,
        timestamp TEXT,
        severity TEXT
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0,
        reset_at INTEGER
    )');

    seed_admin($pdo, $config);
    seed_products($pdo);
    seed_faqs($pdo);
}

function seed_admin($pdo, $config) {
    $count = (int)$pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
    if ($count > 0) {
        return;
    }
    $username = $config['admin_default_user'];
    $password = $config['admin_default_pass'];
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare('INSERT INTO admin_users (username, password_hash, role) VALUES (:u, :p, :r)');
    $stmt->execute([':u' => $username, ':p' => $hash, ':r' => 'admin']);
}

function seed_products($pdo) {
    $count = (int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    if ($count > 0) {
        return;
    }
    $products = [
        [
            'id' => 'm_sand',
            'icon' => 'layers',
            'name' => 'M-Sand (Manufactured Sand)',
            'description' => 'High-quality manufactured sand for all construction needs. Premium manufactured sand produced under controlled conditions for consistent quality and performance.',
            'specifications' => ['Fineness Modulus: 2.6-3.0', 'Silt Content: <3%', 'Water Absorption: <2%', 'Bulk Density: 1.75-1.85 kg/m³'],
            'uses' => ['Concrete mixing', 'Plastering work', 'Block work', 'Foundation construction'],
            'advantages' => ['Consistent quality', 'No impurities', 'Better workability', 'Environmentally friendly'],
            'unit' => 'per cubic meter',
            'image' => './assets/msand.webp',
            'active' => 1
        ],
        [
            'id' => 'p_sand',
            'icon' => 'droplets',
            'name' => 'P-Sand (Plastering Sand)',
            'description' => 'Fine plastering sand for smooth wall finishes. Specially processed plastering sand for achieving smooth and durable wall finishes.',
            'specifications' => ['Fineness Modulus: 1.8-2.2', 'Silt Content: <2%', 'Grain Size: 0.15-2.36mm'],
            'uses' => ['Wall plastering', 'Ceiling work', 'Fine finishing', 'Decorative plastering'],
            'advantages' => ['Ultra-fine texture', 'Smooth finish', 'Better adhesion', 'Reduced cracking'],
            'unit' => 'per cubic meter',
            'image' => './assets/psand.webp',
            'active' => 1
        ],
        [
            'id' => 'blue_metal',
            'icon' => 'zap',
            'name' => 'Blue Metal (Jalli)',
            'description' => 'Crushed stone aggregate for concrete and road construction. High-quality crushed blue granite stone available in various sizes.',
            'specifications' => ['20mm - Standard concrete', '40mm - Road construction', '12mm - Fine concrete work'],
            'uses' => ['Concrete mixing', 'Road base', 'Drainage systems', 'Foundation work'],
            'advantages' => ['High strength', 'Durable', 'Weather resistant', 'Multiple sizes available'],
            'unit' => 'per ton',
            'image' => './assets/blue metals.webp',
            'active' => 1
        ],
        [
            'id' => 'red_bricks',
            'icon' => 'home',
            'name' => 'Red Bricks',
            'description' => 'Traditional clay bricks for wall construction. Traditional kiln-fired clay bricks known for durability and thermal insulation.',
            'specifications' => ['Size: 9x4.5x3 inches', 'Compressive Strength: >3.5 N/mm²', 'Water Absorption: <20%'],
            'uses' => ['Wall construction', 'Boundary walls', 'Pillars', 'Load-bearing structures'],
            'advantages' => ['Good insulation', 'Fire resistant', 'Durable', 'Eco-friendly'],
            'unit' => 'per 1000 pieces',
            'image' => './assets/red brick.webp',
            'active' => 1
        ],
        [
            'id' => 'fly_ash_bricks',
            'icon' => 'leaf',
            'name' => 'Fly Ash Bricks',
            'description' => 'Eco-friendly bricks made from fly ash. Modern eco-friendly bricks offering better strength and uniform size.',
            'specifications' => ['Size: 9x4x3 inches', 'Compressive Strength: >7.5 N/mm²', 'Water Absorption: <12%'],
            'uses' => ['Wall construction', 'High-rise buildings', 'Commercial structures', 'Residential projects'],
            'advantages' => ['Higher strength', 'Uniform size', 'Less mortar required', 'Eco-friendly'],
            'unit' => 'per 1000 pieces',
            'image' => './assets/brick.webp',
            'active' => 1
        ],
        [
            'id' => 'concrete_blocks',
            'icon' => 'square',
            'name' => 'Concrete Blocks',
            'description' => 'Solid and hollow concrete blocks for construction. Machine-made concrete blocks available in solid and hollow variants.',
            'specifications' => ['Solid: 16x8x8 inches', 'Hollow: 16x8x8 inches', 'Compressive Strength: >4 N/mm²'],
            'uses' => ['Wall construction', 'Partition walls', 'Compound walls', 'Industrial buildings'],
            'advantages' => ['Quick construction', 'Cost-effective', 'Low maintenance', 'Sound insulation'],
            'unit' => 'per piece',
            'image' => './assets/concretate.webp',
            'active' => 1
        ],
        [
            'id' => 'cement',
            'icon' => 'package',
            'name' => 'Cement',
            'description' => 'Premium quality cement from top brands including UltraTech, ACC, Ramco, Dalmia, and Chettinad.',
            'specifications' => ['OPC 53 Grade', 'PPC Grade', 'PSC Grade available'],
            'uses' => ['Concrete mixing', 'Plastering', 'Masonry work', 'Foundation'],
            'advantages' => ['Top brands', 'Fresh stock', 'Bulk discounts', 'Doorstep delivery'],
            'unit' => 'per bag (50kg)',
            'brands' => ['UltraTech', 'ACC', 'Ramco', 'Dalmia', 'Chettinad'],
            'image' => './assets/cement.webp',
            'active' => 1
        ],
        [
            'id' => 'aac_blocks',
            'icon' => 'box',
            'name' => 'AAC Blocks',
            'description' => 'Lightweight autoclaved aerated concrete blocks. Modern AAC blocks offering excellent thermal insulation and faster construction.',
            'specifications' => ['Sizes: 600x200x100mm to 600x200x300mm', 'Density: 550-650 kg/m³', 'Compressive Strength: 3-4.5 N/mm²'],
            'uses' => ['High-rise construction', 'Green buildings', 'Commercial complexes', 'Residential projects'],
            'advantages' => ['Lightweight', 'Thermal insulation', 'Fire resistant', 'Earthquake resistant'],
            'unit' => 'per cubic meter',
            'image' => './assets/acc.webp',
            'active' => 1
        ],
        [
            'id' => 'size_stone',
            'icon' => 'mountain',
            'name' => 'Size Stone / Rough Stone',
            'description' => 'Natural stones for foundation and compound walls. Natural rough stones and cut size stones for foundation work.',
            'specifications' => ['Rough Stone: Various sizes', 'Size Stone: 9x6 inches standard'],
            'uses' => ['Foundation work', 'Compound walls', 'Retaining walls', 'Landscaping'],
            'advantages' => ['Natural material', 'High durability', 'Load-bearing capacity', 'Aesthetic appeal'],
            'unit' => 'per sq.ft',
            'image' => './assets/sizestone.webp',
            'active' => 1
        ]
    ];

    $stmt = $pdo->prepare('INSERT INTO products (id, icon, name, description, specifications, uses, advantages, unit, image, brands, sizes, types, grades, active)
        VALUES (:id, :icon, :name, :description, :specs, :uses, :advantages, :unit, :image, :brands, :sizes, :types, :grades, :active)');

    foreach ($products as $p) {
        $stmt->execute([
            ':id' => $p['id'],
            ':icon' => $p['icon'],
            ':name' => $p['name'],
            ':description' => $p['description'],
            ':specs' => json_encode($p['specifications'] ?? []),
            ':uses' => json_encode($p['uses'] ?? []),
            ':advantages' => json_encode($p['advantages'] ?? []),
            ':unit' => $p['unit'],
            ':image' => $p['image'],
            ':brands' => json_encode($p['brands'] ?? []),
            ':sizes' => json_encode($p['sizes'] ?? []),
            ':types' => json_encode($p['types'] ?? []),
            ':grades' => json_encode($p['grades'] ?? []),
            ':active' => $p['active']
        ]);
    }
}

function seed_faqs($pdo) {
    $count = (int)$pdo->query('SELECT COUNT(*) FROM faqs')->fetchColumn();
    if ($count > 0) {
        return;
    }
    $faqs = [
        [
            'question' => 'What areas do you deliver to?',
            'answer' => 'We deliver across Tamil Nadu with a primary focus on Southern regions including Tirunelveli, Thoothukudi, Kanyakumari, Madurai, and surrounding districts. We also serve parts of Kerala and Karnataka for bulk orders.',
            'category' => 'delivery'
        ],
        [
            'question' => 'What is the minimum order quantity?',
            'answer' => 'Minimum order varies by product: M-Sand/P-Sand - 1 unit (approximately 1 cubic meter), Blue Metal - 1 ton, Bricks - 1000 pieces, Cement - 10 bags. For smaller quantities, please contact us directly.',
            'category' => 'orders'
        ],
        [
            'question' => 'Do you provide quality certifications?',
            'answer' => 'Yes, all our materials meet IS (Indian Standard) specifications. We provide quality test reports and certifications upon request. Our M-Sand and aggregates are tested regularly for gradation, silt content, and other parameters.',
            'category' => 'quality'
        ],
        [
            'question' => 'What are your payment terms?',
            'answer' => 'We accept cash, bank transfer, UPI, and cheques. For new customers, advance payment is required. Regular customers can avail credit facilities based on their transaction history. GST bills are provided for all orders.',
            'category' => 'payment'
        ],
        [
            'question' => 'How quickly can you deliver?',
            'answer' => 'Standard delivery within 24-48 hours for orders placed before 2 PM within our primary service area. Express delivery available for urgent requirements. Delivery time may vary for remote locations or bulk orders.',
            'category' => 'delivery'
        ],
        [
            'question' => 'Do you offer bulk discounts?',
            'answer' => 'Yes, we offer attractive discounts for bulk orders and regular customers. Volume-based pricing is available for construction projects. Contact us with your requirements for a customized quotation.',
            'category' => 'pricing'
        ]
    ];
    $stmt = $pdo->prepare('INSERT INTO faqs (question, answer, category, active) VALUES (:q, :a, :c, 1)');
    foreach ($faqs as $faq) {
        $stmt->execute([':q' => $faq['question'], ':a' => $faq['answer'], ':c' => $faq['category']]);
    }
}

function product_from_row($row) {
    return [
        'id' => $row['id'],
        'icon' => $row['icon'],
        'name' => $row['name'],
        'description' => $row['description'],
        'specifications' => json_decode($row['specifications'] ?: '[]', true) ?: [],
        'uses' => json_decode($row['uses'] ?: '[]', true) ?: [],
        'advantages' => json_decode($row['advantages'] ?: '[]', true) ?: [],
        'unit' => $row['unit'],
        'image' => $row['image'],
        'brands' => json_decode($row['brands'] ?: '[]', true) ?: [],
        'sizes' => json_decode($row['sizes'] ?: '[]', true) ?: null,
        'types' => json_decode($row['types'] ?: '[]', true) ?: null,
        'grades' => json_decode($row['grades'] ?: '[]', true) ?: null,
        'active' => (bool)$row['active']
    ];
}
