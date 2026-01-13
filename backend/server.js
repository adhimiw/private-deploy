const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'varman-constructions-secret-key-2024';

// Data file path (localStorage equivalent - persists to JSON file)
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

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
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ PUBLIC API ROUTES ============

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

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = data.adminUsers.find(u => u.username === username);
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
    totalQuotes: data.quotes.length
  });
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
