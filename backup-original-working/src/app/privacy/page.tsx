import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Population Pyramids',
  description: 'Privacy policy for Population Pyramids demographic visualization platform. Learn how we protect your data and respect your privacy while providing UN population data access.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Effective Date: November 2, 2024 | Last Updated: November 2, 2024
          </p>

          <div className="prose prose-base sm:prose-lg text-gray-700 space-y-6 sm:space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Introduction</h2>
              <p>
                This Privacy Policy describes how Population Pyramids ("we," "our," or "us") collects, uses, 
                and protects information when you use our demographic data visualization platform at 
                populationpyramids.org (the "Service"). We are committed to protecting your privacy and 
                ensuring transparency about our data practices.
              </p>
              <p>
                Our platform provides interactive access to United Nations demographic data without requiring 
                user registration or personal information collection. This policy explains our minimal data 
                collection practices and your rights regarding any information we may process.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide</h3>
              <p>
                Our Service does not require user registration, account creation, or personal information 
                submission. You can access all demographic data, interactive visualizations, and analysis 
                tools without providing any personally identifiable information.
              </p>
              <p>
                If you contact us via email at info@populationpyramids.org, we collect only the information 
                you voluntarily provide, such as your email address and message content, solely for the 
                purpose of responding to your inquiry.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <p>
                When you access our Service, we may automatically collect certain technical information 
                to ensure proper functionality and improve user experience:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Browser type and version for compatibility optimization</li>
                <li>Device type (desktop, mobile, tablet) for responsive design</li>
                <li>IP address for security and geographic analytics (anonymized)</li>
                <li>Pages visited and features used for service improvement</li>
                <li>Access times and session duration for performance monitoring</li>
                <li>Referring website information for traffic analysis</li>
              </ul>
              <p>
                This information is collected through standard web server logs and is used solely for 
                technical purposes, security monitoring, and service optimization.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">How We Use Information</h2>
              <p>
                We use the limited information we collect for the following legitimate purposes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Service Provision:</strong> To deliver demographic data visualizations and ensure platform functionality</li>
                <li><strong>Technical Optimization:</strong> To improve loading times, fix bugs, and enhance user experience</li>
                <li><strong>Security Protection:</strong> To detect and prevent unauthorized access, abuse, or malicious activity</li>
                <li><strong>Communication:</strong> To respond to inquiries sent to our contact email</li>
                <li><strong>Legal Compliance:</strong> To meet legal obligations and protect our rights and interests</li>
              </ul>
              <p>
                We do not use your information for marketing, advertising, profiling, or commercial purposes 
                beyond providing our educational and research-focused demographic visualization service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, rent, or otherwise transfer your information to third parties. 
                We may share limited information only in the following circumstances:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Service Providers:</strong> With trusted service providers who assist in platform hosting, 
                security, or technical maintenance, under strict confidentiality agreements</li>
                <li><strong>Legal Requirements:</strong> When required by law, legal process, or to protect 
                the rights, property, or safety of our users or others</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset 
                sale, with appropriate data protection measures</li>
              </ul>
              <p>
                All third-party service providers are carefully vetted and contractually obligated to 
                maintain appropriate data protection standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect against 
                unauthorized access, alteration, disclosure, or destruction of information:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Secure HTTPS encryption for all data transmission</li>
                <li>Regular security monitoring and vulnerability assessments</li>
                <li>Access controls and authentication for administrative systems</li>
                <li>Data minimization practices to collect only necessary information</li>
                <li>Regular security updates and patch management</li>
              </ul>
              <p>
                While we strive to protect your information, no internet transmission or electronic 
                storage method is 100% secure. We cannot guarantee absolute security but maintain 
                industry-standard protections.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Data Retention</h2>
              <p>
                We retain information only as long as necessary to fulfill the purposes outlined in this 
                Privacy Policy:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Technical Logs:</strong> Automatically deleted after 90 days unless required for security investigations</li>
                <li><strong>Email Communications:</strong> Retained for 2 years to maintain correspondence records</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely for research purposes</li>
              </ul>
              <p>
                We regularly review our data retention practices and delete information that is no longer 
                necessary for our legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Your Rights and Choices</h2>
              <p>
                You have certain rights regarding your information, depending on your jurisdiction:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Access:</strong> Request information about what data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your information where legally permissible</li>
                <li><strong>Portability:</strong> Request a copy of your information in a structured format</li>
                <li><strong>Objection:</strong> Object to certain processing activities where applicable</li>
              </ul>
              <p>
                To exercise these rights or ask questions about your data, contact us at 
                info@populationpyramids.org. We will respond to legitimate requests within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Cookies and Tracking Technologies</h2>
              <p>
                Our Service uses minimal tracking technologies necessary for functionality:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality and security</li>
                <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform</li>
                <li><strong>Functional Cookies:</strong> Remember user preferences for improved experience</li>
              </ul>
              <p>
                We do not use advertising cookies, third-party tracking, or cross-site tracking technologies. 
                You can control cookie settings through your browser preferences, though disabling essential 
                cookies may impact platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Third-Party Links</h2>
              <p>
                Our Service contains links to external websites, including the official UN Population 
                Database (population.un.org). We are not responsible for the privacy practices or content 
                of these third-party sites. We encourage you to review the privacy policies of any 
                external sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Children's Privacy</h2>
              <p>
                Our Service is designed for general audiences and educational use. We do not knowingly 
                collect personal information from children under 13 years of age. If we become aware 
                that we have inadvertently collected information from a child under 13, we will take 
                steps to delete such information promptly.
              </p>
              <p>
                Parents and guardians who believe their child has provided information to us should 
                contact us immediately at info@populationpyramids.org.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">International Data Transfers</h2>
              <p>
                Our Service may be hosted on servers located in various countries. If you are accessing 
                our Service from outside the country where our servers are located, your information 
                may be transferred, stored, and processed in accordance with this Privacy Policy and 
                applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices, 
                technology, legal requirements, or other factors. We will notify you of any material 
                changes by:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Posting the updated policy on our website with a new effective date</li>
                <li>Providing notice through our Service or via email if we have your contact information</li>
              </ul>
              <p>
                Your continued use of our Service after any changes indicates your acceptance of the 
                updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our 
                data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>Email:</strong> info@populationpyramids.org</p>
                <p><strong>Website:</strong> populationpyramids.org</p>
                <p><strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours during business days</p>
              </div>
              <p className="mt-4">
                We are committed to addressing your privacy concerns and ensuring your rights are 
                respected in accordance with applicable data protection laws.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}