import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Population Pyramids',
  description: 'Terms of service for Population Pyramids platform. Legal terms and conditions for using our interactive demographic data visualization and analysis tools.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Effective Date: November 2, 2024 | Last Updated: November 2, 2024
          </p>

          <div className="prose prose-base sm:prose-lg text-gray-700 space-y-6 sm:space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Agreement to Terms</h2>
              <p>
                Welcome to Population Pyramids ("we," "our," "us"), a demographic data visualization platform 
                accessible at populationpyramids.org (the "Service"). These Terms of Service ("Terms") 
                constitute a legally binding agreement between you ("User," "you," or "your") and Population 
                Pyramids regarding your access to and use of our Service.
              </p>
              <p>
                By accessing, browsing, or using our Service, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and our Privacy Policy. If you do not agree with any 
                part of these Terms, you must not access or use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Description of Service</h2>
              <p>
                Population Pyramids is an educational and research platform that provides:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Interactive demographic data visualizations for 195 countries and territories</li>
                <li>Population pyramid charts based on United Nations World Population Prospects 2024 data</li>
                <li>Historical and projected population statistics from 1950 to 2025</li>
                <li>Age structure analysis, demographic indicators, and comparative tools</li>
                <li>Educational resources about demographic trends and population analysis</li>
              </ul>
              <p>
                Our Service is provided free of charge for educational, research, and informational purposes. 
                We source all demographic data directly from the United Nations Department of Economic and 
                Social Affairs, Population Division, ensuring accuracy and reliability.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Permitted Uses</h2>
              <p>
                You are granted a limited, non-exclusive, non-transferable license to access and use our 
                Service for the following legitimate purposes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Educational Use:</strong> Academic research, classroom instruction, and student projects</li>
                <li><strong>Research Activities:</strong> Demographic analysis, policy research, and scholarly publications</li>
                <li><strong>Professional Use:</strong> Business analysis, government planning, and organizational research</li>
                <li><strong>Personal Use:</strong> Individual learning and understanding of demographic trends</li>
                <li><strong>Media and Journalism:</strong> Factual reporting and data-driven storytelling with proper attribution</li>
              </ul>
              <p>
                When using our demographic data or visualizations in publications, presentations, or other 
                works, you agree to provide appropriate attribution to both Population Pyramids and the 
                original UN data source.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Prohibited Uses</h2>
              <p>
                You agree not to use our Service for any of the following prohibited purposes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Violating any applicable laws, regulations, or third-party rights</li>
                <li>Attempting to gain unauthorized access to our systems or user accounts</li>
                <li>Distributing malware, viruses, or other harmful computer code</li>
                <li>Interfering with or disrupting the integrity or performance of our Service</li>
                <li>Using automated systems (bots, scrapers) to access our Service without permission</li>
                <li>Reproducing, duplicating, or creating derivative works without authorization</li>
                <li>Misrepresenting the source or accuracy of demographic data</li>
                <li>Using our Service for discriminatory, harmful, or unethical purposes</li>
                <li>Attempting to reverse engineer, decompile, or extract source code</li>
                <li>Removing or altering copyright notices, attribution, or proprietary markings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Data Accuracy and Limitations</h2>
              <p>
                Our Service provides demographic data sourced from the United Nations World Population 
                Prospects 2024 Revision. While we strive to ensure accuracy and completeness:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Data is provided "as-is" based on UN estimates and projections</li>
                <li>Population projections are subject to uncertainty and may change with future revisions</li>
                <li>We make no warranties regarding the accuracy, completeness, or fitness for specific purposes</li>
                <li>Users should verify data independently for critical applications</li>
                <li>We reserve the right to update data as new UN revisions become available</li>
              </ul>
              <p>
                You acknowledge that demographic data involves estimates, projections, and methodological 
                assumptions that may affect accuracy, particularly for future years.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Intellectual Property Rights</h2>
              <p>
                The Service, including its design, functionality, visualizations, and user interface, 
                is protected by intellectual property laws. Our rights include:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Platform Technology:</strong> Software, algorithms, and visualization tools are our proprietary assets</li>
                <li><strong>Design Elements:</strong> User interface, graphics, and presentation formats are protected</li>
                <li><strong>Data Processing:</strong> Our methods for aggregating and presenting UN data are proprietary</li>
                <li><strong>Educational Content:</strong> Original explanatory text and educational materials are protected</li>
              </ul>
              <p>
                The underlying demographic data is sourced from the United Nations and remains subject 
                to UN terms and conditions. You may use the data in accordance with UN guidelines and 
                these Terms, with proper attribution to both sources.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">User Responsibilities</h2>
              <p>
                As a user of our Service, you agree to:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Use the Service in compliance with all applicable laws and regulations</li>
                <li>Respect the intellectual property rights of Population Pyramids and the United Nations</li>
                <li>Provide accurate attribution when using our data or visualizations</li>
                <li>Not misrepresent the source, methodology, or accuracy of demographic information</li>
                <li>Report any technical issues, errors, or security vulnerabilities to our team</li>
                <li>Respect the educational and research purpose of our platform</li>
                <li>Maintain the confidentiality of any login credentials if account features are added</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Service Availability</h2>
              <p>
                We strive to maintain continuous availability of our Service, but cannot guarantee 
                uninterrupted access due to:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Scheduled maintenance and system updates</li>
                <li>Technical difficulties or server issues</li>
                <li>Third-party service dependencies</li>
                <li>Force majeure events beyond our control</li>
                <li>Security incidents requiring temporary service suspension</li>
              </ul>
              <p>
                We will make reasonable efforts to provide advance notice of planned maintenance and 
                to restore service promptly in case of unexpected interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Disclaimers and Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>OUR SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND</li>
                <li>WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR PURPOSE</li>
                <li>WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, SECURE, OR CONTINUOUSLY AVAILABLE</li>
                <li>WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES</li>
                <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO USE OUR SERVICE (WHICH IS ZERO)</li>
                <li>WE ARE NOT RESPONSIBLE FOR DECISIONS MADE BASED ON DEMOGRAPHIC DATA OR PROJECTIONS</li>
              </ul>
              <p>
                Some jurisdictions do not allow the exclusion of certain warranties or limitation of 
                liability, so these limitations may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Population Pyramids, its affiliates, 
                officers, directors, employees, and agents from and against any claims, liabilities, 
                damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Your use of our Service in violation of these Terms</li>
                <li>Your violation of any applicable laws or third-party rights</li>
                <li>Any content you submit or transmit through our Service</li>
                <li>Your negligent or wrongful conduct</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection, use, and protection of personal 
                information is governed by our Privacy Policy, which is incorporated into these Terms 
                by reference. Key privacy principles include:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Minimal data collection - no registration required</li>
                <li>No personal information sale or unauthorized sharing</li>
                <li>Industry-standard security measures</li>
                <li>Transparent data practices and user rights</li>
                <li>Compliance with applicable data protection laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Termination</h2>
              <p>
                We reserve the right to terminate or suspend your access to our Service immediately, 
                without prior notice, for any reason, including:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Violation of these Terms of Service</li>
                <li>Illegal or harmful use of our platform</li>
                <li>Technical or security concerns</li>
                <li>Discontinuation of our Service</li>
              </ul>
              <p>
                Upon termination, your right to use the Service ceases immediately. Provisions of 
                these Terms that by their nature should survive termination shall survive, including 
                intellectual property rights, disclaimers, and limitation of liability.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Changes to Terms</h2>
              <p>
                We may modify these Terms at any time to reflect changes in our Service, legal 
                requirements, or business practices. We will notify users of material changes by:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Posting the updated Terms on our website with a new effective date</li>
                <li>Providing prominent notice on our Service</li>
                <li>Sending email notification if we have your contact information</li>
              </ul>
              <p>
                Your continued use of our Service after any changes constitutes acceptance of the 
                modified Terms. If you disagree with any changes, you must stop using our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with applicable law. Any 
                disputes arising from these Terms or your use of our Service will be resolved through:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Informal Resolution:</strong> We encourage users to contact us first to resolve disputes amicably</li>
                <li><strong>Mediation:</strong> If informal resolution fails, disputes may be submitted to mediation</li>
                <li><strong>Arbitration:</strong> Binding arbitration may be required for certain types of disputes</li>
                <li><strong>Class Action Waiver:</strong> You agree not to participate in class action lawsuits against us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, the remaining 
                provisions shall continue in full force and effect. The unenforceable provision shall 
                be modified to the minimum extent necessary to make it enforceable while preserving 
                its original intent.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between 
                you and Population Pyramids regarding your use of our Service. These Terms supersede 
                any prior agreements, communications, or understandings between the parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h2>
              <p>
                If you have questions, concerns, or disputes regarding these Terms of Service, 
                please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>Email:</strong> info@populationpyramids.org</p>
                <p><strong>Website:</strong> populationpyramids.org</p>
                <p><strong>Subject Line:</strong> "Terms of Service Inquiry"</p>
                <p><strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours during business days</p>
              </div>
              <p className="mt-4">
                We are committed to addressing your concerns and ensuring a positive experience 
                while using our demographic data visualization platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Acknowledgment</h2>
              <p>
                By using our Service, you acknowledge that you have read, understood, and agree to 
                be bound by these Terms of Service and our Privacy Policy. Thank you for using 
                Population Pyramids to explore and understand global demographic trends.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}