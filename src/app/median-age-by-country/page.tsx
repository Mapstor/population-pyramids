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
  medianAge: number;
  youthPercent: number;
  workingPercent: number;
  elderlyPercent: number;
  totalPopulation: number;
  youthCount: number;
  workingCount: number;
  elderlyCount: number;
  region: string;
  category: string;
  historicalData?: { year: number; medianAge: number }[];
}

function MedianAgeByCountryContent() {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [compareCountry, setCompareCountry] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CountryData; direction: 'asc' | 'desc' }>({ 
    key: 'medianAge', 
    direction: 'desc' 
  });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/median-ages');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        const allData = [data.world, ...data.countries];
        setCountryData(allData);
      } catch (error) {
        console.error('Error loading median age data:', error);
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
    const year = searchParams.get('year');

    if (country) setSelectedCountry(country);
    if (compare) {
      const [country1, country2] = compare.split(',');
      if (country1) setSelectedCountry(country1);
      if (country2) setCompareCountry(country2);
    }
    if (year) setSelectedYear(parseInt(year));
  }, [searchParams]);

  // Get selected country data
  const selectedData = useMemo(() => {
    return countryData.find(c => c.slug === selectedCountry) || countryData[0];
  }, [countryData, selectedCountry]);

  const compareData = useMemo(() => {
    return compareCountry ? countryData.find(c => c.slug === compareCountry) : null;
  }, [countryData, compareCountry]);

  // Get global rank
  const getGlobalRank = (data: CountryData) => {
    const sorted = [...countryData.filter(c => c.slug !== 'world')].sort((a, b) => b.medianAge - a.medianAge);
    return sorted.findIndex(c => c.slug === data.slug) + 1;
  };

  // Find similar countries
  const getSimilarCountries = (data: CountryData) => {
    if (!data || data.slug === 'world') return [];
    
    return countryData
      .filter(c => c.slug !== 'world' && c.slug !== data.slug)
      .map(c => ({ ...c, diff: Math.abs(c.medianAge - data.medianAge) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3)
      .map(c => c.name);
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

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter);
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
  }, [countryData, searchTerm, regionFilter, categoryFilter, sortConfig]);

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

  const getAgeColor = (age: number): string => {
    if (age < 20) return 'text-green-600';
    if (age < 30) return 'text-lime-600';
    if (age < 40) return 'text-yellow-600';
    if (age < 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryColor = (category: string): string => {
    switch(category) {
      case 'Very Young': return 'bg-green-100 text-green-800';
      case 'Young': return 'bg-lime-100 text-lime-800';
      case 'Middle-Aged': return 'bg-yellow-100 text-yellow-800';
      case 'Aging': return 'bg-orange-100 text-orange-800';
      case 'Aged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading median age data...</p>
        </div>
      </div>
    );
  }

  const worldData = countryData[0];
  const oldestCountries = [...countryData.filter(c => c.slug !== 'world')].sort((a, b) => b.medianAge - a.medianAge).slice(0, 15);
  const youngestCountries = [...countryData.filter(c => c.slug !== 'world')].sort((a, b) => a.medianAge - b.medianAge).slice(0, 15);
  const usData = countryData.find(c => c.slug === 'united-states');

  // WebApplication structured data
  const webAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Median Age Explorer",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Interactive tool to explore median ages by country with population age breakdowns"
  };

  // Dataset structured data
  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Global Median Age Data 2026",
    "description": "Median age statistics and age distribution for all countries from UN World Population Prospects",
    "creator": {
      "@type": "Organization",
      "name": "United Nations",
      "url": "https://population.un.org/"
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "application/json",
      "contentUrl": "https://populationpyramids.org/api/median-ages"
    },
    "temporalCoverage": "1950/2025",
    "spatialCoverage": {
      "@type": "Place",
      "name": "World"
    },
    "license": "https://creativecommons.org/licenses/by/4.0/"
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
        "name": "Median Age by Country",
        "item": "https://populationpyramids.org/median-age-by-country"
      }
    ]
  };

  // Generate structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is median age?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Median age is the age that divides a population into two numerically equal groups — half are younger, half are older. It is the single best indicator of whether a population is young or old. The world's median age is currently ${worldData?.medianAge.toFixed(1)} years.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the median age in the United States?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The median age in the United States is ${usData?.medianAge.toFixed(1)} years, ranking #${usData ? getGlobalRank(usData) : 'N/A'} of 195 countries. Approximately ${usData?.youthPercent.toFixed(1)}% of Americans are under 15 and ${usData?.elderlyPercent.toFixed(1)}% are over 65.`
        }
      },
      {
        "@type": "Question",
        "name": "Which country has the highest median age?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${oldestCountries[0]?.name} has the world's highest median age at ${oldestCountries[0]?.medianAge.toFixed(1)} years. The top 5 oldest countries by median age are: ${oldestCountries.slice(0, 5).map(c => `${c.name} (${c.medianAge.toFixed(1)})`).join(', ')}.`
        }
      },
      {
        "@type": "Question",
        "name": "Which country has the youngest population?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${youngestCountries[0]?.name} has the world's lowest median age at ${youngestCountries[0]?.medianAge.toFixed(1)} years. ${youngestCountries[0]?.youthPercent.toFixed(1)}% of its population is under 15 years old.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the median age of the world?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The global median age is ${worldData?.medianAge.toFixed(1)} years. This has increased from approximately 24 years in 1950 as populations worldwide age due to declining fertility and increasing life expectancy.`
        }
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
        id="webapp-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppStructuredData) }}
      />
      <Script
        id="dataset-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Median Age by Country 2026: World's Oldest & Youngest Populations
          </h1>

          {/* Interactive Tool */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">"How Old Is Your Country?" — Median Age Explorer</h2>
            
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

            {/* Results */}
            {selectedData && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Primary Country */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      {selectedData.slug === 'world' ? '🌍' : getCountryFlag(selectedData.code)} 
                      {selectedData.name}
                    </h3>
                    
                    <div className={`text-5xl font-bold mb-2 ${getAgeColor(selectedData.medianAge)}`}>
                      {selectedData.medianAge.toFixed(1)}
                      <span className="text-2xl text-gray-600 ml-2">years</span>
                    </div>
                    
                    {selectedData.slug !== 'world' && (
                      <>
                        <div className="text-gray-600 mb-2">
                          #{getGlobalRank(selectedData)} of {countryData.length - 1} {getGlobalRank(selectedData) <= (countryData.length - 1) / 2 ? 'oldest' : 'youngest'}
                        </div>
                        <div className="text-gray-600 mb-4">
                          {getGlobalRank(selectedData) <= (countryData.length - 1) / 2 
                            ? `Older than ${Math.round(((countryData.length - 1 - getGlobalRank(selectedData)) / (countryData.length - 1)) * 100)}% of countries`
                            : `Younger than ${Math.round((getGlobalRank(selectedData) / (countryData.length - 1)) * 100)}% of countries`}
                        </div>
                      </>
                    )}
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getCategoryColor(selectedData.category)}`}>
                      {selectedData.category}
                    </div>
                    
                    {/* Age breakdown */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Youth (0-14)</span>
                          <span className="font-semibold">{selectedData.youthPercent.toFixed(1)}% — {(selectedData.youthCount / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedData.youthPercent}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Working (15-64)</span>
                          <span className="font-semibold">{selectedData.workingPercent.toFixed(1)}% — {(selectedData.workingCount / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedData.workingPercent}%` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Elderly (65+)</span>
                          <span className="font-semibold">{selectedData.elderlyPercent.toFixed(1)}% — {(selectedData.elderlyCount / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${selectedData.elderlyPercent}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedData.slug !== 'world' && getSimilarCountries(selectedData).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-600">Similar to: </span>
                        <span className="text-sm font-medium">{getSimilarCountries(selectedData).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Compare Country */}
                  {compareData && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        {getCountryFlag(compareData.code)} {compareData.name}
                      </h3>
                      
                      <div className={`text-5xl font-bold mb-2 ${getAgeColor(compareData.medianAge)}`}>
                        {compareData.medianAge.toFixed(1)}
                        <span className="text-2xl text-gray-600 ml-2">years</span>
                      </div>
                      
                      <div className="text-gray-600 mb-2">
                        #{getGlobalRank(compareData)} of {countryData.length - 1} {getGlobalRank(compareData) <= (countryData.length - 1) / 2 ? 'oldest' : 'youngest'}
                      </div>
                      
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getCategoryColor(compareData.category)}`}>
                        {compareData.category}
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg mb-4">
                        <span className="font-semibold">
                          {compareData.name} is {Math.abs(compareData.medianAge - selectedData.medianAge).toFixed(1)} years {compareData.medianAge > selectedData.medianAge ? 'older' : 'younger'} than {selectedData.name}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Youth (0-14)</span>
                            <span className="font-semibold">{compareData.youthPercent.toFixed(1)}% — {(compareData.youthCount / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${compareData.youthPercent}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Working (15-64)</span>
                            <span className="font-semibold">{compareData.workingPercent.toFixed(1)}% — {(compareData.workingCount / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${compareData.workingPercent}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Elderly (65+)</span>
                            <span className="font-semibold">{compareData.elderlyPercent.toFixed(1)}% — {(compareData.elderlyCount / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${compareData.elderlyPercent}%` }}></div>
                          </div>
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
            <h2 className="text-2xl font-semibold mb-6">Median Age Rankings by Country</h2>
            
            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
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
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Very Young">Very Young (&lt;20)</option>
                <option value="Young">Young (20-29)</option>
                <option value="Middle-Aged">Middle-Aged (30-39)</option>
                <option value="Aging">Aging (40-49)</option>
                <option value="Aged">Aged (50+)</option>
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
                      onClick={() => handleSort('medianAge')}
                    >
                      Median Age {sortConfig.key === 'medianAge' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('youthPercent')}
                    >
                      Youth % {sortConfig.key === 'youthPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('workingPercent')}
                    >
                      Working % {sortConfig.key === 'workingPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('elderlyPercent')}
                    >
                      Elderly % {sortConfig.key === 'elderlyPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-2 text-center">Category</th>
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
                      <td className={`px-4 py-2 text-right font-bold ${getAgeColor(country.medianAge)}`}>
                        {country.medianAge.toFixed(1)}
                      </td>
                      <td className="px-4 py-2 text-right">{country.youthPercent.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right">{country.workingPercent.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right">{country.elderlyPercent.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(country.category)}`}>
                          {country.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">What Is Median Age?</h2>
            <p>
              Median age is the age that divides a population into two equal halves — 50% are younger and 50% are older. The world's median age is {worldData?.medianAge.toFixed(1)} years as of 2026, meaning half of all people on Earth are younger than {worldData?.medianAge.toFixed(1)} and half are older. It is the single best number to understand if a country is "young" or "old." This metric closely correlates with <Link href="/dependency-ratio-calculator" className="text-blue-600 hover:underline">dependency ratios</Link> and <Link href="/population-growth-rate-calculator" className="text-blue-600 hover:underline">population growth rates</Link>.
            </p>
            <p>
              Median age directly relates to population pyramid shapes: countries with low median ages have expansive (triangle-shaped) pyramids with wide bases showing many young people. Countries with high median ages have constrictive (inverted) pyramids with narrow bases and broader tops, indicating aging populations. Explore <Link href="/" className="text-blue-600 hover:underline">population pyramids for all countries</Link> to see this relationship visually.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Median Age in the United States</h2>
            {usData && (
              <>
                <p>
                  The median age in the United States is {usData.medianAge.toFixed(1)} years, ranking it #{getGlobalRank(usData)} globally. This places the US {usData.medianAge > worldData?.medianAge ? 'above' : 'below'} the global average of {worldData?.medianAge.toFixed(1)} years. Compared to most European countries, the US has a relatively younger population.
                </p>
                <p>
                  The US population breakdown shows {usData.youthPercent.toFixed(1)}% are under 15 (youth), {usData.workingPercent.toFixed(1)}% are working age (15-64), and {usData.elderlyPercent.toFixed(1)}% are 65 or older. <Link href="/united-states" className="text-blue-600 hover:underline">View detailed US demographics</Link>. Compare with <Link href="/male-to-female-ratio?country=united-states" className="text-blue-600 hover:underline">US gender ratios</Link> and explore <Link href="/generation-age-ranges-calculator?country=united-states" className="text-blue-600 hover:underline">US generational cohorts</Link>.
                </p>
              </>
            )}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Countries with the Highest Median Age (Oldest Populations)</h2>
            <p>
              The world's oldest populations are concentrated in Europe and East Asia, where declining birth rates and high life expectancy have created aging societies. <Link href={`/${oldestCountries[0]?.slug}`} className="text-blue-600 hover:underline">{oldestCountries[0]?.name}</Link> leads with a median age of {oldestCountries[0]?.medianAge.toFixed(1)} years, followed by <Link href={`/${oldestCountries[1]?.slug}`} className="text-blue-600 hover:underline">{oldestCountries[1]?.name}</Link> ({oldestCountries[1]?.medianAge.toFixed(1)}) and <Link href={`/${oldestCountries[2]?.slug}`} className="text-blue-600 hover:underline">{oldestCountries[2]?.name}</Link> ({oldestCountries[2]?.medianAge.toFixed(1)}). High median ages mean growing pressure on pension systems, healthcare costs, and shrinking workforces. See how this affects <Link href="/dependency-ratio-calculator" className="text-blue-600 hover:underline">dependency ratios</Link>.
            </p>
            
            {oldestCountries[0]?.slug === 'japan' && (
              <p>
                Japan's median age of {oldestCountries[0]?.medianAge.toFixed(1)} is the world's highest, reflecting decades of declining births and the world's longest life expectancy. {oldestCountries[0]?.elderlyPercent.toFixed(1)}% of Japan's population is aged 65 or older, while only {oldestCountries[0]?.youthPercent.toFixed(1)}% is under 15. <Link href="/japan" className="text-blue-600 hover:underline">Explore Japan's demographics</Link>.
              </p>
            )}
            
            <p>
              Other countries in the top 15 oldest by median age include: {oldestCountries.slice(3, 15).map((c, i) => (
                <span key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-blue-600 hover:underline">{c.name}</Link> ({c.medianAge.toFixed(1)})
                  {i < 11 ? ', ' : ''}
                </span>
              ))}.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Countries with the Lowest Median Age (Youngest Populations)</h2>
            <p>
              The world's youngest populations are predominantly in Sub-Saharan Africa, where high fertility rates create youth-dominated societies. <Link href={`/${youngestCountries[0]?.slug}`} className="text-blue-600 hover:underline">{youngestCountries[0]?.name}</Link> has the lowest median age at just {youngestCountries[0]?.medianAge.toFixed(1)} years, meaning half its population is younger than {youngestCountries[0]?.medianAge.toFixed(1)} — a population dominated by children and teenagers. <Link href={`/${youngestCountries[1]?.slug}`} className="text-blue-600 hover:underline">{youngestCountries[1]?.name}</Link> ({youngestCountries[1]?.medianAge.toFixed(1)}) and <Link href={`/${youngestCountries[2]?.slug}`} className="text-blue-600 hover:underline">{youngestCountries[2]?.name}</Link> ({youngestCountries[2]?.medianAge.toFixed(1)}) follow closely. Explore their <Link href="/population-growth-rate-calculator" className="text-blue-600 hover:underline">explosive growth rates</Link>.
            </p>
            
            <p>
              Low median ages mean youth bulges that create enormous demand for education, healthcare, and job creation. However, if properly managed, this young workforce can become a demographic dividend driving economic growth. Countries in the bottom 15 youngest include: {youngestCountries.slice(3, 15).map((c, i) => (
                <span key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-blue-600 hover:underline">{c.name}</Link> ({c.medianAge.toFixed(1)})
                  {i < 11 ? ', ' : ''}
                </span>
              ))}.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5 Median Age Case Studies</h2>
            
            {(() => {
              const japan = countryData.find(c => c.slug === 'japan');
              const niger = countryData.find(c => c.slug === 'niger');
              const southKorea = countryData.find(c => c.slug === 'south-korea');
              const nigeria = countryData.find(c => c.slug === 'nigeria');
              
              return (
                <>
                  {japan && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 1: Japan — The World's Oldest Country</h3>
                      <p>
                        Japan has a median age of {japan.medianAge.toFixed(1)} years — the highest of any country. {japan.elderlyPercent.toFixed(1)}% of Japan's population is aged 65 or older, while only {japan.youthPercent.toFixed(1)}% is under 15. This extreme aging creates unprecedented challenges for healthcare, pensions, and economic growth.
                        → <Link href="/japan" className="text-blue-600 hover:underline">View Japan demographics</Link>
                      </p>
                    </>
                  )}

                  {niger && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 2: Niger — The World's Youngest Country</h3>
                      <p>
                        Niger's median age of {niger.medianAge.toFixed(1)} years makes it the world's youngest country. A staggering {niger.youthPercent.toFixed(1)}% of Niger's population is under 15, while just {niger.elderlyPercent.toFixed(1)}% is 65 or older. This extreme youth creates enormous demand for education, healthcare, and job creation.
                        → <Link href="/niger" className="text-blue-600 hover:underline">View Niger demographics</Link>
                      </p>
                    </>
                  )}

                  {usData && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 3: United States — Middle of the Pack</h3>
                      <p>
                        The United States has a median age of {usData.medianAge.toFixed(1)}, placing it {usData.medianAge > worldData?.medianAge ? 'above' : 'below'} the global average of {worldData?.medianAge.toFixed(1)}. {usData.youthPercent.toFixed(1)}% of Americans are under 15 and {usData.elderlyPercent.toFixed(1)}% are over 65. Compared to most European countries, the US has a relatively younger population.
                        → <Link href="/united-states" className="text-blue-600 hover:underline">View US demographics</Link>
                      </p>
                    </>
                  )}

                  {southKorea && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 4: South Korea — Fastest Aging Country</h3>
                      <p>
                        South Korea's median age is {southKorea.medianAge.toFixed(1)} years, reflecting one of the most dramatic demographic shifts in history. Combined with the world's lowest fertility rate, South Korea's population is aging faster than any other major country. By 2050, South Korea's median age is projected to be among the highest globally.
                        → <Link href="/south-korea" className="text-blue-600 hover:underline">View South Korea demographics</Link>
                      </p>
                    </>
                  )}

                  {nigeria && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Example 5: Nigeria — Africa's Youth Giant</h3>
                      <p>
                        Nigeria's median age of {nigeria.medianAge.toFixed(1)} reflects a population where {nigeria.youthPercent.toFixed(1)}% of its {(nigeria.totalPopulation / 1000000).toFixed(0)} million people are under 15. This youth bulge will make Nigeria one of the world's most populous countries by 2050. Whether this becomes a demographic dividend or a burden depends on education and employment policies.
                        → <Link href="/nigeria" className="text-blue-600 hover:underline">View Nigeria demographics</Link>
                      </p>
                    </>
                  )}
                </>
              );
            })()}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Youth Population vs Elderly Population: The Global Divide</h2>
            <p>
              The global demographic divide is stark: African nations often have 40-50% of their population under 15, while countries like Japan and Italy have 25-30% over 65. Several European countries have already crossed the demographic threshold where elderly outnumber children — a historic first that signals population decline.
            </p>
            <p>
              Countries with the most extreme youth dominance have 5-10 times more children than elderly, creating young, rapidly growing populations. Meanwhile, aging societies face inverted population pyramids with shrinking workforces supporting growing numbers of retirees. <Link href="/" className="text-blue-600 hover:underline">Explore population pyramids</Link> to visualize these dramatic differences.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What Median Age Tells You About a Country</h2>
            <p>
              Median age reveals a country's demographic stage and economic challenges. Countries with median age under 20 have expansive pyramids, rapid growth, youth-dominated economies, and high child dependency. Those with median age 20-35 enjoy a demographic dividend window with large workforces and economic growth potential.
            </p>
            <p>
              Countries with median age 35-45 are transitioning economies where aging begins and dependency becomes more balanced. Those over 45 have constrictive pyramids, shrinking workforces, pension and healthcare strain, and likely population decline. Each category connects to real challenges: youth bulge countries need jobs and schools, while aging countries need healthcare and pension reform. Track these trends with our <Link href="/population-growth-rate-calculator" className="text-blue-600 hover:underline">growth calculator</Link> and <Link href="/compare" className="text-blue-600 hover:underline">country comparison tool</Link>.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-lg">What is median age?</h3>
                <p className="mt-2">
                  Median age is the age that divides a population into two numerically equal groups — half are younger, half are older. It is the single best indicator of whether a population is young or old. The world's median age is currently {worldData?.medianAge.toFixed(1)} years.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is the median age in the United States?</h3>
                {usData && (
                  <p className="mt-2">
                    The median age in the United States is {usData.medianAge.toFixed(1)} years, ranking #{getGlobalRank(usData)} of 195 countries. Approximately {usData.youthPercent.toFixed(1)}% of Americans are under 15 and {usData.elderlyPercent.toFixed(1)}% are over 65.
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg">Which country has the highest median age?</h3>
                <p className="mt-2">
                  {oldestCountries[0]?.name} has the world's highest median age at {oldestCountries[0]?.medianAge.toFixed(1)} years. The top 5 oldest countries by median age are: {oldestCountries.slice(0, 5).map(c => `${c.name} (${c.medianAge.toFixed(1)})`).join(', ')}.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Which country has the youngest population?</h3>
                <p className="mt-2">
                  {youngestCountries[0]?.name} has the world's lowest median age at {youngestCountries[0]?.medianAge.toFixed(1)} years. {youngestCountries[0]?.youthPercent.toFixed(1)}% of its population is under 15 years old.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is the median age of the world?</h3>
                <p className="mt-2">
                  The global median age is {worldData?.medianAge.toFixed(1)} years. This has increased from approximately 24 years in 1950 as populations worldwide age due to declining fertility and increasing life expectancy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What does a rising median age mean?</h3>
                <p className="mt-2">
                  A rising median age means a population is aging — fewer children are being born relative to the existing population, and/or people are living longer. Countries with rapidly rising median ages face growing pressure on pension systems and healthcare.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is a youth bulge?</h3>
                <p className="mt-2">
                  A youth bulge is when a country has an unusually large proportion of young people, typically with over 35% of the population under age 15. Countries like {youngestCountries[0]?.name} ({youngestCountries[0]?.youthPercent.toFixed(1)}% under 15) and {youngestCountries[1]?.name} ({youngestCountries[1]?.youthPercent.toFixed(1)}% under 15) currently have youth bulges, which can drive economic growth or create instability depending on job availability.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">What is the elderly population percentage by country?</h3>
                <p className="mt-2">
                  {oldestCountries[0]?.name} has the highest elderly percentage at {oldestCountries[0]?.elderlyPercent.toFixed(1)}% of population over 65, followed by {oldestCountries.slice(1, 4).map(c => `${c.name} (${c.elderlyPercent.toFixed(1)}%)`).join(', ')}. In contrast, countries like {youngestCountries[0]?.name} have less than {youngestCountries[0]?.elderlyPercent.toFixed(1)}% over 65.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">How does median age relate to population pyramids?</h3>
                <p className="mt-2">
                  A low median age produces an expansive (triangle-shaped) population pyramid with a wide base of young people. A high median age produces a constrictive (inverted) pyramid with a narrow base. <Link href="/" className="text-blue-600 hover:underline">Explore population pyramids for all 195 countries on our homepage</Link>.
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
                    <li><Link href="/male-to-female-ratio" className="hover:underline">Gender Ratio</Link></li>
                    <li><Link href="/compare" className="hover:underline">Compare Countries</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Oldest Countries</h4>
                  <ul className="space-y-1 text-blue-600">
                    {oldestCountries.slice(0, 5).map(c => (
                      <li key={c.slug}><Link href={`/${c.slug}`} className="hover:underline">{c.name}</Link></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Youngest Countries</h4>
                  <ul className="space-y-1 text-blue-600">
                    {youngestCountries.slice(0, 5).map(c => (
                      <li key={c.slug}><Link href={`/${c.slug}`} className="hover:underline">{c.name}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href="/states" className="text-blue-600 hover:underline">View US state demographics →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MedianAgeByCountryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading median age data...</p>
        </div>
      </div>
    }>
      <MedianAgeByCountryContent />
    </Suspense>
  );
}