function About() {
  try {
    const features = [
      {
        icon: 'award',
        title: 'ISO Certified',
        description: 'All our materials meet international quality standards'
      },
      {
        icon: 'clock',
        title: 'Timely Delivery',
        description: 'On-time delivery guaranteed with efficient logistics'
      },
      {
        icon: 'users',
        title: 'Expert Team',
        description: 'Experienced professionals in construction materials'
      },
      {
        icon: 'phone',
        title: '24/7 Support',
        description: 'Round-the-clock customer service and technical support'
      }
    ];

    return (
      <section id="about" className="section-padding bg-gray-50" data-name="about" data-file="components/About.js">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                Building India's Future with <span className="text-gradient">Quality Materials</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                With over 15 years of experience in the construction industry, Varman Construction has established itself as a leading supplier and exporter of premium construction materials across India. We serve builders, contractors, and infrastructure developers with reliable, high-quality materials.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Our extensive network covers 28 states, ensuring that quality construction materials reach every corner of India. From small residential projects to large infrastructure developments, we provide the materials that build India's future.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-6 pt-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-[var(--primary-color)] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className={`icon-${feature.icon} text-lg text-[var(--primary-color)]`}></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)] mb-1">{feature.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Construction workers and materials at building site"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute top-6 right-6 bg-[var(--primary-color)] text-white p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm opacity-90">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('About component error:', error);
    return null;
  }
}