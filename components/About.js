function About() {
  try {
    const features = [
      {
        icon: 'award',
        title: 'IS Certified Materials',
        description: 'All our materials meet Tamilnadun Standard specifications with proper certification'
      },
      {
        icon: 'clock',
        title: 'Timely Delivery',
        description: '24-48 hours delivery within service areas with reliable logistics network'
      },
      {
        icon: 'users',
        title: 'Expert Team',
        description: '5+ years of experience in building materials supply and customer service'
      },
      {
        icon: 'phone',
        title: 'Customer Support',
        description: 'Dedicated support team available during business hours for assistance'
      },
      {
        icon: 'truck',
        title: 'Pan-Tamilnadu Supply',
        description: 'Serving customers across Tamilnadu with focus on South Tamilnadun states'
      },
      {
        icon: 'shield-check',
        title: 'Quality Assurance',
        description: 'Rigorous quality checks and testing for all materials before dispatch'
      }
    ];
    const stats = [
      { number: '200+', label: 'Projects Completed', icon: 'building' },
      { number: '3+', label: 'States Covered', icon: 'map' },
      { number: '5+', label: 'Years Experience', icon: 'calendar' },
      { number: '24-48', label: 'Hours Delivery', icon: 'clock' }
    ];
    return (
      <section className="section-padding bg-dark py-24 md:py-32" data-file="components/About.js" data-name="about" id="about">
        <div className="container-max">
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center w-full md:w-max px-6 py-3 sm:px-8 sm:py-4 md:px-16 md:py-8 bg-card rounded-full shadow-md border border-[var(--border-color)] mb-6 md:mb-8 md:whitespace-nowrap md:shrink-0">
                <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 bg-[var(--primary-color)] rounded-full mr-3 sm:mr-4 md:mr-6"></div>
                <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-[var(--text-primary)] leading-tight md:leading-none">About VARMAN CONSTRUCTIONS</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)]">
                Building Tamilnadu's Future with <span className="text-gradient">Quality Materials</span> Since 2020
              </h2>
              
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
                VARMAN CONSTRUCTIONS, established in 2020, has rapidly grown to become a trusted supplier of premium building materials across Tamilnadu. Despite being a relatively new player in the market, our commitment to quality and customer satisfaction has helped us serve over 200+ construction projects successfully.
              </p>
              
              <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
                We specialize in supplying high-quality construction materials including M-Sand, Blue Metal (Jalli), various types of bricks, cement, AAC blocks, and natural stones. Our extensive network now covers 3+ states with a primary focus on South Tamilnadun markets, ensuring that quality construction materials reach every corner of our service area.
              </p>
              <div className="bg-card p-6 rounded-lg border border-[var(--border-color)] shadow-sm">
                <h4 className="font-semibold text-[var(--text-primary)] mb-3">Our Commitment</h4>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  "We believe that every construction project deserves the best materials. Our mission is to provide consistent quality, competitive pricing, and reliable service that helps our customers build with confidence. From small residential projects to large infrastructure developments, we are committed to being your trusted material supplier partner."
                </p>
              </div>
              {/* Contact Info */}
              <div className="flex flex-col md:flex-row items-start md:items-center text-left gap-4 sm:gap-6 md:gap-10 text-base sm:text-lg md:text-xl font-bold flex-wrap md:flex-nowrap w-full"> {/* Keep straight line on md+ */}
                <div className="inline-flex items-center space-x-3 text-[var(--text-secondary)] whitespace-nowrap">
                  <div className="icon-phone text-[var(--primary-color)]"></div>
                  <span className="whitespace-nowrap">+91 77084 84811</span>
                </div>
                <div className="inline-flex items-center space-x-3 text-[var(--text-secondary)] whitespace-nowrap">
                  <div className="icon-mail text-[var(--primary-color)]"></div>
                  <span className="whitespace-nowrap">info@varmanconstructions.in</span>
                </div>
                <div className="inline-flex items-center space-x-3 text-[var(--text-secondary)] whitespace-nowrap">
                  <div className="icon-briefcase text-[var(--primary-color)]"></div>
                  <span className="whitespace-nowrap">GSTIN: 33BTGPM9877H1Z3</span>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="VARMAN CONSTRUCTIONS - Building materials supplier"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute top-6 right-6 bg-[var(--primary-color)] text-[var(--background-primary)] p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">2020</div>
                  <div className="text-sm opacity-90">Established</div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 bg-card p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
                    <div className="icon-trending-up text-lg text-[var(--background-primary)]"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Growing Fast</div>
                    <div className="text-sm text-[var(--text-secondary)]">200+ Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div className="bg-card p-6 rounded-lg border border-[var(--border-color)] text-center card-shadow" key={index}>
                <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className={`icon-${stat.icon} text-[var(--background-primary)] text-xl`}></div>
                </div>
                <div className="text-2xl font-bold text-[var(--primary-color)] mb-1">{stat.number}</div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
          {/* Features Grid */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                Why Choose VARMAN CONSTRUCTIONS?
              </h3>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Our commitment to quality, service, and customer satisfaction sets us apart in the building materials industry
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div className="bg-card p-6 rounded-lg border border-[var(--border-color)] card-shadow" key={index}>
                  <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mb-4">
                    <div className={`icon-${feature.icon} text-[var(--background-primary)] text-xl`}></div>
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Our Mission & Vision */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg border border-[var(--border-color)]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-3">
                  <div className="icon-target text-lg text-[var(--background-primary)]"></div>
                </div>
                <h4 className="text-xl font-semibold text-[var(--text-primary)]">Our Mission</h4>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To be the most trusted supplier of high-quality building materials across Tamilnadu, providing exceptional value to our customers through reliable products, competitive pricing, and outstanding service that supports their construction dreams.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-[var(--border-color)]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-3">
                  <div className="icon-eye text-lg text-[var(--background-primary)]"></div>
                </div>
                <h4 className="text-xl font-semibold text-[var(--text-primary)]">Our Vision</h4>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To become the preferred choice for construction materials across Tamilnadu by consistently delivering superior quality products, innovative solutions, and establishing new benchmarks for customer satisfaction and industry excellence.
              </p>
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
