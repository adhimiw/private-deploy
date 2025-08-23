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

    return (
      <header className="bg-white shadow-md fixed w-full top-0 z-50" data-name="header" data-file="components/Header.js">
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="assets/logo.png" 
                alt="Varman Construction Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-[var(--text-primary)]">Varman Construction</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection('services')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection('about')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                Contact
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="icon-menu text-xl text-[var(--text-primary)]"></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-[var(--border-color)]">
              <div className="py-4 space-y-2">
                <button onClick={() => scrollToSection('home')} className="block w-full text-left px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)]">
                  Home
                </button>
                <button onClick={() => scrollToSection('services')} className="block w-full text-left px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)]">
                  Services
                </button>
                <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)]">
                  About
                </button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)]">
                  Contact
                </button>
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
