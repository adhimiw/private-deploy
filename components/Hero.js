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
      <section id="home" className="pt-16 section-padding bg-gradient-to-br from-[var(--background-light)] to-white" data-name="hero" data-file="components/Hero.js">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-[var(--border-color)] mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Established 2020 • Trusted Supplier</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                Premium <span className="text-gradient">Building Materials</span> Supplier Across India
              </h1>
              
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                VARMAN CONSTRUCTIONS - Your trusted partner since 2020 for high-quality building materials. We supply M-Sand, Blue Metal, Cement, Bricks, and specialized construction supplies across India with guaranteed quality and timely delivery.
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
              <div className="flex flex-col sm:flex-row gap-4 pt-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center space-x-2">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span>+91 77084 84811</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span>+91 99652 37777</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)]">500+</div>
                  <div className="text-sm text-[var(--text-secondary)]">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)]">5+</div>
                  <div className="text-sm text-[var(--text-secondary)]">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)]">15+</div>
                  <div className="text-sm text-[var(--text-secondary)]">States Covered</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Construction materials and building site - VARMAN CONSTRUCTIONS"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="icon-check text-xl text-green-600"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Quality Assured</div>
                    <div className="text-sm text-[var(--text-secondary)]">IS Standard Materials</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Highlights */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Our Premium Materials</h2>
              <p className="text-[var(--text-secondary)]">High-quality construction materials for all your building needs</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-lg border border-[var(--border-color)] text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🏗️</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">M-Sand</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--border-color)] text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Blue Metal</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--border-color)] text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🧱</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Red Bricks</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--border-color)] text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🏢</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">AAC Blocks</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--border-color)] text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🔨</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Cement</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[var(--border-color)] text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🪨</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Size Stone</div>
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