function Hero() {
  try {
    return (
      <section id="home" className="pt-16 section-padding bg-gradient-to-br from-[var(--background-light)] to-white" data-name="hero" data-file="components/Hero.js">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                Premium <span className="text-gradient">Construction Materials</span> Export Across India
              </h1>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Varman Construction is your trusted partner for high-quality building materials. We supply and export premium construction materials including cement, steel, aggregates, and specialized building supplies to projects across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  Get Quote Now
                </button>
                <button className="btn-secondary">
                  View Our Materials
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)]">500+</div>
                  <div className="text-sm text-[var(--text-secondary)]">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)]">28</div>
                  <div className="text-sm text-[var(--text-secondary)]">States Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)]">15+</div>
                  <div className="text-sm text-[var(--text-secondary)]">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Construction materials and building site"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="icon-check text-xl text-green-600"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Quality Assured</div>
                    <div className="text-sm text-[var(--text-secondary)]">ISO Certified Materials</div>
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