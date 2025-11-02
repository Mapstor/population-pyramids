'use client';

import { useState, useMemo } from 'react';

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

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: string;
  onCountryChange: (countrySlug: string) => void;
  placeholder?: string;
}

export default function CountrySelector({
  countries,
  selectedCountry,
  onCountryChange,
  placeholder = "Select a country..."
}: CountrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries;
    
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  const selectedCountryData = countries.find(c => c.slug === selectedCountry);

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country.slug);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onCountryChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Selected Country Display */}
      <div
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCountryData ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{selectedCountryData.flag}</span>
              <div>
                <div className="font-medium">{selectedCountryData.name}</div>
                <div className="text-sm text-gray-500">{selectedCountryData.region}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <div className="text-gray-400">
                {isOpen ? '▲' : '▼'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{placeholder}</span>
            <div className="text-gray-400">
              {isOpen ? '▲' : '▼'}
            </div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Countries List */}
          <div className="overflow-y-auto max-h-80">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-gray-500">
                        {country.region} • {country.population2024.toLocaleString()} people
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No countries found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}