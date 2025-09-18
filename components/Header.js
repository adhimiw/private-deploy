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
      <header className="bg-dark-secondary shadow-elevated fixed w-full top-0 z-50 border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="max-w-full relative z-10 px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Enhanced Prominence */}
            <div className="flex items-center space-x-3 group">
              <img
                src="assets/logo.png"
                alt="VARMAN CONSTRUCTIONS Logo"
                className="h-12 md:h-14 w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-lg"
              />
              <div>
                <span className="text-lg md:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">
                  <span style={{color: 'var(--primary-color)'}}>VARMAN</span> CONSTRUCTIONS
                </span>
                <div className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300">Building Materials Supplier</div>
              </div>
            </div>

            {/* Desktop Navigation with Gypsy-Style Effects */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-all duration-300 font-medium relative">
                Home
              </button>
              <button onClick={() => scrollToSection('services')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-all duration-300 font-medium relative">
                Products
              </button>
              <button onClick={() => scrollToSection('about')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-all duration-300 font-medium relative">
                About
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-all duration-300 font-medium relative">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-all duration-300 font-medium relative">
                Contact
              </button>
            </nav>

            {/* Contact Info & CTA with Gypsy-Style Animation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  <span style={{color: 'var(--primary-color)'}}>+91 77084 84811</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)]">Call for Quote</div>
              </div>
              <button onClick={handleCallNow} className="btn-primary text-sm">
                Call Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className={`w-6 h-0.5 bg-[var(--text-primary)] mb-1 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-[var(--text-primary)] mb-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-dark-secondary border-t border-[var(--border-color)] animate-slide-up">
              <div className="py-4 space-y-2">
                <button onClick={() => scrollToSection('home')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-[var(--background-card)] font-medium transition-all duration-300">
                  Home
                </button>
                <button onClick={() => scrollToSection('services')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-[var(--background-card)] font-medium transition-all duration-300">
                  Products
                </button>
                <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-[var(--background-card)] font-medium transition-all duration-300">
                  About
                </button>
                <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-[var(--background-card)] font-medium transition-all duration-300">
                  FAQ
                </button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-[var(--background-card)] font-medium transition-all duration-300">
                  Contact
                </button>

                {/* Mobile Contact */}
                <div className="px-4 py-3 border-t border-[var(--border-color)]">
                  <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Call for Quote</div>
                  <div className="flex flex-col space-y-2">
                    <button onClick={() => window.open('tel:+917708484811', '_self')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] font-medium transition-colors duration-300">
                      +91 77084 84811
                    </button>
                    <button onClick={() => window.open('tel:+919965237777', '_self')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] font-medium transition-colors duration-300">
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