function Contact() {
  try {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      phone: '',
      material: '',
      message: ''
    });

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      alert('Thank you for your inquiry! We will contact you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        material: '',
        message: ''
      });
    };

    return (
      <section id="contact" className="section-padding bg-white" data-name="contact" data-file="components/Contact.js">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
              Ready to start your construction project? Contact us for quotes and material information.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[var(--background-light)] rounded-lg flex items-center justify-center">
                      <div className="icon-map-pin text-lg text-[var(--primary-color)]"></div>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Head Office</div>
                      <div className="text-[var(--text-secondary)]">Tamil Nadu, India</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[var(--background-light)] rounded-lg flex items-center justify-center">
                      <div className="icon-phone text-lg text-[var(--primary-color)]"></div>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Phone</div>
                      <div className="text-[var(--text-secondary)]">+91 98765 43210</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[var(--background-light)] rounded-lg flex items-center justify-center">
                      <div className="icon-mail text-lg text-[var(--primary-color)]"></div>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Email</div>
                      <div className="text-[var(--text-secondary)]">info@varmanconstruction.com</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-3">Service Areas</h4>
                <p className="text-[var(--text-secondary)] mb-3">We export construction materials to all major cities across India:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                  <div>• Chennai & Tamil Nadu</div>
                  <div>• Mumbai & Maharashtra</div>
                  <div>• Delhi & NCR</div>
                  <div>• Bangalore & Karnataka</div>
                  <div>• Hyderabad & Telangana</div>
                  <div>• Kolkata & West Bengal</div>
                  <div>• Pune & Surrounding Areas</div>
                  <div>• And 21 more states</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Request a Quote</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  >
                    <option value="">Select Material Type</option>
                    <option value="cement">Cement & Concrete</option>
                    <option value="steel">Steel & Reinforcement</option>
                    <option value="aggregates">Aggregates & Sand</option>
                    <option value="bricks">Bricks & Blocks</option>
                    <option value="multiple">Multiple Materials</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Project details and requirements"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="w-full btn-primary">
                  Send Inquiry
                </button>
              </form>
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