'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SideBySidePyramids from '@/components/SideBySidePyramids';
import { loadCountryData } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';

interface Country {
  slug: string;
  name: string;
  code: string;
  region: string;
  population2024: number;
}

interface ComparePageClientProps {
  countries: Country[];
}

export default function ComparePageClient({ countries }: ComparePageClientProps) {
  const [selectedCountry1, setSelectedCountry1] = useState<string>('');
  const [selectedCountry2, setSelectedCountry2] = useState<string>('');
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Filter countries based on search
  const filteredCountries1 = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm1.toLowerCase()) &&
    country.slug !== selectedCountry2
  );

  const filteredCountries2 = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm2.toLowerCase()) &&
    country.slug !== selectedCountry1
  );

  // Sort countries by population
  const sortedCountries1 = [...filteredCountries1].sort((a, b) => b.population2024 - a.population2024);
  const sortedCountries2 = [...filteredCountries2].sort((a, b) => b.population2024 - a.population2024);

  const handleCompare = async () => {
    if (selectedCountry1 && selectedCountry2) {
      setLoading(true);
      setShowComparison(false);
      setComparisonData(null);
      
      try {
        // Load data for both countries
        const [data1, data2] = await Promise.all([
          loadCountryData(selectedCountry1),
          loadCountryData(selectedCountry2)
        ]);
        
        if (data1 && data2 && data1.years && data2.years) {
          // Get 2024 data for comparison
          const year2024_1 = data1.years['2024'];
          const year2024_2 = data2.years['2024'];
          
          // Validate the data has required fields
          if (year2024_1 && year2024_2 && 
              year2024_1.ageGroups && year2024_2.ageGroups &&
              year2024_1.totalPopulation && year2024_2.totalPopulation) {
            
            const metrics1 = calculateMetrics(year2024_1);
            const metrics2 = calculateMetrics(year2024_2);
            
            setComparisonData({
              country1: countries.find(c => c.slug === selectedCountry1),
              country2: countries.find(c => c.slug === selectedCountry2),
              data1: year2024_1,
              data2: year2024_2,
              metrics1,
              metrics2,
              populationData1: data1,
              populationData2: data2
            });
            setShowComparison(true);
          } else {
            console.error('Invalid data structure for one or both countries');
            alert('Unable to load comparison data. Please try different countries.');
          }
        } else {
          console.error('Failed to load data for one or both countries');
          alert('Unable to load country data. Please try again.');
        }
      } catch (error) {
        console.error('Error loading comparison data:', error);
        alert('An error occurred while loading the comparison. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const canCompare = selectedCountry1 && selectedCountry2 && selectedCountry1 !== selectedCountry2;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create Custom Comparison
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Country 1 Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select First Country
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm1}
              onChange={(e) => setSearchTerm1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {sortedCountries1.slice(0, 20).map((country) => (
              <button
                key={country.slug}
                onClick={() => setSelectedCountry1(country.slug)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  selectedCountry1 === country.slug ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">{getCountryFlag(country.code)}</span>
                  {country.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(country.population2024 / 1000000).toFixed(0)}M
                </span>
              </button>
            ))}
          </div>

          {selectedCountry1 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                Selected: {countries.find(c => c.slug === selectedCountry1)?.name}
              </p>
            </div>
          )}
        </div>

        {/* Country 2 Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Second Country
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {sortedCountries2.slice(0, 20).map((country) => (
              <button
                key={country.slug}
                onClick={() => setSelectedCountry2(country.slug)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  selectedCountry2 === country.slug ? 'bg-purple-50 text-purple-700' : ''
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">{getCountryFlag(country.code)}</span>
                  {country.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(country.population2024 / 1000000).toFixed(0)}M
                </span>
              </button>
            ))}
          </div>

          {selectedCountry2 && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800">
                Selected: {countries.find(c => c.slug === selectedCountry2)?.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      <div className="mt-8 text-center">
        {canCompare ? (
          <button
            onClick={handleCompare}
            disabled={loading}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Loading Comparison...
              </>
            ) : (
              <>
                <span className="mr-2">📊</span>
                Compare Selected Countries
              </>
            )}
          </button>
        ) : (
          <p className="text-gray-500">
            Select two different countries to compare their demographics
          </p>
        )}
      </div>

      {/* Quick Suggestions based on selection */}
      {selectedCountry1 && !selectedCountry2 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Suggested comparisons for {countries.find(c => c.slug === selectedCountry1)?.name}:
          </p>
          <div className="flex flex-wrap gap-2">
            {getSuggestedComparisons(selectedCountry1).map((suggestion) => (
              <button
                key={suggestion.slug}
                onClick={() => setSelectedCountry2(suggestion.slug)}
                className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                vs {suggestion.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Comparison Results */}
      {showComparison && comparisonData && (
        <div className="mt-12 space-y-8">
          <div className="border-t-4 border-blue-500 pt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {comparisonData.country1.name} vs {comparisonData.country2.name}
            </h2>
            
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{getCountryFlag(comparisonData.country1.code)}</span>
                  {comparisonData.country1.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-semibold">{(comparisonData.data1.totalPopulation / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Age:</span>
                    <span className="font-semibold">{comparisonData.metrics1.medianAge.toFixed(1)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Rate:</span>
                    <span className="font-semibold">{comparisonData.metrics1.growthRate?.toFixed(2) || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sex Ratio:</span>
                    <span className="font-semibold">{comparisonData.metrics1.sexRatio.toFixed(1)} M/100F</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{getCountryFlag(comparisonData.country2.code)}</span>
                  {comparisonData.country2.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-semibold">{(comparisonData.data2.totalPopulation / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Age:</span>
                    <span className="font-semibold">{comparisonData.metrics2.medianAge.toFixed(1)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Rate:</span>
                    <span className="font-semibold">{comparisonData.metrics2.growthRate?.toFixed(2) || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sex Ratio:</span>
                    <span className="font-semibold">{comparisonData.metrics2.sexRatio.toFixed(1)} M/100F</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Population Pyramids */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Population Pyramids Comparison</h3>
              <SideBySidePyramids
                country1Data={comparisonData.data1}
                country2Data={comparisonData.data2}
                country1Name={comparisonData.country1.name}
                country2Name={comparisonData.country2.name}
                year="2024"
              />
            </div>
            
            {/* View Full Comparison Link */}
            <div className="text-center mt-8">
              <Link
                href={`/compare/${selectedCountry1}-vs-${selectedCountry2}`}
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                <span className="mr-2">📈</span>
                View Detailed Analysis
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get country flag emoji
function getCountryFlag(code: string): string {
  // Map 3-letter ISO codes to 2-letter codes
  const iso3to2: Record<string, string> = {
    'AFG': 'AF', 'ALB': 'AL', 'DZA': 'DZ', 'AND': 'AD', 'AGO': 'AO',
    'ATG': 'AG', 'ARG': 'AR', 'ARM': 'AM', 'AUS': 'AU', 'AUT': 'AT',
    'AZE': 'AZ', 'BHS': 'BS', 'BHR': 'BH', 'BGD': 'BD', 'BRB': 'BB',
    'BLR': 'BY', 'BEL': 'BE', 'BLZ': 'BZ', 'BEN': 'BJ', 'BTN': 'BT',
    'BOL': 'BO', 'BIH': 'BA', 'BWA': 'BW', 'BRA': 'BR', 'BRN': 'BN',
    'BGR': 'BG', 'BFA': 'BF', 'BDI': 'BI', 'KHM': 'KH', 'CMR': 'CM',
    'CAN': 'CA', 'CPV': 'CV', 'CAF': 'CF', 'TCD': 'TD', 'CHL': 'CL',
    'CHN': 'CN', 'COL': 'CO', 'COM': 'KM', 'COG': 'CG', 'COD': 'CD',
    'CRI': 'CR', 'CIV': 'CI', 'HRV': 'HR', 'CUB': 'CU', 'CYP': 'CY',
    'CZE': 'CZ', 'DNK': 'DK', 'DJI': 'DJ', 'DMA': 'DM', 'DOM': 'DO',
    'ECU': 'EC', 'EGY': 'EG', 'SLV': 'SV', 'GNQ': 'GQ', 'ERI': 'ER',
    'EST': 'EE', 'SWZ': 'SZ', 'ETH': 'ET', 'FJI': 'FJ', 'FIN': 'FI',
    'FRA': 'FR', 'GAB': 'GA', 'GMB': 'GM', 'GEO': 'GE', 'DEU': 'DE',
    'GHA': 'GH', 'GRC': 'GR', 'GRD': 'GD', 'GTM': 'GT', 'GIN': 'GN',
    'GNB': 'GW', 'GUY': 'GY', 'HTI': 'HT', 'HND': 'HN', 'HUN': 'HU',
    'ISL': 'IS', 'IND': 'IN', 'IDN': 'ID', 'IRN': 'IR', 'IRQ': 'IQ',
    'IRL': 'IE', 'ISR': 'IL', 'ITA': 'IT', 'JAM': 'JM', 'JPN': 'JP',
    'JOR': 'JO', 'KAZ': 'KZ', 'KEN': 'KE', 'KIR': 'KI', 'PRK': 'KP',
    'KOR': 'KR', 'KWT': 'KW', 'KGZ': 'KG', 'LAO': 'LA', 'LVA': 'LV',
    'LBN': 'LB', 'LSO': 'LS', 'LBR': 'LR', 'LBY': 'LY', 'LIE': 'LI',
    'LTU': 'LT', 'LUX': 'LU', 'MDG': 'MG', 'MWI': 'MW', 'MYS': 'MY',
    'MDV': 'MV', 'MLI': 'ML', 'MLT': 'MT', 'MHL': 'MH', 'MRT': 'MR',
    'MUS': 'MU', 'MEX': 'MX', 'FSM': 'FM', 'MDA': 'MD', 'MCO': 'MC',
    'MNG': 'MN', 'MNE': 'ME', 'MAR': 'MA', 'MOZ': 'MZ', 'MMR': 'MM',
    'NAM': 'NA', 'NRU': 'NR', 'NPL': 'NP', 'NLD': 'NL', 'NZL': 'NZ',
    'NIC': 'NI', 'NER': 'NE', 'NGA': 'NG', 'MKD': 'MK', 'NOR': 'NO',
    'OMN': 'OM', 'PAK': 'PK', 'PLW': 'PW', 'PSE': 'PS', 'PAN': 'PA',
    'PNG': 'PG', 'PRY': 'PY', 'PER': 'PE', 'PHL': 'PH', 'POL': 'PL',
    'PRT': 'PT', 'QAT': 'QA', 'ROU': 'RO', 'RUS': 'RU', 'RWA': 'RW',
    'KNA': 'KN', 'LCA': 'LC', 'VCT': 'VC', 'WSM': 'WS', 'SMR': 'SM',
    'STP': 'ST', 'SAU': 'SA', 'SEN': 'SN', 'SRB': 'RS', 'SYC': 'SC',
    'SLE': 'SL', 'SGP': 'SG', 'SVK': 'SK', 'SVN': 'SI', 'SLB': 'SB',
    'SOM': 'SO', 'ZAF': 'ZA', 'SSD': 'SS', 'ESP': 'ES', 'LKA': 'LK',
    'SDN': 'SD', 'SUR': 'SR', 'SWE': 'SE', 'CHE': 'CH', 'SYR': 'SY',
    'TWN': 'TW', 'TJK': 'TJ', 'TZA': 'TZ', 'THA': 'TH', 'TLS': 'TL',
    'TGO': 'TG', 'TON': 'TO', 'TTO': 'TT', 'TUN': 'TN', 'TUR': 'TR',
    'TKM': 'TM', 'TUV': 'TV', 'UGA': 'UG', 'UKR': 'UA', 'ARE': 'AE',
    'GBR': 'GB', 'USA': 'US', 'URY': 'UY', 'UZB': 'UZ', 'VUT': 'VU',
    'VEN': 'VE', 'VNM': 'VN', 'YEM': 'YE', 'ZMB': 'ZM', 'ZWE': 'ZW'
  };
  
  // Convert 3-letter to 2-letter if needed
  const code2 = iso3to2[code] || code;
  
  // Extended flag mapping for all countries
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'CN': '🇨🇳', 'IN': '🇮🇳', 'JP': '🇯🇵',
    'DE': '🇩🇪', 'GB': '🇬🇧', 'FR': '🇫🇷', 'BR': '🇧🇷',
    'NG': '🇳🇬', 'ET': '🇪🇹', 'IT': '🇮🇹', 'ES': '🇪🇸',
    'CA': '🇨🇦', 'AU': '🇦🇺', 'MX': '🇲🇽', 'ID': '🇮🇩',
    'PH': '🇵🇭', 'EG': '🇪🇬', 'KE': '🇰🇪', 'ZA': '🇿🇦',
    'RU': '🇷🇺', 'PK': '🇵🇰', 'BD': '🇧🇩', 'KR': '🇰🇷',
    'TR': '🇹🇷', 'TH': '🇹🇭', 'VN': '🇻🇳', 'IR': '🇮🇷',
    'CD': '🇨🇩', 'TZ': '🇹🇿', 'MM': '🇲🇲', 'UG': '🇺🇬',
    'UA': '🇺🇦', 'AR': '🇦🇷', 'DZ': '🇩🇿', 'PL': '🇵🇱',
    'SD': '🇸🇩', 'IQ': '🇮🇶', 'AF': '🇦🇫', 'MA': '🇲🇦',
    'SA': '🇸🇦', 'UZ': '🇺🇿', 'MY': '🇲🇾', 'PE': '🇵🇪',
    'AO': '🇦🇴', 'MZ': '🇲🇿', 'GH': '🇬🇭', 'YE': '🇾🇪',
    'NP': '🇳🇵', 'VE': '🇻🇪', 'MG': '🇲🇬', 'CM': '🇨🇲',
    'CI': '🇨🇮', 'KP': '🇰🇵', 'NE': '🇳🇪', 'LK': '🇱🇰',
    'BF': '🇧🇫', 'ML': '🇲🇱', 'RO': '🇷🇴', 'MW': '🇲🇼',
    'CL': '🇨🇱', 'KZ': '🇰🇿', 'ZM': '🇿🇲', 'EC': '🇪🇨',
    'SY': '🇸🇾', 'NL': '🇳🇱', 'SN': '🇸🇳', 'GT': '🇬🇹',
    'TD': '🇹🇩', 'SO': '🇸🇴', 'ZW': '🇿🇼', 'GN': '🇬🇳',
    'RW': '🇷🇼', 'BJ': '🇧🇯', 'TN': '🇹🇳', 'BO': '🇧🇴',
    'BE': '🇧🇪', 'HT': '🇭🇹', 'CU': '🇨🇺', 'SS': '🇸🇸',
    'BI': '🇧🇮', 'DO': '🇩🇴', 'CZ': '🇨🇿', 'GR': '🇬🇷',
    'JO': '🇯🇴', 'PT': '🇵🇹', 'AZ': '🇦🇿', 'SE': '🇸🇪',
    'HU': '🇭🇺', 'BY': '🇧🇾', 'TJ': '🇹🇯', 'IL': '🇮🇱',
    'HN': '🇭🇳', 'AE': '🇦🇪', 'AT': '🇦🇹', 'PG': '🇵🇬',
    'TG': '🇹🇬', 'CH': '🇨🇭', 'SL': '🇸🇱', 'HK': '🇭🇰',
    'LA': '🇱🇦', 'PY': '🇵🇾', 'LY': '🇱🇾', 'BG': '🇧🇬',
    'LB': '🇱🇧', 'NI': '🇳🇮', 'KG': '🇰🇬', 'SV': '🇸🇻',
    'TM': '🇹🇲', 'SG': '🇸🇬', 'DK': '🇩🇰', 'FI': '🇫🇮',
    'CF': '🇨🇫', 'CG': '🇨🇬', 'SK': '🇸🇰', 'NO': '🇳🇴',
    'OM': '🇴🇲', 'PS': '🇵🇸', 'CR': '🇨🇷', 'LR': '🇱🇷',
    'NZ': '🇳🇿', 'IE': '🇮🇪', 'MR': '🇲🇷', 'PA': '🇵🇦',
    'KW': '🇰🇼', 'HR': '🇭🇷', 'MD': '🇲🇩', 'GE': '🇬🇪',
    'ER': '🇪🇷', 'UY': '🇺🇾', 'BA': '🇧🇦', 'MN': '🇲🇳',
    'AM': '🇦🇲', 'PR': '🇵🇷', 'AL': '🇦🇱', 'JM': '🇯🇲',
    'LT': '🇱🇹', 'QA': '🇶🇦', 'NA': '🇳🇦', 'GM': '🇬🇲',
    'BW': '🇧🇼', 'GA': '🇬🇦', 'LS': '🇱🇸', 'SI': '🇸🇮',
    'GW': '🇬🇼', 'LV': '🇱🇻', 'BH': '🇧🇭', 'MK': '🇲🇰',
    'GQ': '🇬🇶', 'TT': '🇹🇹', 'SZ': '🇸🇿', 'TL': '🇹🇱',
    'EE': '🇪🇪', 'MU': '🇲🇺', 'CY': '🇨🇾', 'DJ': '🇩🇯',
    'RE': '🇷🇪', 'FJ': '🇫🇯', 'KM': '🇰🇲', 'GY': '🇬🇾',
    'BT': '🇧🇹', 'SB': '🇸🇧', 'ME': '🇲🇪', 'LU': '🇱🇺',
    'SR': '🇸🇷', 'CV': '🇨🇻', 'MO': '🇲🇴', 'MT': '🇲🇹',
    'BN': '🇧🇳', 'BS': '🇧🇸', 'IS': '🇮🇸', 'MV': '🇲🇻',
    'BZ': '🇧🇿', 'BB': '🇧🇧', 'PF': '🇵🇫', 'NC': '🇳🇨',
    'VU': '🇻🇺', 'GF': '🇬🇫', 'ST': '🇸🇹', 'WS': '🇼🇸',
    'LC': '🇱🇨', 'GU': '🇬🇺', 'CW': '🇨🇼', 'KI': '🇰🇮',
    'GD': '🇬🇩', 'FM': '🇫🇲', 'VC': '🇻🇨', 'TO': '🇹🇴',
    'VI': '🇻🇮', 'AW': '🇦🇼', 'SC': '🇸🇨', 'AG': '🇦🇬',
    'IM': '🇮🇲', 'AD': '🇦🇩', 'DM': '🇩🇲', 'BM': '🇧🇲',
    'KY': '🇰🇾', 'MH': '🇲🇭', 'AS': '🇦🇸', 'MP': '🇲🇵',
    'GL': '🇬🇱', 'KN': '🇰🇳', 'FO': '🇫🇴', 'SX': '🇸🇽',
    'MC': '🇲🇨', 'LI': '🇱🇮', 'SM': '🇸🇲', 'GI': '🇬🇮',
    'TC': '🇹🇨', 'VG': '🇻🇬', 'PW': '🇵🇼', 'CK': '🇨🇰',
    'AI': '🇦🇮', 'TV': '🇹🇻', 'NR': '🇳🇷', 'MF': '🇲🇫',
    'NU': '🇳🇺', 'TK': '🇹🇰', 'VA': '🇻🇦', 'BL': '🇧🇱',
    'FK': '🇫🇰', 'PM': '🇵🇲', 'SH': '🇸🇭', 'WF': '🇼🇫',
    'PG': '🇵🇬', 'RS': '🇷🇸', 'XK': '🇽🇰', 'AQ': '🇦🇶',
    'TW': '🇹🇼'
  };
  return flags[code2] || '🌐';
}

// Helper function to get suggested comparisons
function getSuggestedComparisons(countrySlug: string): Array<{slug: string, name: string}> {
  const suggestions: Record<string, Array<{slug: string, name: string}>> = {
    'united-states': [
      { slug: 'china', name: 'China' },
      { slug: 'india', name: 'India' },
      { slug: 'mexico', name: 'Mexico' },
      { slug: 'canada', name: 'Canada' }
    ],
    'china': [
      { slug: 'india', name: 'India' },
      { slug: 'united-states', name: 'United States' },
      { slug: 'japan', name: 'Japan' },
      { slug: 'russia', name: 'Russia' }
    ],
    'india': [
      { slug: 'china', name: 'China' },
      { slug: 'pakistan', name: 'Pakistan' },
      { slug: 'bangladesh', name: 'Bangladesh' },
      { slug: 'united-states', name: 'United States' }
    ],
    'japan': [
      { slug: 'germany', name: 'Germany' },
      { slug: 'south-korea', name: 'South Korea' },
      { slug: 'china', name: 'China' },
      { slug: 'united-states', name: 'United States' }
    ],
    'germany': [
      { slug: 'france', name: 'France' },
      { slug: 'united-kingdom', name: 'United Kingdom' },
      { slug: 'japan', name: 'Japan' },
      { slug: 'italy', name: 'Italy' }
    ],
    'brazil': [
      { slug: 'mexico', name: 'Mexico' },
      { slug: 'argentina', name: 'Argentina' },
      { slug: 'united-states', name: 'United States' },
      { slug: 'india', name: 'India' }
    ]
  };

  return suggestions[countrySlug] || [
    { slug: 'united-states', name: 'United States' },
    { slug: 'china', name: 'China' },
    { slug: 'india', name: 'India' },
    { slug: 'japan', name: 'Japan' }
  ];
}