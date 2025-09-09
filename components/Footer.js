function Footer() {
  try {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="bg-[var(--text-primary)] text-white" data-name="footer" data-file="components/Footer.js">
        <div className="container-max section-padding">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="assets/logo.png" 
                  alt="VARMAN CONSTRUCTIONS Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <span className="text-xl font-bold">VARMAN CONSTRUCTIONS</span>
                  <div className="text-sm text-gray-300">Building Materials Supplier</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Your trusted partner for premium building materials since 2020. We supply high-quality M-Sand, Blue Metal, Cement, Bricks, and construction materials across India with guaranteed quality and timely delivery.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="text-sm">+91 77084 84811, +91 99652 37777</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="icon-mail text-[var(--primary-color)]"></div>
                  <span className="text-sm">info@varmanconstructions.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="icon-calendar text-[var(--primary-color)]"></div>
                  <span className="text-sm">Established 2020</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => window.open('tel:+917708484811', '_self')}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors cursor-pointer"
                  title="Call Us"
                >
                  <div className="icon-phone text-sm text-white"></div>
                </button>
                <button 
                  onClick={() => {
                    const message = "Hi VARMAN CONSTRUCTIONS! I'm interested in your building materials.";
                    window.open(`https://wa.me/917708484811?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer"
                  title="WhatsApp"
                >
                  <div className="icon-message-circle text-sm text-white"></div>
                </button>
                <button 
                  onClick={() => window.open('mailto:info@varmanconstructions.in', '_self')}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors cursor-pointer"
                  title="Email Us"
                >
                  <div className="icon-mail text-sm text-white"></div>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#home" className="hover:text-white transition-colors text-sm">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors text-sm">Products</a></li>
                <li><a href="#about" className="hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Our Products */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Materials</h4>
              <ul className="space-y-2 text-gray-300">
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm">M-Sand & P-Sand</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm">Blue Metal / Jalli</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm">Red Bricks & Fly Ash Bricks</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm">AAC Blocks & Cement</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm">Concrete Blocks</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm">Size Stone & Natural Stone</span></li>
              </ul>
            </div>
          </div>

          {/* Service Areas */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h4 className="text-lg font-semibold mb-4">Service Areas</h4>
            <p className="text-gray-300 text-sm mb-3">We deliver building materials across India with primary focus on:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-sm text-gray-300">
              <div>Tamil Nadu</div>
              <div>Karnataka</div>
              <div>Kerala</div>
              <div>Other States*</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">*Delivery to other states available on request with advance notice</p>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="grid md:grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-gray-300 text-sm">
                  © {currentYear} VARMAN CONSTRUCTIONS. All rights reserved. Building India with quality materials.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-gray-400 text-xs">
                  Website: varmanconstructions.in | Quality Materials • Timely Delivery • Competitive Pricing
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}