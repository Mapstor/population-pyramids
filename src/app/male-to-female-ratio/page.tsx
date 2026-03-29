'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import countries from '@/data/countries.json';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';

// Country flag mapping
const flags: Record<string, string> = {
  'AF': '🇦🇫', 'AL': '🇦🇱', 'DZ': '🇩🇿', 'AD': '🇦🇩', 'AO': '🇦🇴', 'AG': '🇦🇬', 'AR': '🇦🇷', 'AM': '🇦🇲',
  'AU': '🇦🇺', 'AT': '🇦🇹', 'AZ': '🇦🇿', 'BS': '🇧🇸', 'BH': '🇧🇭', 'BD': '🇧🇩', 'BB': '🇧🇧', 'BY': '🇧🇾',
  'BE': '🇧🇪', 'BZ': '🇧🇿', 'BJ': '🇧🇯', 'BT': '🇧🇹', 'BO': '🇧🇴', 'BA': '🇧🇦', 'BW': '🇧🇼', 'BR': '🇧🇷',
  'BN': '🇧🇳', 'BG': '🇧🇬', 'BF': '🇧🇫', 'BI': '🇧🇮', 'CV': '🇨🇻', 'KH': '🇰🇭', 'CM': '🇨🇲', 'CA': '🇨🇦',
  'CF': '🇨🇫', 'TD': '🇹🇩', 'CL': '🇨🇱', 'CN': '🇨🇳', 'CO': '🇨🇴', 'KM': '🇰🇲', 'CG': '🇨🇬', 'CD': '🇨🇩',
  'CR': '🇨🇷', 'CI': '🇨🇮', 'HR': '🇭🇷', 'CU': '🇨🇺', 'CY': '🇨🇾', 'CZ': '🇨🇿', 'DK': '🇩🇰', 'DJ': '🇩🇯',
  'DM': '🇩🇲', 'DO': '🇩🇴', 'EC': '🇪🇨', 'EG': '🇪🇬', 'SV': '🇸🇻', 'GQ': '🇬🇶', 'ER': '🇪🇷', 'EE': '🇪🇪',
  'SZ': '🇸🇿', 'ET': '🇪🇹', 'FJ': '🇫🇯', 'FI': '🇫🇮', 'FR': '🇫🇷', 'GA': '🇬🇦', 'GM': '🇬🇲', 'GE': '🇬🇪',
  'DE': '🇩🇪', 'GH': '🇬🇭', 'GR': '🇬🇷', 'GD': '🇬🇩', 'GT': '🇬🇹', 'GN': '🇬🇳', 'GW': '🇬🇼', 'GY': '🇬🇾',
  'HT': '🇭🇹', 'HN': '🇭🇳', 'HU': '🇭🇺', 'IS': '🇮🇸', 'IN': '🇮🇳', 'ID': '🇮🇩', 'IR': '🇮🇷', 'IQ': '🇮🇶',
  'IE': '🇮🇪', 'IL': '🇮🇱', 'IT': '🇮🇹', 'JM': '🇯🇲', 'JP': '🇯🇵', 'JO': '🇯🇴', 'KZ': '🇰🇿', 'KE': '🇰🇪',
  'KI': '🇰🇮', 'KP': '🇰🇵', 'KR': '🇰🇷', 'KW': '🇰🇼', 'KG': '🇰🇬', 'LA': '🇱🇦', 'LV': '🇱🇻', 'LB': '🇱🇧',
  'LS': '🇱🇸', 'LR': '🇱🇷', 'LY': '🇱🇾', 'LI': '🇱🇮', 'LT': '🇱🇹', 'LU': '🇱🇺', 'MG': '🇲🇬', 'MW': '🇲🇼',
  'MY': '🇲🇾', 'MV': '🇲🇻', 'ML': '🇲🇱', 'MT': '🇲🇹', 'MH': '🇲🇭', 'MR': '🇲🇷', 'MU': '🇲🇺', 'MX': '🇲🇽',
  'FM': '🇫🇲', 'MD': '🇲🇩', 'MC': '🇲🇨', 'MN': '🇲🇳', 'ME': '🇲🇪', 'MA': '🇲🇦', 'MZ': '🇲🇿', 'MM': '🇲🇲',
  'NA': '🇳🇦', 'NR': '🇳🇷', 'NP': '🇳🇵', 'NL': '🇳🇱', 'NZ': '🇳🇿', 'NI': '🇳🇮', 'NE': '🇳🇪', 'NG': '🇳🇬',
  'MK': '🇲🇰', 'NO': '🇳🇴', 'OM': '🇴🇲', 'PK': '🇵🇰', 'PW': '🇵🇼', 'PS': '🇵🇸', 'PA': '🇵🇦', 'PG': '🇵🇬',
  'PY': '🇵🇾', 'PE': '🇵🇪', 'PH': '🇵🇭', 'PL': '🇵🇱', 'PT': '🇵🇹', 'QA': '🇶🇦', 'RO': '🇷🇴', 'RU': '🇷🇺',
  'RW': '🇷🇼', 'KN': '🇰🇳', 'LC': '🇱🇨', 'VC': '🇻🇨', 'WS': '🇼🇸', 'SM': '🇸🇲', 'ST': '🇸🇹', 'SA': '🇸🇦',
  'SN': '🇸🇳', 'RS': '🇷🇸', 'SC': '🇸🇨', 'SL': '🇸🇱', 'SG': '🇸🇬', 'SK': '🇸🇰', 'SI': '🇸🇮', 'SB': '🇸🇧',
  'SO': '🇸🇴', 'ZA': '🇿🇦', 'SS': '🇸🇸', 'ES': '🇪🇸', 'LK': '🇱🇰', 'SD': '🇸🇩', 'SR': '🇸🇷', 'SE': '🇸🇪',
  'CH': '🇨🇭', 'SY': '🇸🇾', 'TW': '🇹🇼', 'TJ': '🇹🇯', 'TZ': '🇹🇿', 'TH': '🇹🇭', 'TL': '🇹🇱', 'TG': '🇹🇬',
  'TO': '🇹🇴', 'TT': '🇹🇹', 'TN': '🇹🇳', 'TR': '🇹🇷', 'TM': '🇹🇲', 'TV': '🇹🇻', 'UG': '🇺🇬', 'UA': '🇺🇦',
  'AE': '🇦🇪', 'GB': '🇬🇧', 'US': '🇺🇸', 'UY': '🇺🇾', 'UZ': '🇺🇿', 'VU': '🇻🇺', 'VA': '🇻🇦', 'VE': '🇻🇪',
  'VN': '🇻🇳', 'YE': '🇾🇪', 'ZM': '🇿🇲', 'ZW': '🇿🇼'
};

// ISO3 to ISO2 mapping
const iso3to2: Record<string, string> = {
  'AFG': 'AF', 'ALB': 'AL', 'DZA': 'DZ', 'AND': 'AD', 'AGO': 'AO', 'ATG': 'AG', 'ARG': 'AR', 'ARM': 'AM',
  'AUS': 'AU', 'AUT': 'AT', 'AZE': 'AZ', 'BHS': 'BS', 'BHR': 'BH', 'BGD': 'BD', 'BRB': 'BB', 'BLR': 'BY',
  'BEL': 'BE', 'BLZ': 'BZ', 'BEN': 'BJ', 'BTN': 'BT', 'BOL': 'BO', 'BIH': 'BA', 'BWA': 'BW', 'BRA': 'BR',
  'BRN': 'BN', 'BGR': 'BG', 'BFA': 'BF', 'BDI': 'BI', 'CPV': 'CV', 'KHM': 'KH', 'CMR': 'CM', 'CAN': 'CA',
  'CAF': 'CF', 'TCD': 'TD', 'CHL': 'CL', 'CHN': 'CN', 'COL': 'CO', 'COM': 'KM', 'COG': 'CG', 'COD': 'CD',
  'CRI': 'CR', 'CIV': 'CI', 'HRV': 'HR', 'CUB': 'CU', 'CYP': 'CY', 'CZE': 'CZ', 'DNK': 'DK', 'DJI': 'DJ',
  'DMA': 'DM', 'DOM': 'DO', 'ECU': 'EC', 'EGY': 'EG', 'SLV': 'SV', 'GNQ': 'GQ', 'ERI': 'ER', 'EST': 'EE',
  'SWZ': 'SZ', 'ETH': 'ET', 'FJI': 'FJ', 'FIN': 'FI', 'FRA': 'FR', 'GAB': 'GA', 'GMB': 'GM', 'GEO': 'GE',
  'DEU': 'DE', 'GHA': 'GH', 'GRC': 'GR', 'GRD': 'GD', 'GTM': 'GT', 'GIN': 'GN', 'GNB': 'GW', 'GUY': 'GY',
  'HTI': 'HT', 'HND': 'HN', 'HUN': 'HU', 'ISL': 'IS', 'IND': 'IN', 'IDN': 'ID', 'IRN': 'IR', 'IRQ': 'IQ',
  'IRL': 'IE', 'ISR': 'IL', 'ITA': 'IT', 'JAM': 'JM', 'JPN': 'JP', 'JOR': 'JO', 'KAZ': 'KZ', 'KEN': 'KE',
  'KIR': 'KI', 'PRK': 'KP', 'KOR': 'KR', 'KWT': 'KW', 'KGZ': 'KG', 'LAO': 'LA', 'LVA': 'LV', 'LBN': 'LB',
  'LSO': 'LS', 'LBR': 'LR', 'LBY': 'LY', 'LIE': 'LI', 'LTU': 'LT', 'LUX': 'LU', 'MDG': 'MG', 'MWI': 'MW',
  'MYS': 'MY', 'MDV': 'MV', 'MLI': 'ML', 'MLT': 'MT', 'MHL': 'MH', 'MRT': 'MR', 'MUS': 'MU', 'MEX': 'MX',
  'FSM': 'FM', 'MDA': 'MD', 'MCO': 'MC', 'MNG': 'MN', 'MNE': 'ME', 'MAR': 'MA', 'MOZ': 'MZ', 'MMR': 'MM',
  'NAM': 'NA', 'NRU': 'NR', 'NPL': 'NP', 'NLD': 'NL', 'NZL': 'NZ', 'NIC': 'NI', 'NER': 'NE', 'NGA': 'NG',
  'MKD': 'MK', 'NOR': 'NO', 'OMN': 'OM', 'PAK': 'PK', 'PLW': 'PW', 'PSE': 'PS', 'PAN': 'PA', 'PNG': 'PG',
  'PRY': 'PY', 'PER': 'PE', 'PHL': 'PH', 'POL': 'PL', 'PRT': 'PT', 'QAT': 'QA', 'ROU': 'RO', 'RUS': 'RU',
  'RWA': 'RW', 'KNA': 'KN', 'LCA': 'LC', 'VCT': 'VC', 'WSM': 'WS', 'SMR': 'SM', 'STP': 'ST', 'SAU': 'SA',
  'SEN': 'SN', 'SRB': 'RS', 'SYC': 'SC', 'SLE': 'SL', 'SGP': 'SG', 'SVK': 'SK', 'SVN': 'SI', 'SLB': 'SB',
  'SOM': 'SO', 'ZAF': 'ZA', 'SSD': 'SS', 'ESP': 'ES', 'LKA': 'LK', 'SDN': 'SD', 'SUR': 'SR', 'SWE': 'SE',
  'CHE': 'CH', 'SYR': 'SY', 'TWN': 'TW', 'TJK': 'TJ', 'TZA': 'TZ', 'THA': 'TH', 'TLS': 'TL', 'TGO': 'TG',
  'TON': 'TO', 'TTO': 'TT', 'TUN': 'TN', 'TUR': 'TR', 'TKM': 'TM', 'TUV': 'TV', 'UGA': 'UG', 'UKR': 'UA',
  'ARE': 'AE', 'GBR': 'GB', 'USA': 'US', 'URY': 'UY', 'UZB': 'UZ', 'VUT': 'VU', 'VAT': 'VA', 'VEN': 'VE',
  'VNM': 'VN', 'YEM': 'YE', 'ZMB': 'ZM', 'ZWE': 'ZW'
};

function getCountryFlag(code: string): string {
  const code2 = iso3to2[code] || code;
  return flags[code2] || '🌐';
}

interface CountryData {
  slug: string;
  name: string;
  code: string;
  male: number;
  female: number;
  total: number;
  ratio: number;
  malePercent: number;
  femalePercent: number;
  atBirthRatio: number;
  elderlyRatio: number;
  workingAgeRatio: number;
  region: string;
}

interface AgeGroupData {
  ageRange: string;
  male: number;
  female: number;
  total: number;
}

function MaleToFemaleRatioContent() {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [compareCountry, setCompareCountry] = useState<string>('');
  const [ageFilter, setAgeFilter] = useState<'all' | 'birth' | 'working' | 'elderly'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CountryData; direction: 'asc' | 'desc' }>({ 
    key: 'ratio', 
    direction: 'desc' 
  });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Calculate gender ratios from population data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/gender-ratios');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        
        // Combine world and countries data
        const allData = [data.world, ...data.countries];
        setCountryData(allData);
      } catch (error) {
        console.error('Error loading gender ratio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const country = searchParams.get('country');
    const compare = searchParams.get('compare');
    const age = searchParams.get('age');

    if (country) setSelectedCountry(country);
    if (compare) {
      const [country1, country2] = compare.split(',');
      if (country1) setSelectedCountry(country1);
      if (country2) setCompareCountry(country2);
    }
    if (age === 'birth') setAgeFilter('birth');
    else if (age === 'working') setAgeFilter('working');
    else if (age === 'elderly') setAgeFilter('elderly');
  }, [searchParams]);

  // Get selected country data
  const selectedData = useMemo(() => {
    return countryData.find(c => c.slug === selectedCountry) || countryData[0];
  }, [countryData, selectedCountry]);

  const compareData = useMemo(() => {
    return compareCountry ? countryData.find(c => c.slug === compareCountry) : null;
  }, [countryData, compareCountry]);

  // Get ratio based on age filter
  const getRatio = (data: CountryData) => {
    switch (ageFilter) {
      case 'birth': return data.atBirthRatio;
      case 'working': return data.workingAgeRatio;
      case 'elderly': return data.elderlyRatio;
      default: return data.ratio;
    }
  };

  // Filter and sort table data
  const filteredAndSortedData = useMemo(() => {
    let filtered = countryData.filter(c => c.slug !== 'world');
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter(c => c.region === regionFilter);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortConfig.direction === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return filtered;
  }, [countryData, searchTerm, regionFilter, sortConfig]);

  const handleSort = (key: keyof CountryData) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = new Set(countryData.map(c => c.region));
    return Array.from(uniqueRegions).sort();
  }, [countryData]);

  // Get global rank
  const getGlobalRank = (data: CountryData) => {
    const sorted = [...countryData.filter(c => c.slug !== 'world')].sort((a, b) => b.ratio - a.ratio);
    return sorted.findIndex(c => c.slug === data.slug) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gender ratio data...</p>
        </div>
      </div>
    );
  }

  const worldData = countryData[0];

  // Generate structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the male to female ratio in the world?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The global male to female ratio is approximately ${worldData?.ratio.toFixed(1)} males per 100 females, with ${(worldData?.male / 1000000000).toFixed(1)} billion males and ${(worldData?.female / 1000000000).toFixed(1)} billion females worldwide. Males slightly outnumber females overall because more boys are born than girls, though women outnumber men in older age groups.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the ratio of men to women globally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Globally, there are roughly ${worldData?.ratio.toFixed(1)} men for every 100 women, making the population approximately ${worldData?.malePercent.toFixed(1)}% male and ${worldData?.femalePercent.toFixed(1)}% female.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the human sex ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The human sex ratio at birth is naturally about 105 males per 100 females. Over a lifetime this evens out because males have higher mortality at every age. By age 65+, women outnumber men in nearly every country.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the sex ratio at birth?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The natural human sex ratio at birth is approximately 105 boys per 100 girls. Some countries show ratios above 110 due to sex-selective practices, while others are near the natural rate.`
        }
      },
      {
        "@type": "Question",
        "name": "What country has the highest male to female ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${filteredAndSortedData[0]?.name} has the highest male to female ratio at ${filteredAndSortedData[0]?.ratio.toFixed(1)} per 100.`
        }
      }
    ]
  };

  // Dataset structured data
  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Global Male to Female Ratio Data 2026",
    "description": "Gender ratio statistics for all countries from UN World Population Prospects",
    "creator": {
      "@type": "Organization",
      "name": "United Nations",
      "url": "https://population.un.org/"
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "application/json",
      "contentUrl": "https://populationpyramids.org/api/gender-ratios"
    },
    "temporalCoverage": "1950/2025",
    "spatialCoverage": {
      "@type": "Place",
      "name": "World"
    },
    "license": "https://creativecommons.org/licenses/by/4.0/"
  };

  // WebApplication structured data
  const webAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Gender Ratio Calculator",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Interactive tool to explore and compare male to female ratios by country and age group"
  };

  // BreadcrumbList structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://populationpyramids.org/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Male to Female Ratio",
        "item": "https://populationpyramids.org/male-to-female-ratio"
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Script
        id="dataset-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData) }}
      />
      <Script
        id="webapp-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Male to Female Ratio by Country 2026: World Gender Ratio Map & Data
          </h1>

          {/* Interactive Tool */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Gender Ratio Lookup & Comparison</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="world">🌍 World</option>
                  {countries.map(country => (
                    <option key={country.slug} value={country.slug}>
                      {getCountryFlag(country.code)} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare with (optional)
                </label>
                <select
                  value={compareCountry}
                  onChange={(e) => setCompareCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {countries.map(country => (
                    <option key={country.slug} value={country.slug}>
                      {getCountryFlag(country.code)} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age Group Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setAgeFilter('all')}
                className={`px-4 py-2 rounded-full ${
                  ageFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Ages
              </button>
              <button
                onClick={() => setAgeFilter('birth')}
                className={`px-4 py-2 rounded-full ${
                  ageFilter === 'birth' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                At Birth (0-4)
              </button>
              <button
                onClick={() => setAgeFilter('working')}
                className={`px-4 py-2 rounded-full ${
                  ageFilter === 'working' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Working Age (15-64)
              </button>
              <button
                onClick={() => setAgeFilter('elderly')}
                className={`px-4 py-2 rounded-full ${
                  ageFilter === 'elderly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Elderly (65+)
              </button>
            </div>

            {/* Results */}
            {selectedData && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Primary Country */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      {selectedData.slug === 'world' ? '🌍' : getCountryFlag(selectedData.code)} 
                      {selectedData.name}
                      {selectedData.slug !== 'world' && (
                        <span className="text-sm text-gray-500">
                          (Rank #{getGlobalRank(selectedData)} of {countryData.length - 1})
                        </span>
                      )}
                    </h3>
                    
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {getRatio(selectedData).toFixed(1)}
                    </div>
                    <div className="text-gray-600 mb-4">males per 100 females</div>
                    
                    <div className="space-y-2 text-sm">
                      <div>Male population: {selectedData.male.toLocaleString()}</div>
                      <div>Female population: {selectedData.female.toLocaleString()}</div>
                      <div>
                        Difference: {Math.abs(selectedData.male - selectedData.female).toLocaleString()} more {selectedData.male > selectedData.female ? 'males' : 'females'}
                      </div>
                    </div>
                    
                    {/* Visual Bar */}
                    <div className="mt-4">
                      <div className="flex h-8 rounded-lg overflow-hidden">
                        <div 
                          className="bg-blue-500 flex items-center justify-center text-white text-sm"
                          style={{ width: `${selectedData.malePercent}%` }}
                        >
                          {selectedData.malePercent.toFixed(1)}%
                        </div>
                        <div 
                          className="bg-pink-500 flex items-center justify-center text-white text-sm"
                          style={{ width: `${selectedData.femalePercent}%` }}
                        >
                          {selectedData.femalePercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Age-specific breakdown */}
                    <div className="mt-4 space-y-2">
                      <div className="text-xs text-gray-600">Age Group Breakdown:</div>
                      <div className="flex items-center justify-between text-sm">
                        <span>At Birth (0-4):</span>
                        <span className="font-semibold">{selectedData.atBirthRatio.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Working Age (15-64):</span>
                        <span className="font-semibold">{selectedData.workingAgeRatio.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Elderly (65+):</span>
                        <span className="font-semibold">{selectedData.elderlyRatio.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compare Country */}
                  {compareData && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        {getCountryFlag(compareData.code)} {compareData.name}
                        <span className="text-sm text-gray-500">
                          (Rank #{getGlobalRank(compareData)} of {countryData.length - 1})
                        </span>
                      </h3>
                      
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {getRatio(compareData).toFixed(1)}
                      </div>
                      <div className="text-gray-600 mb-4">males per 100 females</div>
                      
                      <div className="space-y-2 text-sm">
                        <div>Male population: {compareData.male.toLocaleString()}</div>
                        <div>Female population: {compareData.female.toLocaleString()}</div>
                        <div>
                          Difference: {Math.abs(compareData.male - compareData.female).toLocaleString()} more {compareData.male > compareData.female ? 'males' : 'females'}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex h-8 rounded-lg overflow-hidden">
                          <div 
                            className="bg-blue-500 flex items-center justify-center text-white text-sm"
                            style={{ width: `${compareData.malePercent}%` }}
                          >
                            {compareData.malePercent.toFixed(1)}%
                          </div>
                          <div 
                            className="bg-pink-500 flex items-center justify-center text-white text-sm"
                            style={{ width: `${compareData.femalePercent}%` }}
                          >
                            {compareData.femalePercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="text-xs text-gray-600">Age Group Breakdown:</div>
                        <div className="flex items-center justify-between text-sm">
                          <span>At Birth (0-4):</span>
                          <span className="font-semibold">{compareData.atBirthRatio.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Working Age (15-64):</span>
                          <span className="font-semibold">{compareData.workingAgeRatio.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Elderly (65+):</span>
                          <span className="font-semibold">{compareData.elderlyRatio.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>


          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Gender Ratio Rankings by Country</h2>
            
            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Country {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('ratio')}
                    >
                      Sex Ratio {sortConfig.key === 'ratio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('male')}
                    >
                      Male Pop {sortConfig.key === 'male' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('female')}
                    >
                      Female Pop {sortConfig.key === 'female' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('malePercent')}
                    >
                      Male % {sortConfig.key === 'malePercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('atBirthRatio')}
                    >
                      At Birth {sortConfig.key === 'atBirthRatio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('elderlyRatio')}
                    >
                      Elderly {sortConfig.key === 'elderlyRatio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.slice(0, 50).map((country, index) => (
                    <tr 
                      key={country.slug}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCountry(country.slug)}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">
                        {getCountryFlag(country.code)} <Link href={`/${country.slug}`} className="hover:text-blue-600">{country.name}</Link>
                      </td>
                      <td className={`px-4 py-2 text-right font-semibold ${
                        country.ratio > 103 ? 'text-blue-600' : 
                        country.ratio < 97 ? 'text-pink-600' : 
                        'text-gray-900'
                      }`}>
                        {country.ratio.toFixed(1)}
                      </td>
                      <td className="px-4 py-2 text-right">{country.male.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">{country.female.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">{country.malePercent.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right">{country.atBirthRatio.toFixed(1)}</td>
                      <td className="px-4 py-2 text-right">{country.elderlyRatio.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Global Male to Female Ratio</h2>
            <p>
              The global male to female ratio is {worldData?.ratio.toFixed(1)} males for every 100 females, with a total of {(worldData?.male / 1000000000).toFixed(1)} billion males and {(worldData?.female / 1000000000).toFixed(1)} billion females in the world as of 2026. 
              This makes the global population approximately {worldData?.malePercent.toFixed(1)}% male and {worldData?.femalePercent.toFixed(1)}% female. 
              Males slightly outnumber females overall because more boys are born than girls (about 105 boys per 100 girls), though women significantly outnumber men in older age groups due to longer life expectancy.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Countries with the Highest Male to Female Ratio</h2>
            <p>
              The countries with the most extreme male-to-female imbalances are predominantly Gulf states where male migrant workers vastly outnumber the female population. 
              {filteredAndSortedData[0]?.name} leads with {filteredAndSortedData[0]?.ratio.toFixed(1)} males per 100 females, followed by {filteredAndSortedData[1]?.name} ({filteredAndSortedData[1]?.ratio.toFixed(1)}) and {filteredAndSortedData[2]?.name} ({filteredAndSortedData[2]?.ratio.toFixed(1)}). 
              These ratios are driven by economic migration rather than natural demographic factors.
            </p>
            <p>
              Other countries in the top 10 include <Link href={`/${filteredAndSortedData[3]?.slug}`} className="text-blue-600 hover:underline">{filteredAndSortedData[3]?.name}</Link> ({filteredAndSortedData[3]?.ratio.toFixed(1)}), <Link href={`/${filteredAndSortedData[4]?.slug}`} className="text-blue-600 hover:underline">{filteredAndSortedData[4]?.name}</Link> ({filteredAndSortedData[4]?.ratio.toFixed(1)}), and <Link href={`/${filteredAndSortedData[5]?.slug}`} className="text-blue-600 hover:underline">{filteredAndSortedData[5]?.name}</Link> ({filteredAndSortedData[5]?.ratio.toFixed(1)}).
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Countries with the Most Women Per Capita</h2>
            {(() => {
              const femaleHeavy = [...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio).slice(0, 10);
              return (
                <>
                  <p>
                    Eastern European countries dominate the list of nations where women significantly outnumber men. 
                    {femaleHeavy[0]?.name} has the lowest male-to-female ratio at {femaleHeavy[0]?.ratio.toFixed(1)} males per 100 females, meaning {femaleHeavy[0]?.femalePercent.toFixed(1)}% of the population is female. 
                    This imbalance reflects higher male mortality rates and historical impacts from World War II.
                  </p>
                  <p>
                    Other female-majority countries include <Link href={`/${femaleHeavy[1]?.slug}`} className="text-blue-600 hover:underline">{femaleHeavy[1]?.name}</Link> ({femaleHeavy[1]?.ratio.toFixed(1)}), <Link href={`/${femaleHeavy[2]?.slug}`} className="text-blue-600 hover:underline">{femaleHeavy[2]?.name}</Link> ({femaleHeavy[2]?.ratio.toFixed(1)}), and <Link href={`/${femaleHeavy[3]?.slug}`} className="text-blue-600 hover:underline">{femaleHeavy[3]?.name}</Link> ({femaleHeavy[3]?.ratio.toFixed(1)}). 
                    Male life expectancy gaps and emigration of working-age men contribute to these disparities.
                  </p>
                </>
              );
            })()}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Sex Ratio at Birth: Why More Boys Are Born</h2>
            <p>
              The natural sex ratio at birth is approximately 105 boys per 100 girls worldwide. 
              Our data shows a global average of {worldData?.atBirthRatio.toFixed(1)} males per 100 females in the 0-4 age group, which serves as a proxy for birth ratios. 
              This biological constant compensates for higher male mortality rates throughout life.
            </p>
            <p>
              Some countries show significantly higher ratios, potentially indicating sex-selective practices. 
              Countries with the most natural sex ratios at birth include those closest to the biological norm of 105. 
              Evolutionary biologists believe this slight male surplus at birth evolved to balance the population by reproductive age, as males face higher mortality risks at every life stage. Explore <Link href="/generation-age-ranges-calculator" className="text-blue-600 hover:underline">generation demographics</Link> to see how this affects different age cohorts.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Why Women Outnumber Men in Older Age Groups</h2>
            <p>
              The sex ratio shifts dramatically with age: while there are {worldData?.atBirthRatio.toFixed(1)} males per 100 females at birth globally, this drops to {worldData?.workingAgeRatio.toFixed(1)} among working-age adults (15-64) and just {worldData?.elderlyRatio.toFixed(1)} among those 65 and older. 
              Women's longer life expectancy creates this reversal. 
              By retirement age, women significantly outnumber men in nearly every country.
            </p>
            {(() => {
              const russiaData = countryData.find(c => c.slug === 'russia');
              return russiaData ? (
                <p>
                  <Link href="/russia" className="text-blue-600 hover:underline">Russia</Link> exemplifies this pattern with one of the world's most extreme elderly gender gaps at {russiaData.elderlyRatio.toFixed(1)} males per 100 females among those 65+. 
                  The male life expectancy crisis in Russia, driven by cardiovascular disease and lifestyle factors, creates a 10-year life expectancy gap between men and women. 
                  Similar patterns appear across Eastern Europe.
                </p>
              ) : null;
            })()}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Gender Ratio in the United States</h2>
            {(() => {
              const usData = countryData.find(c => c.slug === 'united-states');
              return usData ? (
                <>
                  <p>
                    The United States has a sex ratio of {usData.ratio.toFixed(1)} males per 100 females, with approximately {(usData.male / 1000000).toFixed(1)} million males and {(usData.female / 1000000).toFixed(1)} million females. 
                    This puts the US close to the global average. 
                    The American population is {usData.malePercent.toFixed(1)}% male and {usData.femalePercent.toFixed(1)}% female. Compare with <Link href="/median-age-by-country?country=united-states" className="text-blue-600 hover:underline">US median age</Link> and <Link href="/population-growth-rate-calculator?country=united-states" className="text-blue-600 hover:underline">growth rate</Link>.
                  </p>
                  <p>
                    The US sex ratio varies significantly by age: {usData.atBirthRatio.toFixed(1)} males per 100 females at birth, {usData.workingAgeRatio.toFixed(1)} among working-age adults, and {usData.elderlyRatio.toFixed(1)} among those 65 and older. 
                    <Link href="/united-states" className="text-blue-600 hover:underline">View detailed US demographics</Link>.
                  </p>
                </>
              ) : null;
            })()}

            <h2 className="text-2xl font-semibold mt-8 mb-4">How Gender Imbalance Affects Societies</h2>
            <p>
              Gender imbalances create significant social and economic challenges. 
              Male-surplus countries face marriage squeezes, with millions of men unable to find partners. 
              <Link href="/china" className="text-blue-600 hover:underline">China's</Link> "bare branches" phenomenon — unmarried men without family prospects — affects social stability and economic consumption patterns. See how this relates to <Link href="/median-age-by-country?country=china" className="text-blue-600 hover:underline">China's aging population</Link>.
            </p>
            <p>
              Female-surplus countries confront different issues: widespread widowhood, pension system strain, and eldercare challenges. 
              Eastern European nations with extreme female majorities among the elderly struggle with social support systems. 
              Economic effects include labor force imbalances, altered consumer spending patterns, and migration pressures.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5 Detailed Gender Ratio Examples</h2>
            
            {(() => {
              const qatar = countryData.find(c => c.slug === 'qatar');
              const russia = countryData.find(c => c.slug === 'russia');
              const china = countryData.find(c => c.slug === 'china');
              const india = countryData.find(c => c.slug === 'india');
              const latvia = countryData.find(c => c.slug === 'latvia');
              
              return (
                <>
                  {qatar && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 1: Qatar — Most Male-Skewed Country</h3>
                      <p>
                        Qatar has a sex ratio of {qatar.ratio.toFixed(1)} males per 100 females — the most male-skewed in the world.
                        Total male population: {qatar.male.toLocaleString()}. Total female population: {qatar.female.toLocaleString()}.
                        This extreme imbalance is caused by the massive influx of male foreign workers in construction and energy sectors, not by natural demographic factors.
                        → <Link href="/qatar" className="text-blue-600 hover:underline">View Qatar demographics</Link>
                      </p>
                    </>
                  )}

                  {russia && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 2: Russia — Largest Female Surplus Among Major Countries</h3>
                      <p>
                        Russia has {russia.ratio.toFixed(1)} males for every 100 females, one of the world's most female-skewed ratios among large countries.
                        The gap is most dramatic in the 65+ age group where the ratio drops to {russia.elderlyRatio.toFixed(1)} males per 100 females.
                        This reflects the significant male life expectancy gap — Russian men live approximately 10 years less than Russian women.
                        → <Link href="/russia" className="text-blue-600 hover:underline">View Russia demographics</Link>
                      </p>
                    </>
                  )}

                  {china && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 3: China — Sex Selection Legacy</h3>
                      <p>
                        China's sex ratio is {china.ratio.toFixed(1)} males per 100 females, reflecting decades of one-child policy combined with cultural preference for sons.
                        The sex ratio at birth (0-4 age group) is {china.atBirthRatio.toFixed(1)} — higher than the natural ~105.
                        This has created a surplus of approximately {((china.male - china.female) / 1000000).toFixed(0)} million more men than women.
                        → <Link href="/china" className="text-blue-600 hover:underline">View China demographics</Link>
                      </p>
                    </>
                  )}

                  {india && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 4: India — Shifting Gender Dynamics</h3>
                      <p>
                        India has {india.ratio.toFixed(1)} males per 100 females with a sex ratio at birth of {india.atBirthRatio.toFixed(1)}.
                        The gender gap has been gradually narrowing as sex-selective practices decline.
                        India's working-age sex ratio of {india.workingAgeRatio.toFixed(1)} differs markedly from its elderly ratio of {india.elderlyRatio.toFixed(1)}.
                        → <Link href="/india" className="text-blue-600 hover:underline">View India demographics</Link>
                      </p>
                    </>
                  )}

                  {latvia && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 5: Latvia — Europe's Gender Gap</h3>
                      <p>
                        Latvia has one of the lowest sex ratios in Europe at {latvia.ratio.toFixed(1)} males per 100 females.
                        Among the elderly population (65+), the ratio drops to just {latvia.elderlyRatio.toFixed(1)} males per 100 females.
                        This reflects both higher male mortality and emigration of working-age men.
                        → <Link href="/latvia" className="text-blue-600 hover:underline">View Latvia demographics</Link>
                      </p>
                    </>
                  )}
                </>
              );
            })()}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-lg">What is the male to female ratio in the world?</h3>
                <p className="mt-2">
                  The global male to female ratio is approximately {worldData?.ratio.toFixed(1)} males per 100 females, with {(worldData?.male / 1000000000).toFixed(1)} billion males and {(worldData?.female / 1000000000).toFixed(1)} billion females worldwide. Males slightly outnumber females overall because more boys are born than girls, though women outnumber men in older age groups.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is the ratio of men to women globally?</h3>
                <p className="mt-2">
                  Globally, there are roughly {worldData?.ratio.toFixed(1)} men for every 100 women, making the population approximately {worldData?.malePercent.toFixed(1)}% male and {worldData?.femalePercent.toFixed(1)}% female. This balance varies dramatically by country — from {filteredAndSortedData[0]?.name} with {filteredAndSortedData[0]?.ratio.toFixed(1)} males per 100 females to {[...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio)[0]?.name} with {[...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio)[0]?.ratio.toFixed(1)}.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is the human sex ratio?</h3>
                <p className="mt-2">
                  The human sex ratio at birth is naturally about 105 males per 100 females. Over a lifetime this evens out because males have higher mortality at every age. By age 65+, women outnumber men in nearly every country.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is the sex ratio at birth?</h3>
                <p className="mt-2">
                  The natural human sex ratio at birth is approximately 105 boys per 100 girls. Some countries show ratios above 110 due to sex-selective practices, while others are near the natural rate.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What country has the highest male to female ratio?</h3>
                <p className="mt-2">
                  {filteredAndSortedData[0]?.name} has the highest male to female ratio at {filteredAndSortedData[0]?.ratio.toFixed(1)} per 100, driven by male migrant workers. The top 5 most male-skewed countries are {filteredAndSortedData.slice(0, 5).map(c => c.name).join(', ')}.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What country has the most women per capita?</h3>
                <p className="mt-2">
                  {[...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio)[0]?.name} has the lowest male to female ratio at {[...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio)[0]?.ratio.toFixed(1)} per 100, meaning {[...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio)[0]?.femalePercent.toFixed(1)}% of the population is female.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is the gender ratio in the United States?</h3>
                {(() => {
                  const usData = countryData.find(c => c.slug === 'united-states');
                  return usData ? (
                    <p className="mt-2">
                      The US has a sex ratio of {usData.ratio.toFixed(1)} males per 100 females, with approximately {(usData.male / 1000000).toFixed(1)} million males and {(usData.female / 1000000).toFixed(1)} million females. The ratio shifts from {usData.atBirthRatio.toFixed(1)} at birth to {usData.elderlyRatio.toFixed(1)} among those aged 65+.
                    </p>
                  ) : null;
                })()}
              </div>

              <div>
                <h3 className="font-semibold text-lg">Why are more boys born than girls?</h3>
                <p className="mt-2">
                  Approximately 105 boys are born for every 100 girls worldwide. Evolutionary biologists believe this compensates for higher male mortality rates at every age, so the ratio roughly balances by reproductive age.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is gender imbalance?</h3>
                <p className="mt-2">
                  Gender imbalance occurs when a population has a significantly unequal ratio of males to females. The most extreme cases are Gulf states like Qatar ({filteredAndSortedData[0]?.ratio.toFixed(1)} males per 100 females) due to labor migration, and Eastern European countries like {[...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio)[0]?.name} ({[...filteredAndSortedData].sort((a, b) => a.ratio - b.ratio)[0]?.ratio.toFixed(1)}) due to male mortality.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">How does gender ratio change with age?</h3>
                <p className="mt-2">
                  At birth, there are about 105 males per 100 females globally. By working age (15-64), the ratio narrows to approximately {worldData?.workingAgeRatio.toFixed(1)}. Among the elderly (65+), women significantly outnumber men at roughly {worldData?.elderlyRatio.toFixed(1)} males per 100 females.
                </p>
              </div>
            </div>

            {/* Internal Links Section */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Related Tools & Country Data</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Calculators</h4>
                  <ul className="space-y-1 text-blue-600">
                    <li><Link href="/generation-age-ranges-calculator" className="hover:underline">Generation Calculator</Link></li>
                    <li><Link href="/dependency-ratio-calculator" className="hover:underline">Dependency Ratio</Link></li>
                    <li><Link href="/population-growth-rate-calculator" className="hover:underline">Population Growth</Link></li>
                    <li><Link href="/compare" className="hover:underline">Compare Countries</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Major Countries</h4>
                  <ul className="space-y-1 text-blue-600">
                    <li><Link href="/china" className="hover:underline">China</Link></li>
                    <li><Link href="/india" className="hover:underline">India</Link></li>
                    <li><Link href="/united-states" className="hover:underline">United States</Link></li>
                    <li><Link href="/japan" className="hover:underline">Japan</Link></li>
                    <li><Link href="/nigeria" className="hover:underline">Nigeria</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Gender Extremes</h4>
                  <ul className="space-y-1 text-blue-600">
                    <li><Link href="/qatar" className="hover:underline">Qatar</Link></li>
                    <li><Link href="/united-arab-emirates" className="hover:underline">UAE</Link></li>
                    <li><Link href="/russia" className="hover:underline">Russia</Link></li>
                    <li><Link href="/ukraine" className="hover:underline">Ukraine</Link></li>
                    <li><Link href="/latvia" className="hover:underline">Latvia</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MaleToFemaleRatioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gender ratio data...</p>
        </div>
      </div>
    }>
      <MaleToFemaleRatioContent />
    </Suspense>
  );
}