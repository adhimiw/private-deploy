function Hero() {
  try {
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
        className="relative overflow-hidden"
        data-name="hero"
        data-file="components/Hero.js"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Dark gradient background like reference image */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #1a0a00 0%, #2d1810 25%, #3d2015 50%, #4a2818 75%, #2d1810 100%)',
            zIndex: 0
          }}
        />
        
        {/* Warm orange glow effect */}
        <div 
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '70%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(255, 140, 66, 0.3) 0%, rgba(229, 90, 43, 0.15) 40%, transparent 70%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
        
        {/* Subtle texture overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('assets/herobg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            opacity: 0.15,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <div className="container-max relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 animate-slide-up">
              {/* Main Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span style={{ color: '#FFFFFF' }}>Premium Building Materials</span>
                <br />
                <span style={{ color: '#FFFFFF' }}>Supplier Across </span>
                <span style={{
                  background: 'linear-gradient(135deg, #FF8C42, #FFB366)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Tamilnadu</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg md:text-xl leading-relaxed max-w-lg" style={{
                color: 'rgba(255, 255, 255, 0.85)'
              }}>
                Your trusted partner since 2020 for high-quality building materials. We supply <span style={{color: '#FF8C42', fontWeight: '600'}}>M-Sand, Blue Metal, Cement, Bricks</span>, and specialized construction supplies across Tamilnadu with guaranteed quality and timely delivery.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={handleGetQuote}
                  style={{
                    background: 'linear-gradient(135deg, #FF8C42, #E55A2B)',
                    color: '#FFFFFF',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(255, 140, 66, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.02)';
                    e.target.style.boxShadow = '0 12px 40px rgba(255, 140, 66, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 30px rgba(255, 140, 66, 0.4)';
                  }}
                >
                  Get Quote
                </button>
                <a 
                  href="tel:+917708484811"
                  style={{
                    background: 'transparent',
                    color: '#FFFFFF',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: '2px solid #FF8C42',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 140, 66, 0.1)';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call Now
                </a>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="tel:+917708484811" className="flex items-center space-x-2 transition-colors duration-300 hover:opacity-80" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <div className="icon-phone" style={{ color: '#FF8C42' }}></div>
                  <span className="font-medium">+91 77084 84811</span>
                </a>
                <a href="tel:+919965237777" className="flex items-center space-x-2 transition-colors duration-300 hover:opacity-80" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <div className="icon-phone" style={{ color: '#FF8C42' }}></div>
                  <span className="font-medium">+91 99652 37777</span>
                </a>
              </div>
            </div>

            {/* Right Side - Hero Visual with Stats */}
            <div className="relative animate-scale-in flex justify-center lg:justify-end">
              {/* Central Hero Image - Construction/Helmet Style */}
              <div className="relative">
                <img
                  src="assets/hero.png"
                  alt="Construction materials - VARMAN CONSTRUCTIONS"
                  className="relative z-10"
                  style={{
                    maxWidth: '450px',
                    width: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))'
                  }}
                  loading="eager"
                />
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
