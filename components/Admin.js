function Admin() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState(localStorage.getItem('adminToken') || '');
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [stats, setStats] = React.useState({});
  const [products, setProducts] = React.useState({});
  const [faqs, setFaqs] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [quotes, setQuotes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  // Login form state
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  
  // Edit modals
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [editingFaq, setEditingFaq] = React.useState(null);
  const [showAddFaq, setShowAddFaq] = React.useState(false);
  const [newFaq, setNewFaq] = React.useState({ question: '', answer: '', category: 'general' });

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3001' 
    : '';

  // Check token on mount
  React.useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setIsLoggedIn(true);
        fetchDashboardData();
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchDashboardData();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection failed. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, productsRes, faqsRes, contactsRes, quotesRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats`, { headers }),
        fetch(`${API_BASE}/api/admin/products`, { headers }),
        fetch(`${API_BASE}/api/admin/faqs`, { headers }),
        fetch(`${API_BASE}/api/admin/contacts`, { headers }),
        fetch(`${API_BASE}/api/admin/quotes`, { headers })
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (productsRes.ok) setProducts((await productsRes.json()).products);
      if (faqsRes.ok) setFaqs((await faqsRes.json()).faqs);
      if (contactsRes.ok) setContacts((await contactsRes.json()).contacts);
      if (quotesRes.ok) setQuotes((await quotesRes.json()).quotes);
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchDashboardData();
        setEditingProduct(null);
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const toggleProductActive = async (productId) => {
    const product = products[productId];
    await updateProduct(productId, { active: !product.active });
  };

  const addFaq = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/faqs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newFaq)
      });
      
      if (response.ok) {
        fetchDashboardData();
        setShowAddFaq(false);
        setNewFaq({ question: '', answer: '', category: 'general' });
      }
    } catch (err) {
      console.error('Failed to add FAQ:', err);
    }
  };

  const updateFaq = async (faqId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/faqs/${faqId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchDashboardData();
        setEditingFaq(null);
      }
    } catch (err) {
      console.error('Failed to update FAQ:', err);
    }
  };

  const toggleFaqActive = async (faqId) => {
    const faq = faqs.find(f => f.id === faqId);
    await updateFaq(faqId, { active: !faq.active });
  };

  const updateQuoteStatus = async (quoteId, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update quote:', err);
    }
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-xl shadow-2xl w-full max-w-md border border-[var(--border-color)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-lock text-2xl text-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Login</h1>
            <p className="text-[var(--text-secondary)] mt-2">Varman Constructions Dashboard</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--primary-color)] text-white font-semibold rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="text-center text-[var(--text-muted)] text-sm mt-6">
            Make sure the Express server is running on port 3001
          </p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      {/* Header */}
      <header className="bg-card border-b border-[var(--border-color)] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src="./assets/logo.png" alt="Logo" className="h-10" />
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['dashboard', 'products', 'faqs', 'contacts', 'quotes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-[var(--primary-color)] text-white' 
                  : 'bg-card text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-[var(--primary-color)]">{stats.products || 0}</div>
              <div className="text-[var(--text-secondary)]">Active Products</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-[var(--primary-color)]">{stats.faqs || 0}</div>
              <div className="text-[var(--text-secondary)]">Active FAQs</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-orange-500">{stats.pendingQuotes || 0}</div>
              <div className="text-[var(--text-secondary)]">Pending Quotes</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-green-500">{stats.unreadContacts || 0}</div>
              <div className="text-[var(--text-secondary)]">New Contacts</div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Manage Products</h2>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {Object.entries(products).map(([id, product]) => (
                <div key={id} className={`p-4 flex items-center justify-between ${!product.active ? 'opacity-50' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{product.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Unit: {product.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleProductActive(id)}
                      className={`px-3 py-1 rounded text-sm ${product.active ? 'bg-green-500' : 'bg-gray-500'} text-white`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Manage FAQs</h2>
              <button
                onClick={() => setShowAddFaq(true)}
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm"
              >
                + Add FAQ
              </button>
            </div>
            
            {showAddFaq && (
              <div className="p-4 bg-[var(--background-secondary)] border-b border-[var(--border-color)]">
                <input
                  type="text"
                  placeholder="Question"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                  className="w-full mb-2 px-3 py-2 bg-card border border-[var(--border-color)] rounded text-[var(--text-primary)]"
                />
                <textarea
                  placeholder="Answer"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                  className="w-full mb-2 px-3 py-2 bg-card border border-[var(--border-color)] rounded text-[var(--text-primary)]"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button onClick={addFaq} className="px-4 py-2 bg-green-500 text-white rounded text-sm">Save</button>
                  <button onClick={() => setShowAddFaq(false)} className="px-4 py-2 bg-gray-500 text-white rounded text-sm">Cancel</button>
                </div>
              </div>
            )}
            
            <div className="divide-y divide-[var(--border-color)]">
              {faqs.map(faq => (
                <div key={faq.id} className={`p-4 ${!faq.active ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text-primary)]">{faq.question}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{faq.answer}</p>
                    </div>
                    <button
                      onClick={() => toggleFaqActive(faq.id)}
                      className={`px-3 py-1 rounded text-sm ml-4 ${faq.active ? 'bg-green-500' : 'bg-gray-500'} text-white`}
                    >
                      {faq.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contact Submissions ({contacts.length})</h2>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)]">No contact submissions yet</div>
              ) : (
                contacts.map(contact => (
                  <div key={contact.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">{contact.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{contact.email} • {contact.phone}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Material: {contact.material}</p>
                        <p className="text-[var(--text-primary)] mt-2">{contact.message}</p>
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quote Requests ({quotes.length})</h2>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {quotes.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)]">No quote requests yet</div>
              ) : (
                quotes.map(quote => (
                  <div key={quote.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">{quote.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{quote.email} • {quote.phone}</p>
                        <p className="text-sm text-[var(--primary-color)] mt-1">
                          Materials: {quote.materials.join(', ')}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">Quantity: {quote.quantity}</p>
                        <p className="text-[var(--text-primary)] mt-2">{quote.project_details}</p>
                      </div>
                      <div className="text-right">
                        <select
                          value={quote.status}
                          onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                          className={`px-3 py-1 rounded text-sm ${
                            quote.status === 'pending' ? 'bg-orange-500' :
                            quote.status === 'contacted' ? 'bg-blue-500' :
                            quote.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                          } text-white`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="text-xs text-[var(--text-muted)] mt-2">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
