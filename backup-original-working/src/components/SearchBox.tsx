'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Country {
  code: string;
  name: string;
  slug: string;
  region: string;
  subregion: string;
  population2024: number;
  flag: string;
  iso2: string;
  iso3: string;
}

interface SearchBoxProps {
  placeholder?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

export default function SearchBox({ 
  placeholder = "Search countries...", 
  onClose,
  autoFocus = false 
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load countries data
  useEffect(() => {
    async function fetchCountries() {
      if (countries.length > 0) return; // Only fetch once
      
      setLoading(true);
      try {
        const response = await fetch('/api/countries');
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, [countries.length]);

  // Filter countries based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCountries([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = countries
      .filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.subregion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8); // Limit results

    setFilteredCountries(filtered);
    setSelectedIndex(-1);
  }, [searchTerm, countries]);

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCountries.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCountries.length) {
          navigateToCountry(filteredCountries[selectedIndex]);
        } else if (filteredCountries.length === 1) {
          navigateToCountry(filteredCountries[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
        if (onClose) onClose();
        break;
    }
  };

  const navigateToCountry = useCallback((country: Country) => {
    router.push(`/${country.slug}`);
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onClose) onClose();
  }, [router, onClose]);

  const handleCountryClick = (country: Country) => {
    navigateToCountry(country);
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim()) {
      setIsOpen(true);
    }
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden"
          role="listbox"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading countries...
            </div>
          ) : filteredCountries.length > 0 ? (
            <div className="overflow-y-auto max-h-96">
              {filteredCountries.map((country, index) => (
                <button
                  key={country.code}
                  onClick={() => handleCountryClick(country)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {country.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {country.region} • {country.population2024.toLocaleString()} people
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchTerm.trim() ? (
            <div className="p-4 text-center text-gray-500">
              No countries found matching "{searchTerm}"
            </div>
          ) : null}

          {/* Search Tips */}
          {filteredCountries.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Use ↑↓ to navigate, Enter to select, Esc to close
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}