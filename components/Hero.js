function Hero() {
  try {
    const scrollToProducts = () => {
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleCallNow = () => {
      window.open('tel:+917708484811', '_self');
    };

    const handleGetQuote = () => {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <section
        id="home"
        className="pt-16 section-padding bg-dark relative overflow-hidden min-h-screen flex items-center hexagon-pattern"
        data-name="hero"
        data-file="components/Hero.js"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('assets/hero section.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container-max relative z-10 w-full">
          {/* Prominent Logo Section with Professional Styling */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block">
              <img
                src="assets/hero.png"
                alt="VARMAN CONSTRUCTIONS Logo"
                className="h-48 md:h-60 lg:h-72 xl:h-80 w-auto object-contain mx-auto mb-6 transition-all duration-500 transform hover:scale-105 drop-shadow-2xl"
              />
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
                  <span style={{color: 'var(--primary-color)'}}>VARMAN</span> CONSTRUCTIONS
                </div>
                <div className="text-lg md:text-xl text-[var(--text-secondary)] font-medium">
                  Building Materials Supplier Since <span style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>2020</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center px-6 py-3 bg-card border-subtle rounded-full mb-6">
                <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full mr-3"></div>
                <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide">Established 2020 • Trusted Supplier</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight">
                Premium <span className="text-gradient" style={{
                  background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px var(--glow-orange)'
                }}>Building Materials</span> Supplier Across India
              </h1>

              <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                Your trusted partner since <span style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>2020</span> for high-quality building materials. We supply <span style={{color: 'var(--secondary-color)'}}>M-Sand, Blue Metal, Cement, Bricks</span>, and specialized construction supplies across India with guaranteed quality and timely delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={handleCallNow} className="btn-primary flex items-center justify-center space-x-3">
                  <div className="icon-phone text-lg"></div>
                  <span>Call Now</span>
                </button>
                <button onClick={handleGetQuote} className="btn-secondary">
                  Get Quote
                </button>
              </div>
              
              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center space-x-3 hover:text-[var(--primary-color)] transition-colors duration-300">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="font-medium">+91 77084 84811</span>
                </div>
                <div className="flex items-center space-x-3 hover:text-[var(--primary-color)] transition-colors duration-300">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="font-medium">+91 99652 37777</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--primary-color)] mb-2">200+</div>
                  <div className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wide">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--primary-color)] mb-2">5+</div>
                  <div className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wide">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--primary-color)] mb-2">3+</div>
                  <div className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wide">States Covered</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative animate-scale-in">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Construction materials and building site - VARMAN CONSTRUCTIONS"
                className="rounded-xl shadow-elevated w-full h-96 object-cover border-subtle hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-elevated border-subtle">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
                    <div className="icon-check text-xl text-[var(--background-primary)]"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)] text-lg">Quality Assured</div>
                    <div className="text-sm text-[var(--text-secondary)]">IS Standard Materials</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Highlights */}
          <div className="mt-24 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Our Premium Materials</h2>
              <p className="text-[var(--text-secondary)] text-lg">High-quality construction materials for all your building needs</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-card p-6 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-3xl mb-3">🏗️</div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">M-Sand</div>
              </div>
              <div className="bg-card p-6 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-3xl mb-3">⚡</div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Blue Metal</div>
              </div>
              <div className="bg-card p-6 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-3xl mb-3">🧱</div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Red Bricks</div>
              </div>
              <div className="bg-card p-6 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-3xl mb-3">🏢</div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">AAC Blocks</div>
              </div>
              <div className="bg-card p-6 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-3xl mb-3">🔨</div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Cement</div>
              </div>
              <div className="bg-card p-6 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-3xl mb-3">🪨</div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Size Stone</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}