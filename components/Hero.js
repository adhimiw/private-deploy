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
        className="pt-16 pb-8 bg-dark relative overflow-hidden min-h-screen"
        data-name="hero"
        data-file="components/Hero.js"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('assets/herobg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container-max relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Prominent Logo Section */}
          <div className="text-center mb-4 md:mb-6 animate-fade-in">
            <div className="inline-block">
              
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-20 items-start">
            {/* Content */}
            <div className="space-y-3 animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Premium <span className="text-gradient" style={{
                  background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px var(--glow-orange)'
                }}>Building Materials</span> Supplier Across India
              </h1>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
                Your trusted partner since <span style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>2020</span> for high-quality building materials. We supply <span style={{color: 'var(--secondary-color)'}}>M-Sand, Blue Metal, Cement, Bricks</span>, and specialized construction supplies across India with guaranteed quality and timely delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleCallNow} className="btn-primary flex items-center justify-center space-x-2">
                  <div className="icon-phone text-lg"></div>
                  <span>Call Now</span>
                </button>
                <button onClick={handleGetQuote} className="btn-secondary">
                  Get Quote
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-4 pt-3 text-sm text-white">
                <div className="flex items-center space-x-2 hover:text-[var(--primary-color)] transition-colors duration-300">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="font-medium">+91 77084 84811</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-[var(--primary-color)] transition-colors duration-300">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="font-medium">+91 99652 37777</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[var(--primary-color)] mb-1">200+</div>
                  <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[var(--primary-color)] mb-1">5+</div>
                  <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[var(--primary-color)] mb-1">3+</div>
                  <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">States Covered</div>
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
          <div className="mt-8 md:mt-12 animate-fade-in">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Our Premium Materials</h2>
              <p className="text-gray-300 text-sm md:text-base">High-quality construction materials for all your building needs</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
              <div className="bg-card p-3 md:p-4 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">🏗️</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">M-Sand</div>
              </div>
              <div className="bg-card p-3 md:p-4 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">⚡</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Blue Metal</div>
              </div>
              <div className="bg-card p-3 md:p-4 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">🧱</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Red Bricks</div>
              </div>
              <div className="bg-card p-3 md:p-4 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">🏢</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">AAC Blocks</div>
              </div>
              <div className="bg-card p-3 md:p-4 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">🔨</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Cement</div>
              </div>
              <div className="bg-card p-3 md:p-4 rounded-xl border-subtle text-center card-shadow group cursor-pointer">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">🪨</div>
                <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Size Stone</div>
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
