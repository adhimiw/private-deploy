const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'varman-constructions-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ============ DATA STORE (In-memory, can be replaced with DB) ============

// Admin credentials (in production, use a database)
const adminUsers = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('varman@2024', 10),
    role: 'admin'
  }
];

// Products Data
let products = {
  m_sand: {
    name: 'M-Sand (Manufactured Sand)',
    description: 'High-quality manufactured sand for all construction needs. Premium manufactured sand produced under controlled conditions for consistent quality and performance.',
    specifications: {
      fineness_modulus: '2.6-3.0',
      silt_content: '<3%',
      water_absorption: '<2%',
      bulk_density: '1.75-1.85 kg/m³'
    },
    uses: ['Concrete mixing', 'Plastering work', 'Block work', 'Foundation construction'],
    advantages: ['Consistent quality', 'No impurities', 'Better workability', 'Environmentally friendly'],
    unit: 'per cubic meter',
    image: './assets/msand.webp',
    active: true
  },
  p_sand: {
    name: 'P-Sand (Plastering Sand)',
    description: 'Fine plastering sand for smooth wall finishes. Specially processed plastering sand for achieving smooth and durable wall finishes.',
    specifications: {
      fineness_modulus: '1.8-2.2',
      silt_content: '<2%',
      grain_size: '0.15-2.36mm'
    },
    uses: ['Wall plastering', 'Ceiling work', 'Fine finishing', 'Decorative plastering'],
    advantages: ['Ultra-fine texture', 'Smooth finish', 'Better adhesion', 'Reduced cracking'],
    unit: 'per cubic meter',
    image: './assets/psand.webp',
    active: true
  },
  blue_metal: {
    name: 'Blue Metal (Jalli)',
    description: 'Crushed stone aggregate for concrete and road construction. High-quality crushed blue granite stone available in various sizes.',
    specifications: {
      sizes_available: '12mm, 20mm, 40mm',
      crushing_strength: '>100 N/mm²',
      specific_gravity: '2.6-2.8'
    },
    sizes: {
      '12mm': { description: 'Fine concrete work, flooring' },
      '20mm': { description: 'Standard concrete, RCC work' },
      '40mm': { description: 'Road construction, large foundations' }
    },
    uses: ['Concrete mixing', 'Road base', 'Drainage systems', 'Foundation work'],
    advantages: ['High strength', 'Durable', 'Weather resistant', 'Multiple sizes available'],
    unit: 'per ton',
    image: './assets/blue metals.webp',
    active: true
  },
  red_bricks: {
    name: 'Red Bricks',
    description: 'Traditional clay bricks for wall construction. Traditional kiln-fired clay bricks known for durability and thermal insulation.',
    specifications: {
      size: '9x4.5x3 inches',
      compressive_strength: '>3.5 N/mm²',
      water_absorption: '<20%'
    },
    uses: ['Wall construction', 'Boundary walls', 'Pillars', 'Load-bearing structures'],
    advantages: ['Good insulation', 'Fire resistant', 'Durable', 'Eco-friendly'],
    unit: 'per 1000 pieces',
    image: './assets/red brick.webp',
    active: true
  },
  fly_ash_bricks: {
    name: 'Fly Ash Bricks',
    description: 'Eco-friendly bricks made from fly ash. Modern eco-friendly bricks offering better strength and uniform size.',
    specifications: {
      size: '9x4x3 inches',
      compressive_strength: '>7.5 N/mm²',
      water_absorption: '<12%'
    },
    uses: ['Wall construction', 'High-rise buildings', 'Commercial structures', 'Residential projects'],
    advantages: ['Higher strength', 'Uniform size', 'Less mortar required', 'Eco-friendly'],
    unit: 'per 1000 pieces',
    image: './assets/brick.webp',
    active: true
  },
  concrete_blocks: {
    name: 'Concrete Blocks',
    description: 'Solid and hollow concrete blocks for construction. Machine-made concrete blocks available in solid and hollow variants.',
    specifications: {
      solid_size: '16x8x8 inches',
      hollow_size: '16x8x8 inches',
      compressive_strength: '>4 N/mm²'
    },
    types: {
      solid: { description: 'Load-bearing walls, foundations' },
      hollow: { description: 'Partition walls, non-load bearing' }
    },
    uses: ['Wall construction', 'Partition walls', 'Compound walls', 'Industrial buildings'],
    advantages: ['Quick construction', 'Cost-effective', 'Low maintenance', 'Sound insulation'],
    unit: 'per piece',
    image: './assets/concretate.webp',
    active: true
  },
  cement: {
    name: 'Cement',
    description: 'Premium quality cement from top brands including UltraTech, ACC, Ramco, Dalmia, and Chettinad.',
    specifications: {
      grades: 'OPC 53, PPC, PSC',
      bag_weight: '50 kg',
      shelf_life: '3 months'
    },
    grades: {
      'OPC 53': { description: 'High strength concrete, RCC work' },
      'PPC': { description: 'General construction, plastering' },
      'PSC': { description: 'Marine construction, sulphate resistance' }
    },
    brands: ['UltraTech', 'ACC', 'Ramco', 'Dalmia', 'Chettinad'],
    uses: ['Concrete mixing', 'Plastering', 'Masonry work', 'Foundation'],
    advantages: ['Top brands', 'Fresh stock', 'Bulk discounts', 'Doorstep delivery'],
    unit: 'per bag (50kg)',
    image: './assets/cement.webp',
    active: true
  },
  aac_blocks: {
    name: 'AAC Blocks',
    description: 'Lightweight autoclaved aerated concrete blocks. Modern AAC blocks offering excellent thermal insulation and faster construction.',
    specifications: {
      sizes: '600x200x100mm to 600x200x300mm',
      density: '550-650 kg/m³',
      compressive_strength: '3-4.5 N/mm²'
    },
    uses: ['High-rise construction', 'Green buildings', 'Commercial complexes', 'Residential projects'],
    advantages: ['Lightweight', 'Thermal insulation', 'Fire resistant', 'Earthquake resistant'],
    unit: 'per cubic meter',
    image: './assets/acc.webp',
    active: true
  },
  size_stone: {
    name: 'Size Stone / Rough Stone',
    description: 'Natural stones for foundation and compound walls. Natural rough stones and cut size stones for foundation work.',
    specifications: {
      rough_stone: 'Various sizes',
      size_stone: '9x6 inches standard'
    },
    uses: ['Foundation work', 'Compound walls', 'Retaining walls', 'Landscaping'],
    advantages: ['Natural material', 'High durability', 'Load-bearing capacity', 'Aesthetic appeal'],
    unit: 'per sq.ft',
    image: './assets/sizestone.webp',
    active: true
  }
};

// FAQs Data
let faqs = [
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
];

// Contact submissions store
let contactSubmissions = [];
let quoteRequests = [];

// ============ AUTH MIDDLEWARE ============

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ PUBLIC API ROUTES ============

// Get all products
app.get('/api/products', (req, res) => {
  const activeProducts = {};
  Object.entries(products).forEach(([key, value]) => {
    if (value.active) {
      activeProducts[key] = value;
    }
  });
  res.json({ products: activeProducts });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products[req.params.id];
  if (!product || !product.active) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Get all FAQs
app.get('/api/faqs', (req, res) => {
  const activeFaqs = faqs.filter(faq => faq.active);
  res.json({ faqs: activeFaqs });
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
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
    
    contactSubmissions.push(submission);
    
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

// Submit quote request
app.post('/api/quote', async (req, res) => {
  try {
    const { name, email, phone, materials, quantity, project_details, timeline } = req.body;
    
    if (!name || !email || !phone || !materials || !quantity) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    
    const quote = {
      id: Date.now(),
      name,
      email,
      phone,
      materials: Array.isArray(materials) ? materials : [materials],
      quantity,
      project_details: project_details || '',
      timeline: timeline || 'Not specified',
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    
    quoteRequests.push(quote);
    
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

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = adminUsers.find(u => u.username === username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
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

// ============ ADMIN PROTECTED ROUTES ============

// Get all products (including inactive)
app.get('/api/admin/products', authenticateToken, (req, res) => {
  res.json({ products });
});

// Add new product
app.post('/api/admin/products', authenticateToken, (req, res) => {
  try {
    const { id, ...productData } = req.body;
    
    if (!id || products[id]) {
      return res.status(400).json({ error: 'Invalid or duplicate product ID' });
    }
    
    products[id] = { ...productData, active: true };
    res.json({ success: true, product: products[id] });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
app.put('/api/admin/products/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    if (!products[id]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[id] = { ...products[id], ...req.body };
    res.json({ success: true, product: products[id] });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (soft delete)
app.delete('/api/admin/products/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    if (!products[id]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[id].active = false;
    res.json({ success: true, message: 'Product deactivated' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all FAQs (including inactive)
app.get('/api/admin/faqs', authenticateToken, (req, res) => {
  res.json({ faqs });
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
    
    faqs.push(newFaq);
    res.json({ success: true, faq: newFaq });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// Update FAQ
app.put('/api/admin/faqs/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const faqIndex = faqs.findIndex(f => f.id === id);
    
    if (faqIndex === -1) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    faqs[faqIndex] = { ...faqs[faqIndex], ...req.body };
    res.json({ success: true, faq: faqs[faqIndex] });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete FAQ
app.delete('/api/admin/faqs/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const faqIndex = faqs.findIndex(f => f.id === id);
    
    if (faqIndex === -1) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    faqs[faqIndex].active = false;
    res.json({ success: true, message: 'FAQ deactivated' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// Get contact submissions
app.get('/api/admin/contacts', authenticateToken, (req, res) => {
  res.json({ contacts: contactSubmissions.sort((a, b) => b.id - a.id) });
});

// Get quote requests
app.get('/api/admin/quotes', authenticateToken, (req, res) => {
  res.json({ quotes: quoteRequests.sort((a, b) => b.id - a.id) });
});

// Update quote status
app.put('/api/admin/quotes/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const quoteIndex = quoteRequests.findIndex(q => q.id === id);
    
    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    quoteRequests[quoteIndex] = { ...quoteRequests[quoteIndex], ...req.body };
    res.json({ success: true, quote: quoteRequests[quoteIndex] });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// Dashboard stats
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  const activeProducts = Object.values(products).filter(p => p.active).length;
  const activeFaqs = faqs.filter(f => f.active).length;
  const pendingQuotes = quoteRequests.filter(q => q.status === 'pending').length;
  const unreadContacts = contactSubmissions.filter(c => !c.read).length;
  
  res.json({
    products: activeProducts,
    faqs: activeFaqs,
    pendingQuotes,
    unreadContacts,
    totalContacts: contactSubmissions.length,
    totalQuotes: quoteRequests.length
  });
});

// ============ SERVE FRONTEND ============

// Serve index.html for all other routes (SPA support)
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
║  Admin Login: username: admin | password: varman@2024      ║
╠════════════════════════════════════════════════════════════╣
║  API Endpoints:                                            ║
║  • GET  /api/products     - List all products              ║
║  • GET  /api/faqs         - List all FAQs                  ║
║  • POST /api/contact      - Submit contact form            ║
║  • POST /api/quote        - Submit quote request           ║
║  • POST /api/admin/login  - Admin authentication           ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
