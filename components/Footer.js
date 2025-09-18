function Footer() {
  try {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="bg-dark-secondary text-white border-t border-[var(--border-color)]" data-name="footer" data-file="components/Footer.js">
        <div className="container-max section-padding relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info with Gypsy-Style Animation */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <img
                  src="assets/logo.png"
                  alt="VARMAN CONSTRUCTIONS Logo"
                  className="h-12 w-auto object-contain transition-all duration-500 group-hover:scale-105"
                />
                <div>
                  <span className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">
                    <span style={{color: 'var(--primary-color)'}}>VARMAN</span> CONSTRUCTIONS
                  </span>
                  <div className="text-sm text-[var(--text-secondary)]">Building Materials Supplier</div>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                Your trusted partner for premium building materials since <span style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>2020</span>. We supply high-quality <span style={{color: 'var(--secondary-color)'}}>M-Sand, Blue Metal, Cement, Bricks</span>, and construction materials across India with guaranteed quality and timely delivery.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="text-sm text-[var(--text-secondary)]">+91 77084 84811, +91 99652 37777</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="icon-mail text-[var(--primary-color)]"></div>
                  <span className="text-sm text-[var(--text-secondary)]">info@varmanconstructions.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="icon-calendar text-[var(--primary-color)]"></div>
                  <span className="text-sm text-[var(--text-secondary)]">Established 2020</span>
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
              <h4 className="text-lg font-semibold text-black mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#home" className="hover:text-white transition-colors text-sm text-black">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors text-sm text-black">Products</a></li>
                <li><a href="#about" className="hover:text-white transition-colors text-sm text-black">About Us</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors text-sm text-black">FAQ</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors text-sm text-black">Contact</a></li>
              </ul>
            </div>

            {/* Our Products */}
            <div>
              <h4 className="text-lg font-semibold text-black mb-4">Our Materials</h4>
              <ul className="space-y-2 text-gray-300">
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm text-black">M-Sand & P-Sand</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm text-black">Blue Metal / Jalli</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm text-black">Red Bricks & Fly Ash Bricks</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm text-black">AAC Blocks & Cement</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm text-black">Concrete Blocks</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer text-sm text-black">Size Stone & Natural Stone</span></li>
              </ul>
            </div>
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
                  GSTIN: 33BTGPM9877H1Z3
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
