'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';

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

function SearchContent() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Load countries data
  useEffect(() => {
    async function fetchCountries() {
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
  }, []);

  // Get initial search term from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Filter countries based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCountries([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = countries
      .filter(country => 
        country.name.toLowerCase().includes(term) ||
        country.region.toLowerCase().includes(term) ||
        country.subregion.toLowerCase().includes(term) ||
        country.code.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        // Prioritize exact matches and name matches
        const aNameMatch = a.name.toLowerCase().startsWith(term);
        const bNameMatch = b.name.toLowerCase().startsWith(term);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        // Then sort by population (larger first)
        return b.population2024 - a.population2024;
      });

    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Loading countries...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span>Search</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Search Countries
        </h1>
        <p className="text-lg text-gray-600">
          Find population pyramids for any of the 195 countries worldwide.
        </p>
      </div>

      {/* Search Box */}
      <div className="mb-8">
        <div className="max-w-2xl">
          <SearchBox 
            placeholder="Search by country name, region, or country code..." 
            autoFocus={true}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {filteredCountries.length > 0 
              ? `${filteredCountries.length} result${filteredCountries.length !== 1 ? 's' : ''} for "${searchTerm}"`
              : `No results found for "${searchTerm}"`
            }
          </h2>

          {filteredCountries.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCountries.map((country) => (
                <Link
                  key={country.code}
                  href={`/${country.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {country.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {country.subregion}, {country.region}
                      </p>
                      <p className="text-sm text-gray-400">
                        Population: {country.population2024.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchTerm && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No countries found
                </h3>
                <p className="text-gray-500">
                  Try searching for a different country name, region, or country code.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popular Countries (when no search) */}
      {!searchTerm && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Countries
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries
              .sort((a, b) => b.population2024 - a.population2024)
              .slice(0, 12)
              .map((country) => (
                <Link
                  key={country.code}
                  href={`/${country.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {country.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {country.subregion}, {country.region}
                      </p>
                      <p className="text-sm text-gray-400">
                        Population: {country.population2024.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Browse by Region */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Browse by Region
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {['Africa', 'Asia', 'Europe', 'Americas', 'Oceania'].map((region) => {
            const regionCountries = countries.filter(c => c.region === region);
            const totalPopulation = regionCountries.reduce((sum, c) => sum + c.population2024, 0);
            
            return (
              <div
                key={region}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{region}</h3>
                <p className="text-sm text-gray-500">
                  {regionCountries.length} countries
                </p>
                <p className="text-sm text-gray-400">
                  {totalPopulation.toLocaleString()} people
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Loading search...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}