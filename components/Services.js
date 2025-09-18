function Services() {
  try {
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [showProductModal, setShowProductModal] = React.useState(false);

    const products = [
      {
        id: 'm_sand',
        icon: 'layers',
        title: 'M-Sand (Manufactured Sand)',
        shortDescription: 'High-quality manufactured sand for all construction needs',
        description: 'Premium manufactured sand produced under controlled conditions for consistent quality and performance.',
        specifications: ['Fineness Modulus: 2.6-3.0', 'Silt Content: <3%', 'Water Absorption: <2%', 'Bulk Density: 1.75-1.85 kg/m³'],
        uses: ['Concrete mixing', 'Plastering work', 'Block work', 'Foundation construction'],
        advantages: ['Consistent quality', 'No impurities', 'Better workability', 'Environmentally friendly'],
        unit: 'per cubic meter',
        image: './assets/msand.webp'
      },
      {
        id: 'p_sand',
        icon: 'droplets',
        title: 'P-Sand (Plastering Sand)',
        shortDescription: 'Fine sand specially processed for smooth plastering work',
        description: 'Specially processed fine sand perfect for plastering and finishing work with excellent workability.',
        specifications: ['Particle Size: 0.15-2mm', 'Silt Content: <2%', 'Clay Content: <1%', 'Fineness Modulus: 1.5-2.5'],
        uses: ['Wall plastering', 'Ceiling work', 'Finishing work', 'Tile fixing'],
        advantages: ['Smooth finish', 'Easy workability', 'No cracking', 'Better adhesion'],
        unit: 'per cubic meter',
        image: './assets/psand.webp'
      },
      {
        id: 'blue_metal',
        icon: 'zap',
        title: 'Blue Metal / Jalli',
        shortDescription: 'Crushed stone aggregates available in multiple sizes',
        description: 'High-quality crushed stone aggregates available in 6mm, 10mm, 12mm, 20mm, and 40mm sizes.',
        sizes: {
          '6mm': 'Fine aggregate for RCC work and concrete blocks',
          '10mm': 'Standard aggregate for structural concrete and general RCC work', 
          '12mm': 'Medium aggregate for slab concrete and foundation work',
          '20mm': 'Coarse aggregate for heavy concrete and bridge construction',
          '40mm': 'Large aggregate for mass concrete and infrastructure projects'
        },
        specifications: ['Crushing Strength: >200 N/mm²', 'Water Absorption: <1%', 'Impact Value: <10%', 'Specific Gravity: 2.6-2.8'],
        uses: ['Concrete construction', 'Road construction', 'Drainage work', 'Industrial flooring'],
        unit: 'per cubic meter',
        image: './assets/blue metals.webp'
      },
      {
        id: 'red_bricks',
        icon: 'home',
        title: 'Red Bricks',
        shortDescription: 'Traditional clay bricks for durable construction',
        description: 'High-quality traditional clay bricks available in first-class and second-class varieties.',
        types: {
          'First Class': 'Premium quality with strength >3.5 N/mm² for load-bearing walls',
          'Second Class': 'Standard quality for non-load bearing and partition walls'
        },
        specifications: ['Size: 230x110x75mm', 'Compressive Strength: 3.5-7 N/mm²', 'Water Absorption: 15-20%', 'Size Tolerance: ±3mm'],
        uses: ['Load bearing walls', 'Non-load bearing walls', 'Partition walls', 'General construction'],
        unit: 'per 1000 nos',
        image: './assets/red brick.webp'
      },
      {
        id: 'fly_ash_bricks',
        icon: 'leaf',
        title: 'Fly Ash Bricks',
        shortDescription: 'Eco-friendly high-strength bricks',
        description: 'Environment-friendly bricks made from fly ash and cement with superior strength and thermal properties.',
        specifications: ['Size: 230x110x75mm', 'Compressive Strength: 7.5-10 N/mm²', 'Water Absorption: 10-15%', 'Density: 1800-2000 kg/m³'],
        uses: ['Load bearing walls', 'High-rise construction', 'Earthquake resistant construction', 'Thermal insulation'],
        advantages: ['Higher strength', 'Lower weight', 'Better thermal insulation', 'Eco-friendly'],
        unit: 'per 1000 nos',
        image: './assets/brick.webp'
      },
      {
        id: 'concrete_blocks',
        icon: 'square',
        title: 'Concrete Hollow Blocks',
        shortDescription: 'Precast blocks for quick construction',
        description: 'Precast concrete hollow blocks designed for fast construction with excellent thermal and sound insulation.',
        specifications: ['Sizes: 200x200x400mm, 150x200x400mm, 100x200x400mm', 'Compressive Strength: >4 N/mm²', 'Density: 1500-1800 kg/m³'],
        uses: ['Partition walls', 'Compound walls', 'Non-load bearing walls', 'Quick construction'],
        advantages: ['Fast construction', 'Good insulation', 'Uniform size', 'Cost effective'],
        unit: 'per nos',
        image: './assets/concretate.webp'
      },
      {
        id: 'cement',
        icon: 'package',
        title: 'Cement',
        shortDescription: 'Premium Portland cement for all construction needs',
        description: 'High-quality Portland cement available in different grades from trusted manufacturers.',
        grades: {
          'OPC 43': 'Ordinary Portland Cement Grade 43 for general construction',
          'OPC 53': 'Ordinary Portland Cement Grade 53 for structural work',
          'PPC': 'Portland Pozzolana Cement for mass concrete work'
        },
        brands: ['UltraTech', 'ACC', 'Ambuja', 'JK Lakshmi', 'Birla A1'],
        specifications: ['Packaging: 50 kg bags', 'Strength: 43-53 N/mm² at 28 days', 'Setting Time: As per IS standards'],
        uses: ['Structural concrete', 'Plastering', 'Foundation work', 'General construction'],
        unit: 'per bag (50kg)',
        image: './assets/cement.webp'
      },
      {
        id: 'aac_blocks',
        icon: 'box',
        title: 'AAC Blocks',
        shortDescription: 'Lightweight autoclaved aerated concrete blocks',
        description: 'Lightweight, high-strength autoclaved aerated concrete blocks with excellent thermal and acoustic properties.',
        specifications: ['Sizes: 600x200x100/150/200mm', 'Density: 550-650 kg/m³', 'Compressive Strength: 3-4.5 N/mm²', 'Thermal Conductivity: 0.16-0.18 W/mK'],
        uses: ['Load bearing walls', 'Partition walls', 'Thermal insulation', 'Sound insulation'],
        advantages: ['Lightweight', 'Excellent insulation', 'Fire resistant', 'Earthquake resistant'],
        unit: 'per cubic meter',
        image: './assets/acc.webp'
      },
      {
        id: 'size_stone',
        icon: 'mountain',
        title: 'Size Stone',
        shortDescription: 'Cut-to-size natural stones',
        description: 'Premium quality natural stones cut to specific sizes for construction and decorative applications.',
        types: {
          'Granite': 'High strength granite stones for heavy construction and flooring',
          'Sandstone': 'Natural sandstone blocks for cladding and landscaping'
        },
        specifications: ['Compressive Strength: >100 N/mm²', 'Water Absorption: <0.5%', 'Custom sizes available'],
        uses: ['Flooring', 'Wall cladding', 'Landscaping', 'Decorative work'],
        unit: 'per sq.m / cubic meter',
        image: './assets/sizestone.webp'
      }
    ];

    const openProductModal = (product) => {
      setSelectedProduct(product);
      setShowProductModal(true);
    };

    const closeProductModal = () => {
      setShowProductModal(false);
      setSelectedProduct(null);
    };

    const handleGetQuote = () => {
      closeProductModal();
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <>
        <section id="services" className="section-padding bg-dark" data-name="services" data-file="components/Services.js">
          <div className="container-max relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
                Our <span style={{color: 'var(--primary-color)'}}>Building Materials</span> Catalog
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                Comprehensive range of <span style={{color: 'var(--secondary-color)', fontWeight: 'bold'}}>high-quality building materials</span> with detailed specifications and competitive pricing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div key={index} className="bg-card border-subtle rounded-xl overflow-hidden card-shadow cursor-pointer group animate-scale-in" onClick={() => openProductModal(product)}
                     style={{
                       animationDelay: `${index * 0.2}s`,
                       transition: 'all 0.4s ease'
                     }}>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{
                        filter: 'contrast(1.1) brightness(0.9)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-var(--glow-orange)/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="icon-arrow-right text-sm text-[var(--background-primary)]"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-500">
                        <div className={`icon-${product.icon} text-lg text-[var(--background-primary)]`}></div>
                      </div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      {product.shortDescription}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--text-muted)] font-medium bg-[var(--background-secondary)] px-3 py-1 rounded-full border border-[var(--primary-color)]/20">
                        Unit: {product.unit}
                      </span>
                      <span className="text-sm text-[var(--primary-color)] font-semibold hover:underline transition-all duration-300">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16 animate-slide-up">
              <div className="bg-card p-12 rounded-2xl border-subtle shadow-elevated">
                <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Need Custom Quantities or Specifications?</h3>
                <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">Contact us for bulk orders, custom specifications, or detailed quotations for your project.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button onClick={() => window.open('tel:+917708484811', '_self')} className="btn-primary">
                    Call Now: +91 77084 84811
                  </button>
                  <button onClick={handleGetQuote} className="btn-secondary">
                    Request Detailed Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Detail Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeProductModal}>
            <div className="bg-[var(--background-card)] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-bounce-in border border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-4">
                      <div className={`icon-${selectedProduct.icon} text-xl text-[var(--background-primary)]`}></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">{selectedProduct.title}</h2>
                      <p className="text-[var(--text-secondary)]">Unit: {selectedProduct.unit}</p>
                    </div>
                  </div>
                  <button onClick={closeProductModal} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-2xl transition-all duration-300 transform hover:scale-110">×</button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image and Description */}
                  <div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="text-[var(--text-secondary)] leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  {/* Specifications and Details */}
                  <div className="space-y-6">
                    {selectedProduct.specifications && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Specifications:</h4>
                        <ul className="space-y-2">
                          {selectedProduct.specifications.map((spec, idx) => (
                            <li key={idx} className="text-sm text-[var(--text-secondary)] flex items-start">
                              <span className="text-[var(--primary-color)] mr-2">•</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedProduct.sizes && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Available Sizes:</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedProduct.sizes).map(([size, desc]) => (
                            <div key={size} className="text-sm">
                              <span className="font-medium text-[var(--primary-color)]">{size}:</span>
                              <span className="text-[var(--text-secondary)] ml-2">{desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.types && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Types Available:</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedProduct.types).map(([type, desc]) => (
                            <div key={type} className="text-sm">
                              <span className="font-medium text-[var(--primary-color)]">{type}:</span>
                              <span className="text-[var(--text-secondary)] ml-2">{desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.grades && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Grades Available:</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedProduct.grades).map(([grade, desc]) => (
                            <div key={grade} className="text-sm">
                              <span className="font-medium text-[var(--primary-color)]">{grade}:</span>
                              <span className="text-[var(--text-secondary)] ml-2">{desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.brands && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Available Brands:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.brands.map((brand, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[var(--background-secondary)] text-[var(--primary-color)] rounded-full text-sm border border-[var(--primary-color)]/20">
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.uses && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Common Uses:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.uses.map((use, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-full text-sm border border-[var(--border-color)]">
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.advantages && (
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-3">Key Advantages:</h4>
                        <ul className="space-y-1">
                          {selectedProduct.advantages.map((advantage, idx) => (
                            <li key={idx} className="text-sm text-[var(--text-secondary)] flex items-center">
                              <div className="icon-check text-[var(--primary-color)] mr-2"></div>
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button onClick={() => window.open('tel:+917708484811', '_self')} className="btn-primary">
                    Call for Pricing: +91 77084 84811
                  </button>
                  <button onClick={handleGetQuote} className="btn-secondary">
                    Request Quote
                  </button>
                  <button onClick={() => window.open(`https://wa.me/917708484811?text=Hi, I need information about ${selectedProduct.title}`, '_blank')} className="btn-secondary">
                    WhatsApp Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('Services component error:', error);
    return null;
  }
}