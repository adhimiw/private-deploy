function FAQ() {
  try {
    const [expandedCategory, setExpandedCategory] = React.useState('delivery');
    const [expandedQuestion, setExpandedQuestion] = React.useState(null);

    const faqCategories = [
      {
        id: 'delivery',
        title: 'Delivery & Logistics',
        icon: 'truck',
        questions: [
          {
            question: 'What is your delivery time?',
            answer: 'We deliver within 24-48 hours for most materials within our primary service areas (Tamil Nadu and neighboring states). For large orders or distant locations, delivery is typically within 2-3 days. We coordinate delivery schedules to match your project timeline.'
          },
          {
            question: 'Do you deliver to all areas in India?',
            answer: 'Yes, we deliver across India with focus on South Indian states. Our primary coverage includes Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, and Telangana. For other states, delivery is available with advance notice and may have additional charges based on distance.'
          },
          {
            question: 'What are the delivery charges?',
            answer: 'Delivery charges vary based on distance, quantity, and material type. For orders within 50km of our base location, delivery is often free for bulk orders. Contact us for specific delivery charges to your location.'
          },
          {
            question: 'Can I track my delivery?',
            answer: 'Yes, we provide delivery tracking through WhatsApp updates. You\'ll receive notifications when your material is dispatched, in transit, and delivered. Our drivers also coordinate directly with you for precise delivery timing.'
          }
        ]
      },
      {
        id: 'orders',
        title: 'Orders & Quantities',
        icon: 'package',
        questions: [
          {
            question: 'What are the minimum order quantities?',
            answer: 'Minimum orders vary by material: M-Sand/P-Sand (5 cubic meters), Blue Metal (3 cubic meters), Red Bricks (5,000 pieces), Cement (100 bags), AAC Blocks (1 cubic meter). For smaller quantities, contact us as we may accommodate based on location and availability.'
          },
          {
            question: 'Do you offer bulk discounts?',
            answer: 'Yes, we offer attractive discounts for bulk orders. Discounts typically start from 3% for orders above certain quantities and can go up to 10-15% for very large orders. The larger the quantity, the better the rates we can offer.'
          },
          {
            question: 'How do I place a bulk order?',
            answer: 'For bulk orders, contact us directly at +91 77084 84811 or through WhatsApp. We\'ll provide detailed quotations, delivery schedules, and can arrange site visits for very large projects. We also offer credit terms for established contractors.'
          },
          {
            question: 'Can I modify or cancel my order?',
            answer: 'Orders can be modified or cancelled before dispatch. If materials are already dispatched, cancellation may incur charges. We recommend confirming all details before order confirmation to avoid complications.'
          }
        ]
      },
      {
        id: 'payment',
        title: 'Payment & Pricing',
        icon: 'credit-card',
        questions: [
          {
            question: 'What payment methods do you accept?',
            answer: 'We accept multiple payment methods: Cash on Delivery (COD), Bank Transfer (NEFT/RTGS), Cheques, and digital payments (GPay, PhonePe, Paytm, UPI). For regular customers, we also offer credit terms after verification.'
          },
          {
            question: 'Do you offer credit terms?',
            answer: 'Yes, we offer credit terms for established contractors, builders, and repeat customers. Credit terms range from 15-30 days based on order value and customer relationship. Proper documentation and verification are required for credit approval.'
          },
          {
            question: 'How is pricing determined?',
            answer: 'Pricing depends on material type, quantity, current market rates, delivery location, and timeline. We provide transparent pricing with no hidden charges. Bulk orders receive better rates, and we match competitive pricing for genuine requirements.'
          },
          {
            question: 'Do prices include taxes?',
            answer: 'Prices quoted are typically exclusive of GST (18% for most materials). Final invoices include all applicable taxes. We provide proper GST invoices for all transactions, which can be used for input tax credit by businesses.'
          }
        ]
      },
      {
        id: 'quality',
        title: 'Quality & Standards',
        icon: 'shield-check',
        questions: [
          {
            question: 'Are your materials tested for quality?',
            answer: 'Yes, all our materials undergo rigorous quality testing and meet IS (Indian Standards) specifications. We source from certified manufacturers and conduct regular quality checks. Test certificates are provided on request for all major materials.'
          },
          {
            question: 'Do you provide material certificates?',
            answer: 'Yes, we provide quality certificates, test reports, and compliance documentation for all materials. This includes IS certification for cement, test reports for aggregates, and quality assurance certificates for bricks and blocks.'
          },
          {
            question: 'What if materials are damaged during delivery?',
            answer: 'We ensure secure packaging and careful handling during transport. In case of damage during delivery, please inform us immediately with photos. We replace damaged materials at no extra cost for damages occurring during transit.'
          },
          {
            question: 'Do you offer material warranty?',
            answer: 'We stand behind the quality of all our materials. While construction materials don\'t have traditional warranties, we guarantee that all materials meet specified standards and will replace any materials that don\'t meet quality requirements.'
          }
        ]
      },
      {
        id: 'support',
        title: 'Support & Service',
        icon: 'headphones',
        questions: [
          {
            question: 'Do you provide technical support?',
            answer: 'Yes, our experienced team provides technical guidance on material selection, quantities required, and best practices for different applications. We can help you choose the right materials for your specific construction needs.'
          },
          {
            question: 'Can you help calculate material requirements?',
            answer: 'Absolutely! Provide us with your project details (area, type of construction, etc.), and our experts will help calculate the exact quantities needed. This helps avoid wastage and ensures you order the right amount.'
          },
          {
            question: 'Do you offer site consultation?',
            answer: 'For large projects, we offer site consultation services where our experts visit your location to understand requirements better and provide customized solutions. This service is available for substantial orders.'
          },
          {
            question: 'What are your business hours?',
            answer: 'We operate Monday to Saturday from 8:00 AM to 7:00 PM, and Sunday from 9:00 AM to 5:00 PM. For urgent requirements, you can WhatsApp us anytime, and we\'ll respond as soon as possible.'
          }
        ]
      }
    ];

    const toggleCategory = (categoryId) => {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
      setExpandedQuestion(null);
    };

    const toggleQuestion = (questionIndex) => {
      setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex);
    };

    return (
      <section id="faq" className="section-padding bg-white" data-name="faq" data-file="components/FAQ.js">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Find answers to common questions about our materials, delivery, pricing, and services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    expandedCategory === category.id
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'
                  }`}
                >
                  <div className={`icon-${category.icon} text-sm`}></div>
                  <span className="text-sm">{category.title}</span>
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            {faqCategories.map((category) => (
              <div
                key={category.id}
                className={`${expandedCategory === category.id ? 'block' : 'hidden'}`}
              >
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mr-3">
                      <div className={`icon-${category.icon} text-lg text-white`}></div>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">{category.title}</h3>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="bg-white rounded-lg border border-[var(--border-color)]">
                        <button
                          onClick={() => toggleQuestion(`${category.id}-${index}`)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-[var(--text-primary)] pr-4">{faq.question}</span>
                          <div className={`icon-chevron-down text-[var(--primary-color)] transform transition-transform ${
                            expandedQuestion === `${category.id}-${index}` ? 'rotate-180' : ''
                          }`}></div>
                        </button>
                        {expandedQuestion === `${category.id}-${index}` && (
                          <div className="px-6 pb-4">
                            <div className="border-t border-[var(--border-color)] pt-4">
                              <p className="text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions section */}
          <div className="mt-12 text-center bg-gradient-to-r from-[var(--background-light)] to-white p-8 rounded-lg border border-[var(--border-color)]">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Still Have Questions?</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
              Our team is here to help! Contact us for personalized assistance with your building material requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('tel:+917708484811', '_self')}
                className="btn-primary"
              >
                Call Us: +91 77084 84811
              </button>
              <button 
                onClick={() => {
                  const message = "Hi VARMAN CONSTRUCTIONS! I have some questions about your building materials. Can you help?";
                  window.open(`https://wa.me/917708484811?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="btn-secondary"
              >
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('FAQ component error:', error);
    return null;
  }
}