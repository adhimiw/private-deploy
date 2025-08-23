function Header() {
  try {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    };

    const handleCallNow = () => {
      window.open('tel:+917708484811', '_self');
    };

    return (
      <header className="bg-white shadow-md fixed w-full top-0 z-50" data-name="header" data-file="components/Header.js">
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="assets/logo.png" 
                alt="VARMAN CONSTRUCTIONS Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold text-[var(--text-primary)]">VARMAN CONSTRUCTIONS</span>
                <div className="text-xs text-[var(--text-secondary)]">Building Materials Supplier</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('services')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium">
                Products
              </button>
              <button onClick={() => scrollToSection('about')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium">
                Contact
              </button>
            </nav>

            {/* Contact Info & CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-[var(--text-primary)]">+91 77084 84811</div>
                <div className="text-xs text-[var(--text-secondary)]">Call for Quote</div>
              </div>
              <button onClick={handleCallNow} className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[var(--accent-color)] transition-colors text-sm">
                Call Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className={`w-6 h-0.5 bg-[var(--text-primary)] mb-1 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-[var(--text-primary)] mb-1 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-[var(--text-primary)] transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-[var(--border-color)]">
              <div className="py-4 space-y-2">
                <button onClick={() => scrollToSection('home')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium">
                  Home
                </button>
                <button onClick={() => scrollToSection('services')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium">
                  Products
                </button>
                <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium">
                  About
                </button>
                <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium">
                  FAQ
                </button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-gray-50 font-medium">
                  Contact
                </button>
                
                {/* Mobile Contact */}
                <div className="px-4 py-3 border-t border-[var(--border-color)]">
                  <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Call for Quote</div>
                  <div className="flex flex-col space-y-2">
                    <button onClick={() => window.open('tel:+917708484811', '_self')} className="text-sm text-[var(--primary-color)] font-medium">
                      +91 77084 84811
                    </button>
                    <button onClick={() => window.open('tel:+919965237777', '_self')} className="text-sm text-[var(--primary-color)] font-medium">
                      +91 99652 37777
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}