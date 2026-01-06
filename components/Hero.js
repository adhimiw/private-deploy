function Hero() {
  try {
    const scrollToProducts = () => {
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleCallNow = () => {
      window.open('https://wa.me/917708484811', '_blank');
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
        className="pt-32 md:pt-40 pb-20 md:pb-32 bg-white relative overflow-hidden min-h-screen flex items-center"
        data-name="hero"
        data-file="components/Hero.js"
      >
        {/* Modern gradient background */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 50%, #FFE8DC 100%)',
            zIndex: 0
          }}
        />
        
        {/* Subtle pattern overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(229, 90, 43, 0.05) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 140, 66, 0.05) 0%, transparent 50%)`,
            zIndex: 1
          }}
        />

        <div className="container-max relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Hero Content - Left Side */}
            <div className="space-y-8 animate-slide-up">
              
              {/* Main Headline - Clear Value Proposition */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight" style={{
                color: '#1A1A1A'
              }}>
                Quality Building Materials,{' '}
                <span style={{
                  background: `linear-gradient(135deg, #E55A2B 0%, #FF8C42 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Delivered Fast
                </span>
              </h1>

              {/* Concise Supporting Text */}
              <p className="text-xl md:text-2xl leading-relaxed max-w-xl" style={{
                color: '#4A5568',
                fontWeight: '400'
              }}>
                Premium M-Sand, Blue Metal, Cement & Bricks across Tamil Nadu. Trusted by 200+ projects since 2020.
              </p>

              {/* Strong CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={handleCallNow} 
                  className="btn-primary text-base px-8 py-4 flex items-center justify-center space-x-3 group"
                  style={{
                    fontSize: '1.125rem',
                    boxShadow: '0 10px 30px rgba(229, 90, 43, 0.3)'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span className="font-semibold">Get Instant Quote</span>
                </button>
                
                <button 
                  onClick={scrollToProducts}
                  className="btn-secondary text-base px-8 py-4 flex items-center justify-center space-x-3"
                  style={{
                    fontSize: '1.125rem',
                    backgroundColor: 'white',
                    color: '#E55A2B',
                    borderColor: '#E55A2B',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span className="font-semibold">View Products</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              {/* Trust Indicators - Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: '#E55A2B' }}>
                    200+
                  </div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Projects
                  </div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: '#E55A2B' }}>
                    24-48h
                  </div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Delivery
                  </div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: '#E55A2B' }}>
                    5+ Years
                  </div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Trusted
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image - Right Side */}
            <div className="relative animate-scale-in hidden lg:block">
              <div className="relative">
                {/* Main image with modern styling */}
                <img
                  src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Premium construction materials - VARMAN CONSTRUCTIONS"
                  className="rounded-2xl w-full h-[600px] object-cover shadow-2xl"
                  loading="eager"
                  style={{
                    border: '1px solid rgba(229, 90, 43, 0.2)'
                  }}
                />
                
                {/* Floating quality badge */}
                <div 
                  className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100"
                  style={{
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#E55A2B' }}
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">IS Certified</div>
                      <div className="text-sm text-gray-600">Quality Assured</div>
                    </div>
                  </div>
                </div>

                {/* Floating contact card */}
                <div 
                  className="absolute top-6 -right-6 bg-white p-5 rounded-xl shadow-xl border border-gray-100"
                  style={{
                    animation: 'float 3s ease-in-out infinite 1.5s'
                  }}
                >
                  <div className="text-sm font-semibold text-gray-500 mb-2">CALL US NOW</div>
                  <a 
                    href="tel:+917708484811"
                    className="text-xl font-bold hover:text-[var(--primary-color)] transition-colors"
                    style={{ color: '#1A1A1A' }}
                  >
                    +91 77084 84811
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Image */}
            <div className="relative lg:hidden">
              <img
                src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Premium construction materials"
                className="rounded-xl w-full h-64 object-cover shadow-lg"
                style={{ border: '1px solid rgba(229, 90, 43, 0.2)' }}
              />
            </div>
          </div>
        </div>

        {/* Floating animation keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}
