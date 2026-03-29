'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActivePage = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const isToolsActive = () => {
    const toolPaths = ['/compare', '/dependency-ratio-calculator', '/generation-age-ranges-calculator', '/population-growth-rate-calculator'];
    return toolPaths.some(path => pathname.startsWith(path));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b-2 border-blue-100 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Academic and Professional */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-200 shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
                PopulationPyramids
              </span>
              <div className="flex items-center space-x-2 text-xs text-blue-600 leading-none mt-1">
                <span className="font-medium">UN World Population Prospects Data Visualised</span>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-blue-700 font-semibold">Verified Data</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation - Academic and Professional */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-50 rounded-full px-2 py-1 border border-gray-200 shadow-sm">
            <Link 
              href="/countries" 
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActivePage('/countries') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              Countries
            </Link>
            <Link 
              href="/states" 
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActivePage('/states') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              US States
            </Link>
            <Link 
              href="/blog" 
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActivePage('/blog') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              Blog
            </Link>
            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1 ${
                  isToolsActive() 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                Tools
                <svg 
                  className={`w-4 h-4 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isToolsDropdownOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <Link
                    href="/compare"
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  >
                    <div className="font-semibold text-gray-900">🔄 Compare Countries</div>
                    <div className="text-xs text-gray-600 mt-1">Side-by-side population pyramid comparison</div>
                  </Link>
                  <Link
                    href="/population-growth-rate-calculator"
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  >
                    <div className="font-semibold text-gray-900">📈 Growth Rate Calculator</div>
                    <div className="text-xs text-gray-600 mt-1">Calculate population growth rates by country</div>
                  </Link>
                  <Link
                    href="/dependency-ratio-calculator"
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  >
                    <div className="font-semibold text-gray-900">👥 Dependency Ratio Calculator</div>
                    <div className="text-xs text-gray-600 mt-1">Analyze age dependency ratios</div>
                  </Link>
                  <Link
                    href="/generation-age-ranges-calculator"
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  >
                    <div className="font-semibold text-gray-900">🎯 Generation Age Ranges</div>
                    <div className="text-xs text-gray-600 mt-1">Find generational cohort age ranges</div>
                  </Link>
                  <Link
                    href="/male-to-female-ratio"
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  >
                    <div className="font-semibold text-gray-900">⚖️ Gender Ratio Calculator</div>
                    <div className="text-xs text-gray-600 mt-1">Male to female ratio by country</div>
                  </Link>
                  <Link
                    href="/median-age-by-country"
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  >
                    <div className="font-semibold text-gray-900">🌐 Median Age Explorer</div>
                    <div className="text-xs text-gray-600 mt-1">Oldest & youngest populations</div>
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/about" 
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActivePage('/about') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              About
            </Link>
            
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            
            {/* Academic Search Icon with enhanced styling */}
            <button className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200 hover:shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </nav>

          {/* Mobile menu button - Enhanced Professional */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 border border-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu - Professional Academic Style */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-blue-100 py-6 bg-gradient-to-b from-blue-50 to-white">
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/countries" 
                className={`mx-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActivePage('/countries') 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Countries
              </Link>
              <Link 
                href="/states" 
                className={`mx-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActivePage('/states') 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                US States
              </Link>
              <Link 
                href="/blog" 
                className={`mx-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActivePage('/blog') 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              {/* Tools Section in Mobile */}
              <div className="mx-2 mb-2">
                <div className="px-4 py-2 text-sm font-semibold text-gray-900 bg-gray-100 rounded-t-xl">
                  Tools
                </div>
                <div className="bg-white rounded-b-xl border border-gray-200 border-t-0">
                  <Link 
                    href="/compare" 
                    className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🔄 Compare Countries
                  </Link>
                  <Link 
                    href="/population-growth-rate-calculator" 
                    className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📈 Growth Rate Calculator
                  </Link>
                  <Link 
                    href="/dependency-ratio-calculator" 
                    className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    👥 Dependency Ratio
                  </Link>
                  <Link 
                    href="/generation-age-ranges-calculator" 
                    className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🎯 Generation Ages
                  </Link>
                  <Link 
                    href="/male-to-female-ratio" 
                    className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ⚖️ Gender Ratio
                  </Link>
                  <Link 
                    href="/median-age-by-country" 
                    className="block px-4 py-3 text-sm hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🌐 Median Age
                  </Link>
                </div>
              </div>
              <Link 
                href="/about" 
                className={`mx-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActivePage('/about') 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Data Source Badge in Mobile */}
              <div className="mx-2 mt-4 p-3 bg-blue-600/10 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center space-x-2 text-xs text-blue-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold">UN Verified Data Source</span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}