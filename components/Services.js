function Services() {
  try {
    const services = [
      {
        icon: 'building',
        title: 'Cement & Concrete',
        description: 'Premium quality cement, ready-mix concrete, and specialized concrete solutions for all construction needs.'
      },
      {
        icon: 'zap',
        title: 'Steel & Reinforcement',
        description: 'High-grade steel bars, structural steel, and reinforcement materials from trusted manufacturers.'
      },
      {
        icon: 'layers',
        title: 'Aggregates & Sand',
        description: 'Quality aggregates, construction sand, gravel, and crushed stone for foundation and construction work.'
      },
      {
        icon: 'home',
        title: 'Bricks & Blocks',
        description: 'Traditional clay bricks, concrete blocks, AAC blocks, and specialized masonry units.'
      },
      {
        icon: 'truck',
        title: 'Nationwide Export',
        description: 'Reliable logistics and export services covering all major cities and construction sites across India.'
      },
      {
        icon: 'shield-check',
        title: 'Quality Assurance',
        description: 'All materials undergo rigorous quality testing and come with certification for construction standards.'
      }
    ];

    return (
      <section id="services" className="section-padding bg-white" data-name="services" data-file="components/Services.js">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Our Construction Materials & Services
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              We provide comprehensive construction material solutions with reliable export services across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-[var(--border-color)] rounded-lg p-6 card-shadow">
                <div className="w-12 h-12 bg-[var(--background-light)] rounded-lg flex items-center justify-center mb-4">
                  <div className={`icon-${service.icon} text-xl text-[var(--primary-color)]`}></div>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {service.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <button className="btn-primary">
              Request Material Catalog
            </button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Services component error:', error);
    return null;
  }
}