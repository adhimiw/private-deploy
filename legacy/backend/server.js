const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============ SECURITY: Trust Proxy (for Hostinger/reverse proxy) ============
// Required for express-rate-limit to work correctly behind a reverse proxy
app.set('trust proxy', 1);

// ============ SECURITY: JWT Secret Validation ============
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('⚠️  WARNING: JWT_SECRET must be set in .env file and be at least 32 characters!');
  console.error('⚠️  Using default secret for development only. DO NOT USE IN PRODUCTION!');
}
const SECURE_JWT_SECRET = JWT_SECRET || 'varman-constructions-dev-secret-key-2024-do-not-use-in-prod';

// ============ SECURITY: Rate Limiting ============
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 form submissions per hour
  message: { error: 'Too many submissions, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============ SECURITY: CORS Configuration ============
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3001', 'http://127.0.0.1:3001'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Data file path (localStorage equivalent - persists to JSON file)
const DATA_FILE = path.join(__dirname, 'data.json');

// ============ SECURE IMAGE UPLOAD CONFIGURATION ============

// Allowed file types for security
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max

// Upload directory (assets folder in parent directory)
const UPLOAD_DIR = path.join(__dirname, '..', 'assets');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate secure unique filename
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
    const baseName = path.basename(safeName, ext);
    const finalName = `${baseName}_${uniqueId}${ext}`;
    cb(null, finalName);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
  }
  
  // Check extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error('Invalid file extension.'), false);
  }
  
  cb(null, true);
};

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  }
});

// ============ SECURITY MIDDLEWARE ============

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://wa.me"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS with secure configuration
app.use(cors(corsOptions));

// Rate limiting
app.use('/api/', generalLimiter);

// Body parser with size limit (prevent large payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '..'), {
  dotfiles: 'ignore',
  etag: false, // Disable ETag to prevent 304 Not Modified when we want fresh loads
  maxAge: '0', // Disable caching during development/updates
}));

// ============ INPUT SANITIZATION HELPER ============
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim()
    .slice(0, 5000); // Limit string length
};

// ============ LOCAL STORAGE (JSON FILE) HELPER FUNCTIONS ============

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  // Return default data if file doesn't exist
  const defaultData = getDefaultData();
  saveData(defaultData);
  return defaultData;
};

const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

const getDefaultData = () => ({
  adminUsers: [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('varman@2024', 10),
      role: 'admin'
    }
  ],
  products: [
    {
      id: 'm_sand',
      icon: 'layers',
      name: 'M-Sand (Manufactured Sand)',
      description: 'High-quality manufactured sand for all construction needs. Premium manufactured sand produced under controlled conditions for consistent quality and performance.',
      specifications: ['Fineness Modulus: 2.6-3.0', 'Silt Content: <3%', 'Water Absorption: <2%', 'Bulk Density: 1.75-1.85 kg/m³'],
      uses: ['Concrete mixing', 'Plastering work', 'Block work', 'Foundation construction'],
      advantages: ['Consistent quality', 'No impurities', 'Better workability', 'Environmentally friendly'],
      unit: 'per cubic meter',
      image: './assets/msand.webp',
      active: true
    },
    {
      id: 'p_sand',
      icon: 'droplets',
      name: 'P-Sand (Plastering Sand)',
      description: 'Fine plastering sand for smooth wall finishes. Specially processed plastering sand for achieving smooth and durable wall finishes.',
      specifications: ['Fineness Modulus: 1.8-2.2', 'Silt Content: <2%', 'Grain Size: 0.15-2.36mm'],
      uses: ['Wall plastering', 'Ceiling work', 'Fine finishing', 'Decorative plastering'],
      advantages: ['Ultra-fine texture', 'Smooth finish', 'Better adhesion', 'Reduced cracking'],
      unit: 'per cubic meter',
      image: './assets/psand.webp',
      active: true
    },
    {
      id: 'blue_metal',
      icon: 'zap',
      name: 'Blue Metal (Jalli)',
      description: 'Crushed stone aggregate for concrete and road construction. High-quality crushed blue granite stone available in various sizes.',
      specifications: ['20mm - Standard concrete', '40mm - Road construction', '12mm - Fine concrete work'],
      uses: ['Concrete mixing', 'Road base', 'Drainage systems', 'Foundation work'],
      advantages: ['High strength', 'Durable', 'Weather resistant', 'Multiple sizes available'],
      unit: 'per ton',
      image: './assets/blue metals.webp',
      active: true
    },
    {
      id: 'red_bricks',
      icon: 'home',
      name: 'Red Bricks',
      description: 'Traditional clay bricks for wall construction. Traditional kiln-fired clay bricks known for durability and thermal insulation.',
      specifications: ['Size: 9x4.5x3 inches', 'Compressive Strength: >3.5 N/mm²', 'Water Absorption: <20%'],
      uses: ['Wall construction', 'Boundary walls', 'Pillars', 'Load-bearing structures'],
      advantages: ['Good insulation', 'Fire resistant', 'Durable', 'Eco-friendly'],
      unit: 'per 1000 pieces',
      image: './assets/red brick.webp',
      active: true
    },
    {
      id: 'fly_ash_bricks',
      icon: 'leaf',
      name: 'Fly Ash Bricks',
      description: 'Eco-friendly bricks made from fly ash. Modern eco-friendly bricks offering better strength and uniform size.',
      specifications: ['Size: 9x4x3 inches', 'Compressive Strength: >7.5 N/mm²', 'Water Absorption: <12%'],
      uses: ['Wall construction', 'High-rise buildings', 'Commercial structures', 'Residential projects'],
      advantages: ['Higher strength', 'Uniform size', 'Less mortar required', 'Eco-friendly'],
      unit: 'per 1000 pieces',
      image: './assets/brick.webp',
      active: true
    },
    {
      id: 'concrete_blocks',
      icon: 'square',
      name: 'Concrete Blocks',
      description: 'Solid and hollow concrete blocks for construction. Machine-made concrete blocks available in solid and hollow variants.',
      specifications: ['Solid: 16x8x8 inches', 'Hollow: 16x8x8 inches', 'Compressive Strength: >4 N/mm²'],
      uses: ['Wall construction', 'Partition walls', 'Compound walls', 'Industrial buildings'],
      advantages: ['Quick construction', 'Cost-effective', 'Low maintenance', 'Sound insulation'],
      unit: 'per piece',
      image: './assets/concretate.webp',
      active: true
    },
    {
      id: 'cement',
      icon: 'package',
      name: 'Cement',
      description: 'Premium quality cement from top brands including UltraTech, ACC, Ramco, Dalmia, and Chettinad.',
      specifications: ['OPC 53 Grade', 'PPC Grade', 'PSC Grade available'],
      uses: ['Concrete mixing', 'Plastering', 'Masonry work', 'Foundation'],
      advantages: ['Top brands', 'Fresh stock', 'Bulk discounts', 'Doorstep delivery'],
      unit: 'per bag (50kg)',
      brands: ['UltraTech', 'ACC', 'Ramco', 'Dalmia', 'Chettinad'],
      image: './assets/cement.webp',
      active: true
    },
    {
      id: 'aac_blocks',
      icon: 'box',
      name: 'AAC Blocks',
      description: 'Lightweight autoclaved aerated concrete blocks. Modern AAC blocks offering excellent thermal insulation and faster construction.',
      specifications: ['Sizes: 600x200x100mm to 600x200x300mm', 'Density: 550-650 kg/m³', 'Compressive Strength: 3-4.5 N/mm²'],
      uses: ['High-rise construction', 'Green buildings', 'Commercial complexes', 'Residential projects'],
      advantages: ['Lightweight', 'Thermal insulation', 'Fire resistant', 'Earthquake resistant'],
      unit: 'per cubic meter',
      image: './assets/acc.webp',
      active: true
    },
    {
      id: 'size_stone',
      icon: 'mountain',
      name: 'Size Stone / Rough Stone',
      description: 'Natural stones for foundation and compound walls. Natural rough stones and cut size stones for foundation work.',
      specifications: ['Rough Stone: Various sizes', 'Size Stone: 9x6 inches standard'],
      uses: ['Foundation work', 'Compound walls', 'Retaining walls', 'Landscaping'],
      advantages: ['Natural material', 'High durability', 'Load-bearing capacity', 'Aesthetic appeal'],
      unit: 'per sq.ft',
      image: './assets/sizestone.webp',
      active: true
    }
  ],
  faqs: [
    {
      id: 1,
      question: 'What areas do you deliver to?',
      answer: 'We deliver across Tamil Nadu with a primary focus on Southern regions including Tirunelveli, Thoothukudi, Kanyakumari, Madurai, and surrounding districts. We also serve parts of Kerala and Karnataka for bulk orders.',
      category: 'delivery',
      active: true
    },
    {
      id: 2,
      question: 'What is the minimum order quantity?',
      answer: 'Minimum order varies by product: M-Sand/P-Sand - 1 unit (approximately 1 cubic meter), Blue Metal - 1 ton, Bricks - 1000 pieces, Cement - 10 bags. For smaller quantities, please contact us directly.',
      category: 'orders',
      active: true
    },
    {
      id: 3,
      question: 'Do you provide quality certifications?',
      answer: 'Yes, all our materials meet IS (Indian Standard) specifications. We provide quality test reports and certifications upon request. Our M-Sand and aggregates are tested regularly for gradation, silt content, and other parameters.',
      category: 'quality',
      active: true
    },
    {
      id: 4,
      question: 'What are your payment terms?',
      answer: 'We accept cash, bank transfer, UPI, and cheques. For new customers, advance payment is required. Regular customers can avail credit facilities based on their transaction history. GST bills are provided for all orders.',
      category: 'payment',
      active: true
    },
    {
      id: 5,
      question: 'How quickly can you deliver?',
      answer: 'Standard delivery within 24-48 hours for orders placed before 2 PM within our primary service area. Express delivery available for urgent requirements. Delivery time may vary for remote locations or bulk orders.',
      category: 'delivery',
      active: true
    },
    {
      id: 6,
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer attractive discounts for bulk orders and regular customers. Volume-based pricing is available for construction projects. Contact us with your requirements for a customized quotation.',
      category: 'pricing',
      active: true
    }
  ],
  contacts: [],
  quotes: []
});

// Initialize data from file
let data = loadData();

// ============ AUTH MIDDLEWARE ============

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, SECURE_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ INPUT VALIDATION RULES ============

const contactValidation = [
  body('name').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().notEmpty().isLength({ max: 20 }),
  body('message').trim().notEmpty().isLength({ max: 2000 }),
];

const quoteValidation = [
  body('name').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().notEmpty().isLength({ max: 20 }),
  body('materials').notEmpty(),
  body('quantity').trim().notEmpty().isLength({ max: 200 }),
];

// ============ PUBLIC API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all active products
app.get('/api/products', (req, res) => {
  const activeProducts = data.products.filter(p => p.active);
  res.json({ products: activeProducts });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = data.products.find(p => p.id === req.params.id && p.active);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Get all active FAQs
app.get('/api/faqs', (req, res) => {
  const activeFaqs = data.faqs.filter(faq => faq.active);
  res.json({ faqs: activeFaqs });
});

// Submit contact form (with rate limiting and validation)
app.post('/api/contact', formLimiter, contactValidation, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
  }
  
  try {
    const { name, email, phone, material, message, project_location } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    
    const submission = {
      id: Date.now(),
      name,
      email,
      phone,
      material: material || 'Not specified',
      message,
      project_location: project_location || 'Not specified',
      created_at: new Date().toISOString(),
      read: false
    };
    
    data.contacts.push(submission);
    saveData(data);
    
    // Generate WhatsApp URL
    const whatsappMessage = encodeURIComponent(
      `Hello Varman Constructions!\n\nI'm interested in your building materials.\n\n*My Details:*\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMaterial Interest: ${material || 'General inquiry'}\n\n*Message:*\n${message}\n\nProject Location: ${project_location || 'Not specified'}`
    );
    const whatsappUrl = `https://wa.me/917708484811?text=${whatsappMessage}`;
    
    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      whatsapp_url: whatsappUrl
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Submit quote request (with rate limiting and validation)
app.post('/api/quote', formLimiter, quoteValidation, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
  }
  
  try {
    const { name, email, phone, materials, quantity, project_details, timeline } = req.body;
    
    const quote = {
      id: Date.now(),
      name: sanitizeInput(name),
      email,
      phone: sanitizeInput(phone),
      materials: Array.isArray(materials) ? materials : [materials],
      quantity,
      project_details: project_details || '',
      timeline: timeline || 'Not specified',
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    
    data.quotes.push(quote);
    saveData(data);
    
    // Generate WhatsApp URL
    const materialsList = quote.materials.join(', ');
    const whatsappMessage = encodeURIComponent(
      `Hello Varman Constructions!\n\nI need a quotation for building materials.\n\n*My Details:*\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n*Requirements:*\nMaterials: ${materialsList}\nQuantity: ${quantity}\nTimeline: ${timeline || 'Not specified'}\n\n*Project Details:*\n${project_details || 'N/A'}`
    );
    const whatsappUrl = `https://wa.me/917708484811?text=${whatsappMessage}`;
    
    res.json({ 
      success: true, 
      message: 'Quote request submitted successfully',
      whatsapp_url: whatsappUrl
    });
    
  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({ error: 'Failed to submit quote request' });
  }
});

// ============ ADMIN AUTH ROUTES ============

// Admin login (with strict rate limiting to prevent brute force)
app.post('/api/admin/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid credentials format' });
    }
    
    // Sanitize username
    const sanitizedUsername = username.trim().toLowerCase().slice(0, 50);
    
    const admin = data.adminUsers.find(u => u.username === sanitizedUsername);
    if (!admin) {
      // Use same delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      SECURE_JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      token,
      user: { username: admin.username, role: admin.role }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ============ ADMIN IMAGE UPLOAD ============

// Upload product image
app.post('/api/admin/upload', authenticateToken, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the path relative to the site root
    const imagePath = `./assets/${req.file.filename}`;
    
    res.json({
      success: true,
      filename: req.file.filename,
      path: imagePath,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

// Delete uploaded image
app.delete('/api/admin/upload/:filename', authenticateToken, (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Security: Prevent path traversal attacks
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if it's a default product image (protect original assets)
    const protectedImages = [
      'msand.webp', 'psand.webp', 'blue metals.webp', 'red brick.webp',
      'brick.webp', 'concretate.webp', 'cement.webp', 'acc.webp',
      'sizestone.webp', 'logo.png', 'favicon.png'
    ];
    
    if (protectedImages.includes(filename)) {
      return res.status(403).json({ error: 'Cannot delete protected default images' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Image deleted successfully' });
    
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// List all uploaded images
app.get('/api/admin/images', authenticateToken, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    const images = files
      .filter(file => ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .map(file => {
        const filePath = path.join(UPLOAD_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: `./assets/${file}`,
          size: stats.size,
          uploadedAt: stats.mtime
        };
      })
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    res.json({ images });
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// ============ ADMIN PRODUCTS ROUTES ============

// Get all products (including inactive)
app.get('/api/admin/products', authenticateToken, (req, res) => {
  res.json({ products: data.products });
});

// Add new product
app.post('/api/admin/products', authenticateToken, (req, res) => {
  try {
    const productData = req.body;
    
    if (!productData.id || !productData.name) {
      return res.status(400).json({ error: 'Product ID and name required' });
    }
    
    // Check for duplicate ID
    if (data.products.find(p => p.id === productData.id)) {
      return res.status(400).json({ error: 'Product ID already exists' });
    }
    
    const newProduct = {
      id: productData.id,
      icon: productData.icon || 'box',
      name: productData.name,
      description: productData.description || '',
      specifications: productData.specifications || [],
      uses: productData.uses || [],
      advantages: productData.advantages || [],
      unit: productData.unit || 'per unit',
      image: productData.image || './assets/default.webp',
      brands: productData.brands || [],
      active: true
    };
    
    data.products.push(newProduct);
    saveData(data);
    
    res.json({ success: true, product: newProduct });
    
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
app.put('/api/admin/products/:id', authenticateToken, (req, res) => {
  try {
    const productIndex = data.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    data.products[productIndex] = { ...data.products[productIndex], ...req.body };
    saveData(data);
    
    res.json({ success: true, product: data.products[productIndex] });
    
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (hard delete)
app.delete('/api/admin/products/:id', authenticateToken, (req, res) => {
  try {
    const productIndex = data.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    data.products.splice(productIndex, 1);
    saveData(data);
    
    res.json({ success: true, message: 'Product deleted permanently' });
    
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============ ADMIN FAQS ROUTES ============

// Get all FAQs (including inactive)
app.get('/api/admin/faqs', authenticateToken, (req, res) => {
  res.json({ faqs: data.faqs });
});

// Add new FAQ
app.post('/api/admin/faqs', authenticateToken, (req, res) => {
  try {
    const { question, answer, category } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer required' });
    }
    
    const newFaq = {
      id: Date.now(),
      question,
      answer,
      category: category || 'general',
      active: true
    };
    
    data.faqs.push(newFaq);
    saveData(data);
    
    res.json({ success: true, faq: newFaq });
    
  } catch (error) {
    console.error('Add FAQ error:', error);
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// Update FAQ
app.put('/api/admin/faqs/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const faqIndex = data.faqs.findIndex(f => f.id === id);
    
    if (faqIndex === -1) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    data.faqs[faqIndex] = { ...data.faqs[faqIndex], ...req.body };
    saveData(data);
    
    res.json({ success: true, faq: data.faqs[faqIndex] });
    
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete FAQ (hard delete)
app.delete('/api/admin/faqs/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const faqIndex = data.faqs.findIndex(f => f.id === id);
    
    if (faqIndex === -1) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    data.faqs.splice(faqIndex, 1);
    saveData(data);
    
    res.json({ success: true, message: 'FAQ deleted permanently' });
    
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// ============ ADMIN CONTACTS ROUTES ============

// Get all contacts
app.get('/api/admin/contacts', authenticateToken, (req, res) => {
  res.json({ contacts: data.contacts.sort((a, b) => b.id - a.id) });
});

// Mark contact as read
app.put('/api/admin/contacts/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contactIndex = data.contacts.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    data.contacts[contactIndex] = { ...data.contacts[contactIndex], ...req.body };
    saveData(data);
    
    res.json({ success: true, contact: data.contacts[contactIndex] });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
app.delete('/api/admin/contacts/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contactIndex = data.contacts.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    data.contacts.splice(contactIndex, 1);
    saveData(data);
    
    res.json({ success: true, message: 'Contact deleted' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// ============ ADMIN QUOTES ROUTES ============

// Get all quotes
app.get('/api/admin/quotes', authenticateToken, (req, res) => {
  res.json({ quotes: data.quotes.sort((a, b) => b.id - a.id) });
});

// Update quote status
app.put('/api/admin/quotes/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const quoteIndex = data.quotes.findIndex(q => q.id === id);
    
    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    data.quotes[quoteIndex] = { ...data.quotes[quoteIndex], ...req.body };
    saveData(data);
    
    res.json({ success: true, quote: data.quotes[quoteIndex] });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// Delete quote
app.delete('/api/admin/quotes/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const quoteIndex = data.quotes.findIndex(q => q.id === id);
    
    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    data.quotes.splice(quoteIndex, 1);
    saveData(data);
    
    res.json({ success: true, message: 'Quote deleted' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// ============ ADMIN STATS ============

app.get('/api/admin/stats', authenticateToken, (req, res) => {
  const activeProducts = data.products.filter(p => p.active).length;
  const activeFaqs = data.faqs.filter(f => f.active).length;
  const pendingQuotes = data.quotes.filter(q => q.status === 'pending').length;
  const unreadContacts = data.contacts.filter(c => !c.read).length;
  
  res.json({
    products: activeProducts,
    totalProducts: data.products.length,
    faqs: activeFaqs,
    totalFaqs: data.faqs.length,
    pendingQuotes,
    unreadContacts,
    totalContacts: data.contacts.length,
    totalQuotes: data.quotes.length,
    // Analytics & Security Stats
    analytics: data.analytics || { views: 0, clicks: {} },
    securityEvents: (data.securityLogs || []).slice(-50) // Last 50 events
  });
});

// ============ ANALYTICS & SECURITY ENDPOINTS ============

// Track Page Views & Clicks (SEO/Engagement)
app.post('/api/analytics/track', (req, res) => {
  const { type, page, element } = req.body;
  
  if (!data.analytics) data.analytics = { views: 0, clicks: {}, history: [] };
  
  if (type === 'view') {
    data.analytics.views = (data.analytics.views || 0) + 1;
    // Keep 7 days history
    const date = new Date().toISOString().split('T')[0];
    const dayEntry = data.analytics.history.find(d => d.date === date);
    if (dayEntry) dayEntry.views++;
    else data.analytics.history.push({ date, views: 1 });
  } else if (type === 'click' && element) {
    data.analytics.clicks[element] = (data.analytics.clicks[element] || 0) + 1;
  }
  
  saveData(data);
  res.json({ success: true });
});

// Honeypot / Security Log
app.post('/api/security/alert', (req, res) => {
  const { type, path, userAgent, ip } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;
  
  if (!data.securityLogs) data.securityLogs = [];
  
  const logEntry = {
    id: Date.now(),
    type: type || 'SUSPICIOUS_ACTIVITY',
    path: path || 'unknown',
    ip: ip || clientIp,
    userAgent: sanitizeInput(userAgent || ''),
    timestamp: new Date().toISOString(),
    severity: 'HIGH'
  };
  
  data.securityLogs.push(logEntry);
  if (data.securityLogs.length > 500) data.securityLogs.shift(); // Keep last 500
  
  saveData(data);
  
  // Rate limit attacker
  console.log(`🚨 SECURITY ALERT: ${logEntry.type} from ${logEntry.ip}`);
  
  res.json({ success: true, fakeToken: '8d9a8f9a8d9a8f...' }); // Respond with fake success to confuse attacker
});

// ============ SERVE FRONTEND ============

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     VARMAN CONSTRUCTIONS - Express Backend Server          ║
╠════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                  ║
║  Admin Panel: http://localhost:${PORT}/admin.html             ║
║  Admin Login: username: admin | password: varman@2024      ║
╠════════════════════════════════════════════════════════════╣
║  📦 Data stored in: backend/data.json (persists like       ║
║     localStorage - survives server restarts!)              ║
╠════════════════════════════════════════════════════════════╣
║  API Endpoints:                                            ║
║  PUBLIC:                                                   ║
║  • GET  /api/products     - List active products           ║
║  • GET  /api/faqs         - List active FAQs               ║
║  • POST /api/contact      - Submit contact form            ║
║  • POST /api/quote        - Submit quote request           ║
║  ADMIN:                                                    ║
║  • POST   /api/admin/login           - Login               ║
║  • GET    /api/admin/products        - All products        ║
║  • POST   /api/admin/products        - Add product         ║
║  • PUT    /api/admin/products/:id    - Update product      ║
║  • DELETE /api/admin/products/:id    - Delete product      ║
║  • (Same CRUD for /faqs, /contacts, /quotes)              ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
