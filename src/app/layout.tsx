import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Population Pyramids - Interactive Demographics for 195 Countries',
    template: '%s | Population Pyramids'
  },
  description: 'Explore interactive population pyramids for 195 countries from 1950-2025. Analyze age distribution, demographic trends, and population data with real UN World Population Prospects 2024.',
  keywords: ['population pyramid', 'demographics', 'population data', 'UN data', 'age structure', 'demographic analysis', 'population statistics', 'world population', 'population growth', 'demographic transition'],
  authors: [{ name: 'Population Pyramids' }],
  creator: 'Population Pyramids',
  publisher: 'Population Pyramids',
  metadataBase: new URL('https://populationpyramids.org'),
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://populationpyramids.org',
    title: 'Population Pyramids - Interactive Demographics for 195 Countries',
    description: 'Explore interactive population pyramids for 195 countries from 1950-2025. Analyze age distribution, demographic trends, and population data with real UN World Population Prospects 2024.',
    siteName: 'Population Pyramids',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Population Pyramids - Interactive demographic visualization platform showing age structure charts',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Population Pyramids - Interactive Demographics for 195 Countries',
    description: 'Explore interactive population pyramids for 195 countries from 1950-2025. Real UN demographic data visualization.',
    images: ['/og-image.png'],
    creator: '@populationpyramids',
    site: '@populationpyramids',
  },
  
  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'google12f8c2f9c03913a3',
    other: {
      'msvalidate.01': '57C407E8336C4915E2D28EEA649C8078'
    }
  },
  
  category: 'education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Clarity tracking code for https://www.populationpyramids.org/ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "uakgabnpiz");
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics measurementId="G-HXTB2KJ9X6" />
        
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Header />
          
          <main className="flex-grow overflow-x-hidden">
            {children}
          </main>
          
          <footer className="bg-gray-900 text-gray-300 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="font-bold text-white">PopulationPyramids</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Interactive demographic visualizations based on United Nations data.
                  </p>
                </div>

                {/* Browse */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Browse</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="text-gray-400 hover:text-white transition">All Countries</a></li>
                    <li><a href="/compare" className="text-gray-400 hover:text-white transition">Compare</a></li>
                    <li><a href="/search" className="text-gray-400 hover:text-white transition">Search</a></li>
                    <li><a href="/about" className="text-gray-400 hover:text-white transition">About</a></li>
                    <li><a href="/sitemap.xml" className="text-gray-400 hover:text-white transition">Sitemap</a></li>
                  </ul>
                </div>

                {/* Popular */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Popular</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/united-states" className="text-gray-400 hover:text-white transition">United States</a></li>
                    <li><a href="/china" className="text-gray-400 hover:text-white transition">China</a></li>
                    <li><a href="/india" className="text-gray-400 hover:text-white transition">India</a></li>
                    <li><a href="/japan" className="text-gray-400 hover:text-white transition">Japan</a></li>
                  </ul>
                </div>

                {/* Data Source */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Data Source</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    UN World Population Prospects 2024 Revision
                  </p>
                  <a 
                    href="https://population.un.org/wpp/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition inline-flex items-center"
                  >
                    Visit UN Database
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Bottom */}
              <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} PopulationPyramids. Data licensed under Creative Commons.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition">Privacy</a>
                  <a href="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition">Terms</a>
                  <a href="/contact" className="text-sm text-gray-500 hover:text-gray-300 transition">Contact</a>
                  <a href="/sitemap.xml" className="text-sm text-gray-500 hover:text-gray-300 transition">Sitemap</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}