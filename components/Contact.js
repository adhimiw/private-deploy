function Contact() {
  try {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      phone: '',
      material: '',
      message: '',
      project_location: ''
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitMessage, setSubmitMessage] = React.useState('');
    const [whatsappAdminUrl, setWhatsappAdminUrl] = React.useState('');
    const [whatsappUserUrl, setWhatsappUserUrl] = React.useState('');

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitMessage('');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          setSubmitMessage(result.message);
          const adminUrl = result.whatsapp_admin_url || result.whatsapp_url || '';
          const userUrl = result.whatsapp_user_url || '';
          setWhatsappAdminUrl(adminUrl);
          setWhatsappUserUrl(userUrl);
          setFormData({
            name: '',
            email: '',
            phone: '',
            material: '',
            message: '',
            project_location: ''
          });
          
          // Redirect to WhatsApp after a short delay (admin notification)
          setTimeout(() => {
            if (adminUrl) {
              window.open(adminUrl, '_blank');
            }
          }, 1500);

          // Optional: send thank-you WhatsApp to user
          setTimeout(() => {
            if (userUrl) {
              window.open(userUrl, '_blank');
            }
          }, 2500);
        } else {
          setSubmitMessage('Error submitting form. Please try calling us directly.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitMessage('Error submitting form. Please try calling us directly.');
      }

      setIsSubmitting(false);
    };

    const handleWhatsAppContact = () => {
      const message = "Hi VARMAN CONSTRUCTIONS! I'm interested in your building materials. Please provide more information.";
      const whatsappUrl = `https://wa.me/917708484811?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    return (
      <section id="contact" className="section-padding bg-dark" data-name="contact" data-file="components/Contact.js">
        <div className="container-max relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Get in Touch with <span style={{color: 'var(--primary-color)'}}>VARMAN CONSTRUCTIONS</span>
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
              Ready to start your construction project? Contact us for quotes, material information, and expert guidance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8 animate-slide-up">
              <div>
                <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-8">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-6 bg-card rounded-xl border-subtle card-shadow group cursor-pointer">
                    <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="icon-phone text-lg text-[var(--background-primary)]"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Primary Contact</div>
                      <div className="text-[var(--text-secondary)]">+91 77084 84811</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-6 bg-card rounded-xl border-subtle card-shadow group cursor-pointer">
                    <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="icon-phone text-lg text-[var(--background-primary)]"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Secondary Contact</div>
                      <div className="text-[var(--text-secondary)]">+91 99652 37777</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-6 bg-card rounded-xl border-subtle card-shadow group cursor-pointer">
                    <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="icon-mail text-lg text-[var(--background-primary)]"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300">Email</div>
                      <div className="text-[var(--text-secondary)]">info@varmanconstructions.in</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-[var(--border-color)]">
                    <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                      <div className="icon-calendar text-lg text-[var(--background-primary)]"></div>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Established</div>
                      <div className="text-[var(--text-secondary)]">2020 - 5+ Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[var(--text-primary)]">Quick Contact</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.open('tel:+917708484811', '_self')}
                    className="w-full flex items-center justify-center space-x-2 bg-[var(--primary-color)] text-[var(--background-primary)] py-3 px-4 rounded-lg hover:bg-[var(--accent-color)] transition-colors"
                  >
                    <div className="icon-phone"></div>
                    <span>Call Now</span>
                  </button>
                  
                  <button 
                    onClick={handleWhatsAppContact}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 text-[var(--text-primary)] py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <div className="icon-message-circle"></div>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-3">Service Areas</h4>
                <p className="text-[var(--text-secondary)] mb-3 text-sm">We supply building materials across Tamilnadu with focus on:</p>
                <div className="grid grid-cols-1 gap-2 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center"><span className="text-[var(--primary-color)] mr-2">•</span>Tamil Nadu (Primary)</div>
                  <div className="flex items-center"><span className="text-[var(--primary-color)] mr-2">•</span>Karnataka</div>
                  <div className="flex items-center"><span className="text-[var(--primary-color)] mr-2">•</span>Kerala</div>
                  <div className="flex items-center"><span className="text-[var(--primary-color)] mr-2">•</span>Other states on request</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card p-8 rounded-lg border border-[var(--border-color)] shadow-lg">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Request a Quote / Send Inquiry</h3>
                
                {submitMessage && (
                  <div className={`p-4 rounded-lg mb-6 ${submitMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {submitMessage}
                    {!submitMessage.includes('Error') && (
                      <div className="text-sm mt-2">
                        We'll open WhatsApp for admin notification. If pop-ups are blocked, use the buttons below.
                      </div>
                    )}
                    {!submitMessage.includes('Error') && (whatsappAdminUrl || whatsappUserUrl) && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        {whatsappAdminUrl && (
                          <button
                            type="button"
                            onClick={() => window.open(whatsappAdminUrl, '_blank')}
                            className="btn-secondary"
                          >
                            Open Admin WhatsApp
                          </button>
                        )}
                        {whatsappUserUrl && (
                          <button
                            type="button"
                            onClick={() => window.open(whatsappUserUrl, '_blank')}
                            className="btn-secondary"
                          >
                            Open My WhatsApp
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Material Interest *</label>
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      >
                        <option value="">Select Material Type</option>
                        <option value="m_sand">M-Sand (Manufactured Sand)</option>
                        <option value="p_sand">P-Sand (Plastering Sand)</option>
                        <option value="blue_metal">Blue Metal / Jalli</option>
                        <option value="red_bricks">Red Bricks</option>
                        <option value="fly_ash_bricks">Fly Ash Bricks</option>
                        <option value="concrete_blocks">Concrete Hollow Blocks</option>
                        <option value="cement">Cement</option>
                        <option value="aac_blocks">AAC Blocks</option>
                        <option value="size_stone">Size Stone</option>
                        <option value="natural_stone">Natural Stone Aggregates</option>
                        <option value="multiple">Multiple Materials</option>
                        <option value="other">Other / Not Sure</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Project Location</label>
                    <input
                      type="text"
                      name="project_location"
                      placeholder="City, State (helps us provide accurate delivery info)"
                      value={formData.project_location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Project Details & Requirements *</label>
                    <textarea
                      name="message"
                      placeholder="Please provide details about your project: quantity needed, timeline, specific requirements, etc."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      required
                      className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[var(--primary-color)] text-[var(--background-primary)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--accent-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Inquiry & Continue on WhatsApp'}
                  </button>

                  <p className="text-sm text-[var(--text-secondary)] text-center">
                    By submitting this form, you agree to receive communication from VARMAN CONSTRUCTIONS via email and WhatsApp.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-card p-8 rounded-lg border border-[var(--border-color)]">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="icon-clock text-2xl text-[var(--background-primary)]"></div>
                </div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">Quick Response</h4>
                <p className="text-sm text-[var(--text-secondary)]">We respond to all inquiries within 2 hours during business hours</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="icon-truck text-2xl text-[var(--background-primary)]"></div>
                </div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">Fast Delivery</h4>
                <p className="text-sm text-[var(--text-secondary)]">24-48 hours delivery for most materials within our service areas</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="icon-shield-check text-2xl text-[var(--background-primary)]"></div>
                </div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">Quality Assured</h4>
                <p className="text-sm text-[var(--text-secondary)]">All materials meet IS standards with quality certificates provided</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Contact component error:', error);
    return null;
  }
}
