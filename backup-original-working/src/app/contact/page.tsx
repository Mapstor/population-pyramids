import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Population Pyramids',
  description: 'Contact Population Pyramids team for support, feedback, or questions about our demographic data platform. Email us at info@populationpyramids.org for assistance.',
  openGraph: {
    title: 'Contact Us - Population Pyramids',
    description: 'Get in touch with Population Pyramids team for support, feedback, or questions about demographic data visualization.',
  },
};

// JSON-LD Schema for Contact page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'Population Pyramids',
    url: 'https://populationpyramids.org',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@populationpyramids.org',
      contactType: 'customer support',
      availableLanguage: 'English',
      serviceArea: {
        '@type': 'Place',
        name: 'Worldwide',
      },
    },
  },
};

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Us</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Get in touch with our team for questions, feedback, technical support, or collaboration opportunities 
            related to our demographic data visualization platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Primary Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Primary Email</h3>
                  <p className="text-gray-700 mb-2">
                    For all inquiries, technical support, and general questions about our platform:
                  </p>
                  <a 
                    href="mailto:info@populationpyramids.org" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-lg transition"
                  >
                    info@populationpyramids.org
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
                  <p className="text-gray-700">
                    We aim to respond to all inquiries within <strong>48 hours</strong> during business days. 
                    For urgent technical issues, we strive to provide initial responses within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Access</h3>
                  <p className="text-gray-700 mb-2">
                    Access our demographic data visualization platform:
                  </p>
                  <a 
                    href="/" 
                    className="text-blue-600 hover:text-blue-700 font-medium transition"
                  >
                    populationpyramids.org
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">What Can We Help You With?</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 Technical Support</h3>
                <p className="text-gray-700">
                  Report bugs, accessibility issues, performance problems, or other technical difficulties 
                  with our platform. Include browser information and specific error details when possible.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Data Questions</h3>
                <p className="text-gray-700">
                  Inquiries about our demographic data sources, methodology, accuracy, or requests for 
                  clarification about specific population statistics or projections.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎓 Academic & Research</h3>
                <p className="text-gray-700">
                  Support for academic projects, research collaborations, educational use, or questions 
                  about citing our platform and data in publications.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">💼 Business & Media</h3>
                <p className="text-gray-700">
                  Commercial licensing inquiries, media requests, partnership opportunities, or business 
                  applications of our demographic visualization tools.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Privacy & Legal</h3>
                <p className="text-gray-700">
                  Questions about our privacy policy, terms of service, data protection practices, 
                  or legal compliance matters.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Feedback & Suggestions</h3>
                <p className="text-gray-700">
                  Feature requests, user experience feedback, suggestions for improvements, or ideas 
                  for new demographic analysis tools.
                </p>
              </div>
            </div>
          </div>

          {/* Email Guidelines */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Email Guidelines</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject Line Best Practices</h3>
                <p className="text-gray-700 mb-3">
                  Help us route your inquiry efficiently by using clear, descriptive subject lines:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• "Technical Issue: [Brief Description]"</li>
                  <li>• "Data Question: [Country/Topic]"</li>
                  <li>• "Academic Inquiry: [Research Topic]"</li>
                  <li>• "Media Request: [Publication Name]"</li>
                  <li>• "Feature Request: [Suggestion]"</li>
                  <li>• "Partnership: [Organization Name]"</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Information to Include</h3>
                <p className="text-gray-700 mb-3">
                  To help us assist you more effectively, please include:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Detailed description of your question or issue</li>
                  <li>• Specific countries or data points of interest</li>
                  <li>• Your use case (academic, business, personal research)</li>
                  <li>• For technical issues: browser, device, and error messages</li>
                  <li>• Your affiliation (university, organization, company)</li>
                  <li>• Preferred timeline for response if time-sensitive</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Expectations</h3>
                <p className="text-gray-700">
                  Our responses will include relevant information, solutions, or next steps. For complex 
                  technical issues or research inquiries, we may request additional information or 
                  suggest a follow-up conversation.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I cite your platform in academic work?</h3>
                <p className="text-gray-700">
                  Please cite both our platform and the original UN data source. Include our website URL, 
                  access date, and reference the UN World Population Prospects 2024 Revision as the 
                  underlying data source.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use your data for commercial purposes?</h3>
                <p className="text-gray-700">
                  Our platform is designed for educational and research use. For commercial applications, 
                  please contact us to discuss appropriate licensing and attribution requirements.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How often is the demographic data updated?</h3>
                <p className="text-gray-700">
                  We update our data when the United Nations releases new revisions of the World Population 
                  Prospects. Major revisions typically occur every 2-3 years, with the current data from 
                  the 2024 revision.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you provide custom data analysis or visualizations?</h3>
                <p className="text-gray-700">
                  We focus on providing our standard interactive platform. For custom analysis requests, 
                  contact us to discuss potential collaboration or consulting services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there an API available for developers?</h3>
                <p className="text-gray-700">
                  We currently provide web-based access to our demographic visualizations. Contact us 
                  if you have specific API requirements for your project or application.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I report accessibility issues?</h3>
                <p className="text-gray-700">
                  We're committed to accessibility. Please report any issues with screen readers, 
                  keyboard navigation, or other accessibility features, including your assistive 
                  technology details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team and Mission */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Our Mission</h2>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-gray-700 text-lg mb-6">
                Population Pyramids is dedicated to democratizing access to authoritative demographic data 
                through interactive, user-friendly visualizations. We believe that understanding population 
                dynamics is crucial for informed decision-making in education, research, policy, and business.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                By transforming complex UN demographic datasets into accessible, visual formats, we support 
                evidence-based analysis and promote public understanding of global population trends. Our 
                platform serves researchers, educators, policymakers, students, and anyone interested in 
                exploring the fascinating world of demographics.
              </p>
              <p className="text-gray-700 text-lg">
                We're always interested in hearing from our users about how our platform supports their 
                work and how we can continue to improve our service to the global community.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Ready to Get in Touch?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Whether you have a quick question or a complex research inquiry, we're here to help. 
              Our team is committed to supporting your demographic analysis needs.
            </p>
            <a 
              href="mailto:info@populationpyramids.org"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Us an Email
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}