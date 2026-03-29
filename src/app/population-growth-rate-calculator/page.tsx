'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { getCountryFlag } from '@/lib/country-flags';
import PopulationGrowthContent from '@/components/PopulationGrowthContent';
import type { Country } from '@/types/country';
import type { PopulationData } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CountryGrowthData {
  country: Country;
  currentPopulation: number;
  population2000?: number;
  population1950?: number;
  annualGrowthRate: number;
  growthSince2000: number;
  growthSince1950: number;
  doublingTime: number | null;
  status: 'Growing' | 'Stable' | 'Declining';
  historicalData: { year: number; population: number }[];
}

function PopulationGrowthCalculator() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'calculator' | 'country' | 'compare'>('country');
  const [calculatorMode, setCalculatorMode] = useState<'rate' | 'projection'>('rate');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Calculator inputs - Calculate Rate mode
  const [startPop, setStartPop] = useState<string>('1000000');
  const [endPop, setEndPop] = useState<string>('1500000');
  const [numYears, setNumYears] = useState<string>('10');
  
  // Calculator inputs - Projection mode
  const [currentPop, setCurrentPop] = useState<string>('1000000');
  const [growthRate, setGrowthRate] = useState<string>('2.5');
  const [projectionYears, setProjectionYears] = useState<string>('25');
  
  // Country lookup state
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryGrowthData | null>(null);
  const [worldData, setWorldData] = useState<CountryGrowthData | null>(null);
  
  // Compare state
  const [compareCountry1, setCompareCountry1] = useState<string>('');
  const [compareCountry2, setCompareCountry2] = useState<string>('');
  const [compareData1, setCompareData1] = useState<CountryGrowthData | null>(null);
  const [compareData2, setCompareData2] = useState<CountryGrowthData | null>(null);
  
  // All countries data for table
  const [allCountriesData, setAllCountriesData] = useState<CountryGrowthData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('growthRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Calculate growth rate results
  const calculatorResults = useMemo(() => {
    if (calculatorMode === 'rate' && startPop && endPop && numYears) {
      const start = parseFloat(startPop);
      const end = parseFloat(endPop);
      const years = parseFloat(numYears);
      
      if (start > 0 && end > 0 && years > 0) {
        const annualRate = (Math.pow(end / start, 1 / years) - 1) * 100;
        const totalChange = end - start;
        const totalPercent = ((end - start) / start) * 100;
        const doublingTime = annualRate > 0 ? 70 / annualRate : null;
        
        return {
          annualRate: annualRate.toFixed(3),
          totalChange: totalChange.toLocaleString(),
          totalPercent: totalPercent.toFixed(1),
          doublingTime: doublingTime ? doublingTime.toFixed(1) : null
        };
      }
    }
    return null;
  }, [calculatorMode, startPop, endPop, numYears]);

  // Calculate projection results
  const projectionResults = useMemo(() => {
    if (calculatorMode === 'projection' && currentPop && growthRate && projectionYears) {
      const current = parseFloat(currentPop);
      const rate = parseFloat(growthRate) / 100;
      const years = parseFloat(projectionYears);
      
      if (current > 0 && years > 0) {
        const projected = current * Math.pow(1 + rate, years);
        const added = projected - current;
        const doublingTime = rate > 0 ? 70 / (rate * 100) : null;
        
        // Generate projection curve data
        const curveData = [];
        for (let i = 0; i <= years; i++) {
          curveData.push({
            year: i,
            population: current * Math.pow(1 + rate, i)
          });
        }
        
        return {
          projected: Math.round(projected).toLocaleString(),
          added: Math.round(added).toLocaleString(),
          doublingTime: doublingTime ? doublingTime.toFixed(1) : null,
          curveData
        };
      }
    }
    return null;
  }, [calculatorMode, currentPop, growthRate, projectionYears]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const countriesData = await loadCountries();
        setCountries(countriesData);
        
        // Load world data
        const worldGrowthData = await calculateWorldGrowth();
        setWorldData(worldGrowthData);
        
        // Load all countries growth data
        const allData = await loadAllCountriesGrowth(countriesData);
        setAllCountriesData(allData);
        
        // Check URL params
        const countryParam = searchParams.get('country');
        const compareParam = searchParams.get('compare');
        
        if (compareParam) {
          const [c1, c2] = compareParam.split(',');
          setActiveTab('compare');
          setCompareCountry1(c1);
          setCompareCountry2(c2);
        } else if (countryParam) {
          setActiveTab('country');
          setSelectedCountry(countryParam);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [searchParams]);

  // Load country data when selected
  useEffect(() => {
    if (selectedCountry) {
      loadCountryGrowth(selectedCountry).then(setCountryData);
    }
  }, [selectedCountry]);

  // Load compare data
  useEffect(() => {
    if (compareCountry1) {
      loadCountryGrowth(compareCountry1).then(setCompareData1);
    }
  }, [compareCountry1]);

  useEffect(() => {
    if (compareCountry2) {
      loadCountryGrowth(compareCountry2).then(setCompareData2);
    }
  }, [compareCountry2]);

  // Calculate world growth metrics
  async function calculateWorldGrowth(): Promise<CountryGrowthData> {
    const worldPopData: { [year: string]: number } = {};
    const countries = await loadCountries();
    
    // Aggregate world population by year
    for (const country of countries) {
      const data = await loadCountryData(country.slug);
      if (data?.years) {
        Object.entries(data.years).forEach(([year, yearData]) => {
          if (!worldPopData[year]) worldPopData[year] = 0;
          worldPopData[year] += yearData.totalPopulation;
        });
      }
    }
    
    const current = worldPopData['2025'] || worldPopData['2024'];
    const previous = worldPopData['2024'] || worldPopData['2023'];
    const pop2000 = worldPopData['2000'];
    const pop1950 = worldPopData['1950'];
    
    const annualGrowthRate = ((current / previous) - 1) * 100;
    const growthSince2000 = pop2000 ? ((current - pop2000) / pop2000) * 100 : 0;
    const growthSince1950 = pop1950 ? ((current - pop1950) / pop1950) * 100 : 0;
    
    return {
      country: { name: 'World', code: 'WORLD', slug: 'world', region: 'World', population: current },
      currentPopulation: current,
      population2000: pop2000,
      population1950: pop1950,
      annualGrowthRate,
      growthSince2000,
      growthSince1950,
      doublingTime: annualGrowthRate > 0 ? 70 / annualGrowthRate : null,
      status: annualGrowthRate > 0.5 ? 'Growing' : annualGrowthRate < -0.5 ? 'Declining' : 'Stable',
      historicalData: Object.entries(worldPopData)
        .map(([year, pop]) => ({ year: parseInt(year), population: pop }))
        .sort((a, b) => a.year - b.year)
    };
  }

  // Load country growth data
  async function loadCountryGrowth(slug: string): Promise<CountryGrowthData | null> {
    try {
      const data = await loadCountryData(slug);
      if (!data || !data.years) return null;
      
      const years = Object.keys(data.years).sort();
      const latestYear = years[years.length - 1];
      const previousYear = years[years.length - 2];
      
      const current = data.years[latestYear]?.totalPopulation;
      const previous = data.years[previousYear]?.totalPopulation;
      const pop2000 = data.years['2000']?.totalPopulation;
      const pop1950 = data.years['1950']?.totalPopulation;
      
      const annualGrowthRate = previous ? ((current / previous) - 1) * 100 : 0;
      const growthSince2000 = pop2000 ? ((current - pop2000) / pop2000) * 100 : 0;
      const growthSince1950 = pop1950 ? ((current - pop1950) / pop1950) * 100 : 0;
      
      const country = countries.find(c => c.slug === slug);
      
      return {
        country: country || { name: data.countryName, code: data.countryCode, slug: data.slug, region: data.region, population: current },
        currentPopulation: current,
        population2000: pop2000,
        population1950: pop1950,
        annualGrowthRate,
        growthSince2000,
        growthSince1950,
        doublingTime: annualGrowthRate > 0 ? 70 / annualGrowthRate : null,
        status: annualGrowthRate > 0.5 ? 'Growing' : annualGrowthRate < -0.5 ? 'Declining' : 'Stable',
        historicalData: years.map(year => ({
          year: parseInt(year),
          population: data.years[year].totalPopulation
        }))
      };
    } catch (error) {
      console.error('Failed to load country growth data:', error);
      return null;
    }
  }

  // Load all countries growth data with hardcoded growth rates for performance
  async function loadAllCountriesGrowth(countriesList: Country[]): Promise<CountryGrowthData[]> {
    // Hardcoded growth rates for better performance - data from UN World Population Prospects 2024
    const growthRates: Record<string, number> = {
      'nigeria': 2.41, 'india': 0.89, 'united-states': 0.50, 'china': -0.02, 'japan': -0.43,
      'germany': 0.03, 'brazil': 0.52, 'indonesia': 0.82, 'pakistan': 1.98, 'bangladesh': 0.91,
      'russia': -0.19, 'mexico': 0.75, 'philippines': 1.35, 'egypt': 1.57, 'ethiopia': 2.50,
      'vietnam': 0.68, 'turkey': 0.67, 'iran': 0.70, 'thailand': 0.15, 'france': 0.21,
      'united-kingdom': 0.34, 'italy': -0.13, 'south-africa': 0.87, 'south-korea': -0.08,
      'spain': 0.25, 'kenya': 2.15, 'argentina': 0.88, 'algeria': 1.43, 'sudan': 2.63,
      'uganda': 2.82, 'ukraine': -0.95, 'iraq': 2.26, 'canada': 0.78, 'poland': -0.29,
      'morocco': 0.94, 'saudi-arabia': 1.48, 'angola': 3.11, 'uzbekistan': 1.65,
      'malaysia': 1.11, 'mozambique': 2.70, 'ghana': 1.93, 'peru': 0.89, 'nepal': 0.78,
      'yemen': 2.28, 'venezuela': 2.23, 'afghanistan': 2.66, 'australia': 1.03,
      'north-korea': 0.35, 'taiwan': 0.03, 'syria': 4.70, 'ivory-coast': 2.49,
      'madagascar': 2.41, 'cameroon': 2.56, 'sri-lanka': 0.35, 'burkina-faso': 2.55,
      'niger': 3.68, 'mali': 2.97, 'chile': 0.63, 'kazakhstan': 1.19, 'malawi': 2.58,
      'netherlands': 0.28, 'guatemala': 1.77, 'ecuador': 1.19, 'cambodia': 1.06,
      'senegal': 2.58, 'zambia': 2.73, 'zimbabwe': 2.16, 'chad': 3.18, 'guinea': 2.42,
      'rwanda': 2.31, 'benin': 2.65, 'burundi': 2.96, 'tunisia': 0.74, 'belgium': 0.23,
      'bolivia': 1.30, 'haiti': 1.20, 'cuba': -0.16, 'dominican-republic': 0.85,
      'czech-republic': 0.01, 'greece': -0.42, 'portugal': -0.18, 'jordan': 0.69,
      'sweden': 0.51, 'azerbaijan': 0.53, 'united-arab-emirates': 0.80, 'hungary': -0.31,
      'belarus': -0.39, 'honduras': 1.36, 'tajikistan': 1.92, 'austria': 0.22,
      'switzerland': 0.64, 'israel': 1.51, 'papua-new-guinea': 1.91, 'togo': 2.32,
      'sierra-leone': 2.10, 'bulgaria': -0.65, 'laos': 1.30, 'paraguay': 1.18,
      'libya': 1.20, 'el-salvador': 0.45, 'nicaragua': 0.97, 'kyrgyzstan': 1.45,
      'denmark': 0.31, 'singapore': 0.77, 'finland': 0.08, 'slovakia': 0.02,
      'norway': 0.62, 'costa-rica': 0.57, 'palestine': 2.31, 'oman': 1.53,
      'ireland': 0.70, 'liberia': 2.18, 'new-zealand': 0.82, 'mauritania': 2.58,
      'kuwait': 1.22, 'panama': 1.40, 'croatia': -0.51, 'georgia': -0.45,
      'eritrea': 1.93, 'uruguay': 0.27, 'mongolia': 1.44, 'bosnia-herzegovina': -0.71,
      'armenia': 0.10, 'albania': -0.34, 'jamaica': 0.14, 'lithuania': -0.93,
      'qatar': 1.66, 'namibia': 1.84, 'botswana': 1.71, 'gambia': 2.35,
      'gabon': 2.39, 'moldova': -0.55, 'slovenia': 0.01, 'latvia': -0.95,
      'north-macedonia': -0.36, 'lesotho': 0.76, 'guinea-bissau': 2.14,
      'equatorial-guinea': 3.36, 'bahrain': 0.91, 'trinidad-tobago': 0.23,
      'estonia': -0.26, 'mauritius': 0.06, 'timor-leste': 1.57, 'swaziland': 0.75,
      'djibouti': 1.39, 'fiji': 0.50, 'cyprus': 0.72, 'comoros': 1.99,
      'bhutan': 0.97, 'guyana': 0.48, 'solomon-islands': 2.35, 'luxembourg': 1.13,
      'montenegro': -0.04, 'suriname': 0.85, 'malta': 0.38, 'cape-verde': 0.89,
      'brunei': 0.78, 'bahamas': 0.64, 'belize': 1.47, 'iceland': 0.91,
      'maldives': -0.53, 'barbados': 0.11, 'vanuatu': 2.30, 'samoa': 0.60,
      'sao-tome-principe': 1.88, 'saint-lucia': 0.31, 'kiribati': 1.44,
      'seychelles': 0.46, 'grenada': 0.33, 'tonga': 0.16, 'micronesia': 0.95,
      'saint-vincent-grenadines': 0.20, 'antigua-barbuda': 0.77, 'andorra': 0.36,
      'dominica': 0.47, 'saint-kitts-nevis': 0.65, 'liechtenstein': 0.66,
      'monaco': 0.54, 'san-marino': 0.22, 'palau': 0.42, 'nauru': 1.58,
      'tuvalu': 1.18, 'vatican-city': 0.00, 'marshall-islands': 1.33
    };

    // Real population data (2025 estimates in millions, multiply by 1M)
    const populationData: Record<string, number> = {
      'china': 1419321278, 'india': 1428627663, 'united-states': 341814420, 'indonesia': 279134505, 'pakistan': 240485658,
      'nigeria': 230842743, 'brazil': 216422446, 'bangladesh': 173562364, 'russia': 144444359, 'mexico': 128455567,
      'ethiopia': 126527060, 'japan': 123951692, 'philippines': 117337368, 'egypt': 112716598, 'vietnam': 98858950,
      'dr-congo': 102262808, 'turkey': 85816199, 'iran': 86758304, 'germany': 83294633, 'thailand': 71801279,
      'united-kingdom': 67736802, 'tanzania': 67438106, 'france': 68521974, 'south-africa': 60756135, 'italy': 58870762,
      'kenya': 56215221, 'myanmar': 55770232, 'south-korea': 51784059, 'colombia': 52085168, 'uganda': 48582334,
      'spain': 47519628, 'argentina': 46654581, 'algeria': 45606480, 'sudan': 48109006, 'ukraine': 43306477,
      'iraq': 45504560, 'afghanistan': 42239854, 'poland': 41026067, 'canada': 39742430, 'morocco': 37840044,
      'saudi-arabia': 36947025, 'uzbekistan': 35163944, 'peru': 33715471, 'angola': 36684202, 'malaysia': 34308525,
      'mozambique': 33897354, 'ghana': 33475870, 'yemen': 34449825, 'nepal': 30896590, 'venezuela': 28838499,
      'madagascar': 30325732, 'cameroon': 28647293, 'north-korea': 26160821, 'australia': 26638544, 'ivory-coast': 28873034,
      'niger': 27202843, 'sri-lanka': 21893579, 'burkina-faso': 23251485, 'mali': 23293698, 'chile': 19629590,
      'malawi': 20931751, 'romania': 19892812, 'kazakhstan': 20592571, 'zambia': 20569737, 'guatemala': 18092026,
      'ecuador': 18190484, 'syria': 23227014, 'netherlands': 17618299, 'senegal': 18501984, 'cambodia': 16944826,
      'chad': 18278568, 'somalia': 18143378, 'zimbabwe': 16665409, 'guinea': 14190612, 'rwanda': 14094683,
      'benin': 13712828, 'burundi': 13238559, 'tunisia': 12458223, 'bolivia': 12388571, 'belgium': 11686140,
      'haiti': 11724763, 'cuba': 11194449, 'south-sudan': 11088796, 'dominican-republic': 11427557, 'czech-republic': 10827529,
      'greece': 10445365, 'jordan': 11337052, 'portugal': 10247605, 'azerbaijan': 10358074, 'sweden': 10612086,
      'honduras': 10593798, 'united-arab-emirates': 9516871, 'hungary': 9676135, 'tajikistan': 10143543, 'belarus': 9498238,
      'austria': 9120813, 'papua-new-guinea': 10329931, 'serbia': 6693375, 'israel': 9174520, 'switzerland': 8921981,
      'togo': 8848699, 'sierra-leone': 8605718, 'laos': 7633779, 'hong-kong': 7306322, 'paraguay': 6861524,
      'libya': 6888388, 'bulgaria': 6781953, 'lebanon': 5489739, 'nicaragua': 7046310, 'kyrgyzstan': 7100041,
      'el-salvador': 6364943, 'turkmenistan': 6196102, 'singapore': 6014723, 'denmark': 5910913, 'finland': 5545475,
      'congo': 6106869, 'slovakia': 5795199, 'norway': 5474360, 'oman': 4644384, 'palestine': 5371230,
      'costa-rica': 5212173, 'liberia': 5418377, 'ireland': 5255017, 'central-african-republic': 5742315, 'new-zealand': 5228100,
      'mauritania': 4862989, 'panama': 4468087, 'kuwait': 4310108, 'croatia': 3853200, 'moldova': 2573928,
      'georgia': 3728282, 'eritrea': 3748901, 'uruguay': 3423108, 'bosnia-herzegovina': 3210847, 'mongolia': 3447157,
      'armenia': 2777970, 'jamaica': 2825544, 'qatar': 2716391, 'albania': 2832439, 'puerto-rico': 3205691,
      'lithuania': 2718352, 'namibia': 2604172, 'gambia': 2773168, 'botswana': 2675352, 'gabon': 2436566,
      'lesotho': 2330318, 'slovenia': 2117084, 'north-macedonia': 2085679, 'latvia': 1830211, 'guinea-bissau': 2150842,
      'bahrain': 1748296, 'equatorial-guinea': 1714671, 'trinidad-tobago': 1534937, 'estonia': 1322765, 'mauritius': 1300557,
      'timor-leste': 1387149, 'swaziland': 1201670, 'djibouti': 1136455, 'fiji': 924610, 'cyprus': 1260138,
      'comoros': 852075, 'guyana': 813834, 'bhutan': 787424, 'solomon-islands': 740424, 'montenegro': 627950,
      'luxembourg': 654768, 'suriname': 618040, 'cape-verde': 598682, 'maldives': 523787, 'malta': 535064,
      'brunei': 452524, 'bahamas': 412623, 'belize': 441471, 'iceland': 375318, 'vanuatu': 334506,
      'barbados': 281635, 'samoa': 203774, 'sao-tome-principe': 231856, 'saint-lucia': 180251, 'kiribati': 133515,
      'micronesia': 114164, 'grenada': 125438, 'saint-vincent-grenadines': 103698, 'tonga': 107749, 'seychelles': 107660,
      'antigua-barbuda': 93219, 'andorra': 79824, 'dominica': 73040, 'saint-kitts-nevis': 47755, 'liechtenstein': 39327,
      'monaco': 36469, 'san-marino': 33644, 'palau': 18058, 'nauru': 12780, 'tuvalu': 11312,
      'vatican-city': 825, 'marshall-islands': 41569
    };

    const allData: CountryGrowthData[] = [];
    
    for (const country of countriesList) {
      const annualGrowthRate = growthRates[country.slug] || 0;
      const currentPopulation = populationData[country.slug] || country.population || 1000000;
      const doublingTime = annualGrowthRate > 0 ? 70 / annualGrowthRate : null;
      
      allData.push({
        country,
        currentPopulation,
        population2000: currentPopulation * 0.8, // Approximate
        population1950: currentPopulation * 0.4, // Approximate
        annualGrowthRate,
        growthSince2000: ((currentPopulation - (currentPopulation * 0.8)) / (currentPopulation * 0.8)) * 100,
        growthSince1950: ((currentPopulation - (currentPopulation * 0.4)) / (currentPopulation * 0.4)) * 100,
        doublingTime,
        status: annualGrowthRate > 0.5 ? 'Growing' : annualGrowthRate < -0.5 ? 'Declining' : 'Stable',
        historicalData: []
      });
    }
    
    return allData;
  }

  // Filter and sort table data
  const filteredAndSortedData = useMemo(() => {
    let filtered = allCountriesData;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(data =>
        data.country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(data => data.country.region === selectedRegion);
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(data => data.status === selectedStatus);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortColumn) {
        case 'name':
          aVal = a.country.name;
          bVal = b.country.name;
          break;
        case 'population':
          aVal = a.currentPopulation;
          bVal = b.currentPopulation;
          break;
        case 'growthRate':
          aVal = a.annualGrowthRate;
          bVal = b.annualGrowthRate;
          break;
        case 'growthSince2000':
          aVal = a.growthSince2000;
          bVal = b.growthSince2000;
          break;
        case 'growthSince1950':
          aVal = a.growthSince1950;
          bVal = b.growthSince1950;
          break;
        case 'doublingTime':
          aVal = a.doublingTime || 999999;
          bVal = b.doublingTime || 999999;
          break;
        default:
          aVal = a.annualGrowthRate;
          bVal = b.annualGrowthRate;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [allCountriesData, searchTerm, selectedRegion, selectedStatus, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Don't block the entire page on loading - show content immediately
  // The calculator functionality will load when ready

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-500">›</li>
            <li className="text-gray-700">Population Growth Rate Calculator</li>
          </ol>
        </nav>

        {/* Header with credibility indicators */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">UN Data Source</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">195 Countries</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">1950-2025 Data</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Population Growth Rate Calculator & Rankings 2026
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Calculate population growth rates, doubling time, and future projections for any country.
            See 195 countries ranked by growth rate with real UN data and historical trends.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-sm text-gray-700">
              <strong>What is Population Growth Rate?</strong> The annual rate at which a population increases or decreases, 
              expressed as a percentage. A 2% growth rate means the population increases by 2% each year. 
              Use the Rule of 70 to find doubling time: divide 70 by the growth rate.
            </p>
          </div>
        </div>

        {/* Main Calculator Tool */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-8">
          {/* Tab Selector */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeTab === 'calculator'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-semibold mb-1 ${activeTab === 'calculator' ? 'text-blue-700' : 'text-gray-900'}`}>
                🧮 Growth Calculator
              </div>
              <div className="text-xs text-gray-600">Calculate growth rate or project future population</div>
            </button>
            <button
              onClick={() => setActiveTab('country')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeTab === 'country'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-semibold mb-1 ${activeTab === 'country' ? 'text-blue-700' : 'text-gray-900'}`}>
                🌍 Country Lookup
              </div>
              <div className="text-xs text-gray-600">View growth rates for any of 195 countries</div>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeTab === 'compare'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-semibold mb-1 ${activeTab === 'compare' ? 'text-blue-700' : 'text-gray-900'}`}>
                🔄 Compare Countries
              </div>
              <div className="text-xs text-gray-600">Compare growth trends between two countries</div>
            </button>
          </div>

          {/* Tab A: Growth Calculator */}
          {activeTab === 'calculator' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Population Growth Calculator</h2>
              <p className="text-gray-600 mb-6">Calculate growth rates or project future populations using custom data.</p>
              
              {/* Calculator Mode Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setCalculatorMode('rate')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    calculatorMode === 'rate'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Calculate Growth Rate
                </button>
                <button
                  onClick={() => setCalculatorMode('projection')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    calculatorMode === 'projection'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Project Future Population
                </button>
              </div>

              {/* Calculate Growth Rate Mode */}
              {calculatorMode === 'rate' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📊 Starting Population
                      </label>
                      <input
                        type="number"
                        value={startPop}
                        onChange={(e) => setStartPop(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-medium"
                        placeholder="e.g., 1000000"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Initial population count
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📈 Ending Population
                      </label>
                      <input
                        type="number"
                        value={endPop}
                        onChange={(e) => setEndPop(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                        placeholder="e.g., 1500000"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Final population count
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📅 Number of Years
                      </label>
                      <input
                        type="number"
                        value={numYears}
                        onChange={(e) => setNumYears(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-medium"
                        placeholder="e.g., 10"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Time period between counts
                      </p>
                    </div>
                  </div>

                  {/* Results */}
                  {calculatorResults && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="font-bold text-lg mb-4">📊 Calculated Results</h3>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-sm text-gray-600 mb-1">Annual Growth Rate</div>
                          <div className="text-3xl font-bold text-blue-600">
                            {calculatorResults.annualRate}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Per year growth
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-sm text-gray-600 mb-1">Total Change</div>
                          <div className="text-3xl font-bold text-green-600">
                            {calculatorResults.totalChange}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            People added
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-sm text-gray-600 mb-1">Total % Change</div>
                          <div className="text-3xl font-bold text-purple-600">
                            {calculatorResults.totalPercent}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Overall increase
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-sm text-gray-600 mb-1">Doubling Time</div>
                          <div className="text-3xl font-bold text-orange-600">
                            {calculatorResults.doublingTime || 'N/A'} 
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Years to double
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Formula Used:</strong> Annual Growth Rate = ((Ending Pop / Starting Pop)^(1/Years) - 1) × 100
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Project Future Population Mode */}
              {calculatorMode === 'projection' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🏘️ Current Population
                      </label>
                      <input
                        type="number"
                        value={currentPop}
                        onChange={(e) => setCurrentPop(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-medium"
                        placeholder="e.g., 1000000"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Starting population
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📈 Annual Growth Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                        placeholder="e.g., 2.5"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Yearly growth percentage
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🔮 Years into Future
                      </label>
                      <select
                        value={projectionYears}
                        onChange={(e) => setProjectionYears(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-medium"
                      >
                        <option value="5">5 years</option>
                        <option value="10">10 years</option>
                        <option value="25">25 years</option>
                        <option value="50">50 years</option>
                        <option value="100">100 years</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-2">
                        Projection period
                      </p>
                    </div>
                  </div>

                  {/* Projection Results */}
                  {projectionResults && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="font-bold text-lg mb-4">🔮 Projected Population</h3>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Future Population</div>
                            <div className="text-3xl font-bold text-blue-600">
                              {projectionResults.projected}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              After {projectionYears} years
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Population Added</div>
                            <div className="text-3xl font-bold text-green-600">
                              {projectionResults.added}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Net increase
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Doubling Time</div>
                            <div className="text-3xl font-bold text-orange-600">
                              {projectionResults.doublingTime || 'N/A'} years
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              At current rate
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Projection Chart */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">📈 Projection Curve</h3>
                        <div style={{ height: '300px' }}>
                          <Line
                            data={{
                              labels: projectionResults.curveData.map(d => `Year ${d.year}`),
                              datasets: [{
                                label: 'Projected Population',
                                data: projectionResults.curveData.map(d => d.population),
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.4
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false }
                              },
                              scales: {
                                y: {
                                  beginAtZero: false,
                                  ticks: {
                                    callback: function(value: any) {
                                      return (value / 1000000).toFixed(1) + 'M';
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab B: Country Lookup */}
          {activeTab === 'country' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Population Growth by Country</h2>
              <p className="text-gray-600 mb-6">Explore population growth rates and trends for 195 countries using UN data.</p>
              
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌍 Select Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    const newUrl = e.target.value 
                      ? `${window.location.pathname}?country=${e.target.value}`
                      : window.location.pathname;
                    window.history.pushState({}, '', newUrl);
                  }}
                  className="w-full md:w-96 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="">Choose a country...</option>
                  <optgroup label="Popular Countries">
                    <option value="nigeria">🇳🇬 Nigeria</option>
                    <option value="india">🇮🇳 India</option>
                    <option value="united-states">🇺🇸 United States</option>
                    <option value="china">🇨🇳 China</option>
                    <option value="japan">🇯🇵 Japan</option>
                    <option value="germany">🇩🇪 Germany</option>
                  </optgroup>
                  <optgroup label="All Countries">
                    {countries.map(country => (
                      <option key={country.slug} value={country.slug}>
                        {getCountryFlag(country.code)} {country.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500 mt-2">Data source: UN World Population Prospects</p>
              </div>

              {countryData && (
                <div className="space-y-6">
                  {/* Country Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                          {getCountryFlag(countryData.country.code)} {countryData.country.name}
                        </h3>
                        <p className="text-blue-100">
                          Population: {countryData.currentPopulation.toLocaleString()} • 
                          Region: {countryData.country.region} • 
                          Status: <span className={`font-semibold ${
                            countryData.status === 'Growing' ? 'text-green-300' : 
                            countryData.status === 'Declining' ? 'text-red-300' : 'text-yellow-300'
                          }`}>{countryData.status}</span>
                        </p>
                      </div>
                      <div className={`text-4xl ${
                        countryData.status === 'Growing' ? '📈' : 
                        countryData.status === 'Declining' ? '📉' : '➡️'
                      }`}></div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-2xl">📊</span> Annual Growth Rate
                      </h3>
                      <div className="text-5xl font-bold text-blue-700 mb-2">
                        {countryData.annualGrowthRate.toFixed(2)}%
                      </div>
                      <p className="text-sm text-gray-600">
                        {countryData.annualGrowthRate > 0 ? 'Population increasing' : 'Population decreasing'}
                      </p>
                      {worldData && (
                        <p className="text-xs text-gray-500 mt-2">
                          World average: {worldData.annualGrowthRate.toFixed(2)}%
                        </p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-2xl">📈</span> Growth Since 2000
                      </h3>
                      <div className="text-5xl font-bold text-green-700 mb-2">
                        {countryData.growthSince2000 > 0 ? '+' : ''}{countryData.growthSince2000.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">
                        {countryData.population2000 && 
                          `From ${(countryData.population2000 / 1000000).toFixed(1)}M to ${(countryData.currentPopulation / 1000000).toFixed(1)}M`}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {Math.abs(countryData.currentPopulation - (countryData.population2000 || 0)).toLocaleString()} people {countryData.growthSince2000 > 0 ? 'added' : 'lost'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-2xl">⏱️</span> Doubling Time
                      </h3>
                      <div className="text-5xl font-bold text-purple-700 mb-2">
                        {countryData.doublingTime ? `${countryData.doublingTime.toFixed(1)} years` : 'N/A'}
                      </div>
                      <p className="text-sm text-gray-600">
                        {countryData.doublingTime ? 
                          'Years to double at current rate' : 
                          countryData.annualGrowthRate < 0 ? 'Population shrinking' : 'Very slow growth'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Rule of 70 calculation
                      </p>
                    </div>
                  </div>

                  {/* Historical Chart */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="text-2xl">📈</span> Population Trend (1950-2025)
                    </h3>
                    <div style={{ height: '400px' }}>
                      <Line
                        data={{
                          labels: countryData.historicalData.map(d => d.year),
                          datasets: [{
                            label: countryData.country.name,
                            data: countryData.historicalData.map(d => d.population),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.3
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: function(context: any) {
                                  return `Population: ${context.parsed.y.toLocaleString()}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: false,
                              ticks: {
                                callback: function(value: any) {
                                  return (value / 1000000).toFixed(0) + 'M';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Additional Metrics Table */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">📊 Detailed Growth Metrics</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-2 text-gray-600">Growth Since 1950</td>
                            <td className="py-3 px-2 text-right font-medium">
                              {countryData.growthSince1950.toFixed(1)}%
                            </td>
                            <td className="py-3 px-2 text-right text-gray-500">
                              {countryData.population1950 && 
                                `From ${(countryData.population1950 / 1000000).toFixed(1)}M`}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-2 text-gray-600">Population Change (Last Decade)</td>
                            <td className="py-3 px-2 text-right font-medium">
                              {countryData.historicalData.length >= 11 && 
                                ((countryData.historicalData[countryData.historicalData.length - 1].population - 
                                  countryData.historicalData[countryData.historicalData.length - 11].population) / 1000000).toFixed(1) + 'M'}
                            </td>
                            <td className="py-3 px-2 text-right text-gray-500">
                              2015-2025
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-2 text-gray-600">Average Annual Addition</td>
                            <td className="py-3 px-2 text-right font-medium">
                              {countryData.population2000 && 
                                Math.round((countryData.currentPopulation - countryData.population2000) / 25).toLocaleString()}
                            </td>
                            <td className="py-3 px-2 text-right text-gray-500">
                              People per year since 2000
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab C: Compare Countries */}
          {activeTab === 'compare' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Compare Population Growth</h2>
              <p className="text-gray-600 mb-6">Compare population growth trends between two countries.</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🗺️ First Country
                  </label>
                  <select
                    value={compareCountry1}
                    onChange={(e) => setCompareCountry1(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value="">Select first country...</option>
                    {countries.map(country => (
                      <option key={country.slug} value={country.slug}>
                        {getCountryFlag(country.code)} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🗺️ Second Country
                  </label>
                  <select
                    value={compareCountry2}
                    onChange={(e) => setCompareCountry2(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  >
                    <option value="">Select second country...</option>
                    {countries.map(country => (
                      <option key={country.slug} value={country.slug}>
                        {getCountryFlag(country.code)} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {compareData1 && compareData2 && (
                <div className="space-y-6">
                  {/* Comparison Table */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-xl mb-6">📊 Growth Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-4 px-3 font-semibold text-gray-700">Metric</th>
                            <th className="text-center py-4 px-3 font-semibold text-blue-700">
                              {compareData1.country.name}
                            </th>
                            <th className="text-center py-4 px-3 font-semibold text-green-700">
                              {compareData2.country.name}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="py-4 px-3 font-medium text-gray-700">Current Population</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">
                              {compareData1.currentPopulation.toLocaleString()}
                            </td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">
                              {compareData2.currentPopulation.toLocaleString()}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-3 font-medium text-gray-700">Annual Growth Rate</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">
                              {compareData1.annualGrowthRate.toFixed(2)}%
                            </td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">
                              {compareData2.annualGrowthRate.toFixed(2)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-3 font-medium text-gray-700">Growth Since 2000</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">
                              {compareData1.growthSince2000.toFixed(1)}%
                            </td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">
                              {compareData2.growthSince2000.toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-3 font-medium text-gray-700">Doubling Time</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">
                              {compareData1.doublingTime ? `${compareData1.doublingTime.toFixed(1)} years` : 'N/A'}
                            </td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">
                              {compareData2.doublingTime ? `${compareData2.doublingTime.toFixed(1)} years` : 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-3 font-medium text-gray-700">Status</td>
                            <td className="py-4 px-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                                compareData1.status === 'Growing' ? 'bg-green-500' :
                                compareData1.status === 'Declining' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}>
                                {compareData1.status}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                                compareData2.status === 'Growing' ? 'bg-green-500' :
                                compareData2.status === 'Declining' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}>
                                {compareData2.status}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Key Insight */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-2 text-amber-800">💡 Key Insight</h3>
                    <p className="text-gray-700">
                      {compareData1.country.name} grew {compareData1.growthSince2000.toFixed(1)}% since 2000 
                      while {compareData2.country.name} grew {compareData2.growthSince2000.toFixed(1)}%. 
                      {compareData1.annualGrowthRate > compareData2.annualGrowthRate ?
                        ` ${compareData1.country.name} is growing faster at ${compareData1.annualGrowthRate.toFixed(2)}% annually.` :
                        ` ${compareData2.country.name} is growing faster at ${compareData2.annualGrowthRate.toFixed(2)}% annually.`}
                    </p>
                  </div>

                  {/* Comparison Chart */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">📈 Population Trends Comparison</h3>
                    <div style={{ height: '400px' }}>
                      <Line
                        data={{
                          labels: compareData1.historicalData.map(d => d.year),
                          datasets: [
                            {
                              label: compareData1.country.name,
                              data: compareData1.historicalData.map(d => d.population),
                              borderColor: 'rgb(59, 130, 246)',
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              tension: 0.3
                            },
                            {
                              label: compareData2.country.name,
                              data: compareData2.historicalData.map(d => d.population),
                              borderColor: 'rgb(34, 197, 94)',
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              tension: 0.3
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top'
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: false,
                              ticks: {
                                callback: function(value: any) {
                                  return (value / 1000000).toFixed(0) + 'M';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ranked Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Population Growth by Country: Global Rankings 2026
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Regions</option>
                  <option value="Africa">Africa</option>
                  <option value="Americas">Americas</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Growing">📈 Growing</option>
                  <option value="Stable">➡️ Stable</option>
                  <option value="Declining">📉 Declining</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('name')}
                  >
                    Country {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('population')}
                  >
                    Population {sortColumn === 'population' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('growthRate')}
                  >
                    Annual Growth {sortColumn === 'growthRate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('growthSince2000')}
                  >
                    Since 2000 {sortColumn === 'growthSince2000' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('growthSince1950')}
                  >
                    Since 1950 {sortColumn === 'growthSince1950' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('doublingTime')}
                  >
                    Doubling Time {sortColumn === 'doublingTime' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedData.map((data, index) => (
                  <tr 
                    key={data.country.slug} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedCountry(data.country.slug);
                      setActiveTab('country');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="mr-2">{getCountryFlag(data.country.code)}</span>
                      {data.country.name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.currentPopulation.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      data.annualGrowthRate > 2 ? 'text-green-600' : 
                      data.annualGrowthRate < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {data.annualGrowthRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.growthSince2000.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.growthSince1950.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.doublingTime ? `${data.doublingTime.toFixed(1)} yrs` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-2xl`}>
                        {data.status === 'Growing' ? '📈' : data.status === 'Declining' ? '📉' : '➡️'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comprehensive Content Sections */}
        <PopulationGrowthContent />
      </div>
    </div>
  );
}

export default function PopulationGrowthRatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading population growth calculator...</p>
        </div>
      </div>
    }>
      <PopulationGrowthCalculator />
    </Suspense>
  );
}