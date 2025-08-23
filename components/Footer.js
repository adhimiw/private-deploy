function Footer() {
  try {
    return (
      <footer className="bg-[var(--text-primary)] text-white" data-name="footer" data-file="components/Footer.js">
        <div className="container-max section-padding">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://app.trickle.so/storage/public/images/usr_141f626bb8000001/f395f7e2-ed71-4fe7-a417-6eb94e93d7b6.png" 
                  alt="Varman Construction Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold">Varman Construction</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Your trusted partner for premium construction materials and nationwide export services. Building India's future with quality and reliability.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors cursor-pointer">
                  <div className="icon-phone text-sm text-white"></div>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors cursor-pointer">
                  <div className="icon-mail text-sm text-white"></div>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[var(--primary-color)] transition-colors cursor-pointer">
                  <div className="icon-map-pin text-sm text-white"></div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Materials */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Materials</h4>
              <ul className="space-y-2 text-gray-300">
                <li><span className="hover:text-white transition-colors cursor-pointer">Cement & Concrete</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Steel & Reinforcement</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Aggregates & Sand</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Bricks & Blocks</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 Varman Construction. All rights reserved. Building India with quality materials.
            </p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}
