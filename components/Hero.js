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
        className="pt-20 md:pt-32 pb-8 bg-dark relative overflow-hidden md:min-h-screen"
        data-name="hero"
        data-file="components/Hero.js"
      >
        {/* Brightened background layer with construction materials image */}
        <div 
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.65)), url('https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'brightness(1.3) contrast(1.1)',
            zIndex: 0
          }}
        />
        {/* Light overlay to enhance brightness */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 140, 66, 0.1) 50%, rgba(255, 255, 255, 0.08) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
        }}
        />
        <div className="container-max relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Prominent Logo Section */}
          <div className="text-center mb-4 md:mb-6 animate-fade-in">
            <div className="inline-block">
              
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-20 items-start">
            {/* Content */}
            <div className="space-y-3 animate-slide-up relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight relative" style={{
                color: '#1A1A1A',
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)'
              }}>
                Premium <span style={{
                  background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  textShadow: 'none'
                }}>Building Materials</span> Supplier Across Tamil Nadu
              </h1>

              <p className="text-lg md:text-xl leading-relaxed max-w-2xl relative" style={{
                color: '#2D3748',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                fontWeight: '500'
              }}>
                Your trusted partner since <span style={{color: '#E55A2B', fontWeight: 'bold'}}>2020</span> for high-quality building materials. We supply <span style={{color: '#D14D1F', fontWeight: '700'}}>M-Sand, Blue Metal, Cement, Bricks</span>, and specialized construction supplies across Tamil Nadu with guaranteed quality and timely delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
                <button onClick={handleCallNow} className="btn-primary flex items-center justify-center space-x-2">
                  <div className="icon-phone text-lg"></div>
                  <span>Call Now</span>
                </button>
                <button 
                  onClick={handleGetQuote} 
                  className="btn-secondary"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: '#000000',
                    borderColor: '#000000',
                    borderWidth: '2px',
                    textShadow: 'none',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = '0 15px 35px rgba(229, 90, 43, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.borderColor = '#000000';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Get Quote
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-4 pt-3 text-sm relative">
                <div className="flex items-center space-x-2 hover:text-[var(--primary-color)] transition-colors duration-300" style={{
                  color: '#1A1A1A',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="font-semibold">+91 77084 84811</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-[var(--primary-color)] transition-colors duration-300" style={{
                  color: '#1A1A1A',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="font-semibold">+91 99652 37777</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 relative">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md border border-orange-200">
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{
                      color: '#E55A2B',
                      textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                    }}>200+</div>
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{
                      color: '#1A1A1A'
                    }}>Projects Completed</div>
                </div>
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md border border-orange-200">
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{
                    color: '#E55A2B',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                  }}>5+</div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{
                    color: '#1A1A1A'
                  }}>Years Experience</div>
                </div>
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md border border-orange-200">
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{
                    color: '#E55A2B',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                  }}>3+</div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{
                    color: '#1A1A1A'
                  }}>States Covered</div>
                </div>
              </div>
            </div>

            {/* Image */}
              <div className="relative animate-scale-in">
              <img
                src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Construction materials and building site - VARMAN CONSTRUCTIONS"
                className="rounded-xl shadow-elevated w-full h-64 md:h-96 object-cover border-subtle hover:scale-105 transition-all duration-300"
                loading="lazy"
                decoding="async"
                style={{ willChange: 'transform', border: '3px solid #E55A2B' }}
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
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}
