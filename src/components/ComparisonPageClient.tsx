'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SideBySidePyramids from '@/components/SideBySidePyramids';
import AnimatedComparisonPyramids from '@/components/AnimatedComparisonPyramids';
import SuperimposedPyramid from '@/components/SuperimposedPyramid';
import SexRatioComparison from '@/components/SexRatioComparison';
import DemographicMetricsComparison from '@/components/DemographicMetricsComparison';
import KeyMetricsDashboard from '@/components/KeyMetricsDashboard';
import FertilityTimelineChart from '@/components/FertilityTimelineChart';
import PopulationMilestoneChart from '@/components/PopulationMilestoneChart';
import ComparisonFAQ from '@/components/ComparisonFAQ';
import ComparisonStructuredData from '@/components/ComparisonStructuredData';
import { calculateMetrics } from '@/lib/calculations';
import type { CountryData, YearData } from '@/types/population';
import populationRankings from '@/data/population-rankings-2025.json';

interface ComparisonPageClientProps {
  comparison: string;
  country1Slug: string;
  country2Slug: string;
  country1Name: string;
  country2Name: string;
}

export default function ComparisonPageClient({
  comparison,
  country1Slug,
  country2Slug,
  country1Name,
  country2Name
}: ComparisonPageClientProps) {
  const [country1Data, setCountry1Data] = useState<CountryData | null>(null);
  const [country2Data, setCountry2Data] = useState<CountryData | null>(null);
  const [country1Fertility, setCountry1Fertility] = useState<any>(null);
  const [country2Fertility, setCountry2Fertility] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load both country data and fertility files
        const [data1, data2, fertility1, fertility2] = await Promise.all([
          import(`@/data/population/${country1Slug}.json`),
          import(`@/data/population/${country2Slug}.json`),
          import(`@/data/fertility/${country1Slug}.json`),
          import(`@/data/fertility/${country2Slug}.json`)
        ]);
        
        setCountry1Data(data1.default);
        setCountry2Data(data2.default);
        setCountry1Fertility(fertility1.default?.fertilityData || null);
        setCountry2Fertility(fertility2.default?.fertilityData || null);
      } catch (error) {
        console.error('Error loading country data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [country1Slug, country2Slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (!country1Data || !country2Data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading country data</p>
        </div>
      </div>
    );
  }

  const currentYear1Data = country1Data.years[selectedYear] || country1Data.years[2024];
  const currentYear2Data = country2Data.years[selectedYear] || country2Data.years[2024];
  const metrics1 = calculateMetrics(currentYear1Data);
  const metrics2 = calculateMetrics(currentYear2Data);

  // Helper function to format population with appropriate units
  const formatPopulation = (population: number) => {
    if (population >= 1_000_000_000) {
      return `${(population / 1_000_000_000).toFixed(2)}B`;
    } else {
      return `${(population / 1_000_000).toFixed(0)}M`;
    }
  };

  // Get related comparisons based on current comparison
  const getRelatedComparisons = (currentComparison: string, country1: string, country2: string) => {
    const allComparisons = [
      { url: 'china-vs-india', title: 'China vs India', description: 'World\'s most populous rivalry' },
      { url: 'usa-vs-china', title: 'USA vs China', description: 'Superpower demographic dynamics' },
      { url: 'usa-vs-india', title: 'USA vs India', description: 'Democracy demographic comparison' },
      { url: 'usa-vs-russia', title: 'USA vs Russia', description: 'Cold War demographic legacy' },
      { url: 'usa-vs-brazil', title: 'USA vs Brazil', description: 'Americas powerhouses' },
      { url: 'usa-vs-indonesia', title: 'USA vs Indonesia', description: 'Pacific powerhouses' },
      { url: 'india-vs-indonesia', title: 'India vs Indonesia', description: 'Asian giants comparison' },
      { url: 'india-vs-brazil', title: 'India vs Brazil', description: 'Global South powers' },
      { url: 'china-vs-brazil', title: 'China vs Brazil', description: 'East-West powerhouses' },
      { url: 'usa-vs-mexico', title: 'USA vs Mexico', description: 'North American neighbors' },
      { url: 'usa-vs-uk', title: 'USA vs UK', description: 'Anglo-American alliance' },
      { url: 'uk-vs-germany', title: 'UK vs Germany', description: 'European powerhouses' },
      { url: 'uk-vs-france', title: 'UK vs France', description: 'Channel neighbors' },
      { url: 'japan-vs-germany', title: 'Japan vs Germany', description: 'Aging superpowers' },
      { url: 'india-vs-pakistan', title: 'India vs Pakistan', description: 'Partition legacy' },
      { url: 'india-vs-bangladesh', title: 'India vs Bangladesh', description: 'Bengal division demographics' }
    ];

    // Filter out current comparison and find related ones
    const related = allComparisons
      .filter(comp => comp.url !== currentComparison)
      .filter(comp => {
        // Show comparisons involving either country
        const [c1, c2] = comp.url.split('-vs-');
        const country1Lower = country1.toLowerCase();
        const country2Lower = country2.toLowerCase();
        return (
          c1.includes(country1Lower.split(' ')[0].toLowerCase()) || 
          c1.includes(country2Lower.split(' ')[0].toLowerCase()) ||
          c2.includes(country1Lower.split(' ')[0].toLowerCase()) || 
          c2.includes(country2Lower.split(' ')[0].toLowerCase())
        );
      });

    // If not enough related found, add some popular ones
    if (related.length < 3) {
      const popular = allComparisons.filter(comp => 
        comp.url !== currentComparison && 
        !related.some(r => r.url === comp.url)
      ).slice(0, 6 - related.length);
      related.push(...popular);
    }

    return related.slice(0, 6);
  };

  // Custom content for specific comparisons
  const renderCustomContent = () => {
    if (comparison === 'china-vs-india') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">China vs India: The World's Population Giants</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In 2023, India overtook China as the world's most populous country, marking a historic demographic shift that ended China's decades-long reign at the top. 
              As of 2025, India's population stands at approximately {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`}, 
              while China's population has begun its anticipated decline to {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`}.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This comparison reveals two nations at different stages of demographic transition: India with its youthful population and continued growth trajectory, 
              and China grappling with rapid aging and the long-term effects of its former one-child policy. These contrasting demographic profiles will shape 
              both nations' economic prospects, social policies, and global influence for decades to come.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids below tell a compelling story of divergent demographic destinies. China's narrow base reflects declining birth rates 
              and an aging society, while India's broader base indicates a younger population with significant growth momentum remaining.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Key Demographic Milestones</h3>
            <ul className="space-y-2">
              <li>• <strong>April 2023:</strong> India surpasses China as world's most populous nation</li>
              <li>• <strong>2022:</strong> China records first population decline in 60 years</li>
              <li>• <strong>Median Age Gap:</strong> China ({metrics1.medianAge.toFixed(1)} years) is {(metrics1.medianAge - metrics2.medianAge).toFixed(1)} years older than India ({metrics2.medianAge.toFixed(1)} years)</li>
              <li>• <strong>Working Age Population:</strong> India has {((metrics2.workingAgePopulation - metrics1.workingAgePopulation) / 1_000_000).toFixed(0)} million more working-age people</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'usa-vs-china') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">USA vs China: Contrasting Demographic Trajectories</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United States and China represent the world's two largest economies with vastly different demographic profiles. 
              As of 2025, China's population of {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} is over four times larger than 
              the USA's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`}, yet both nations face unique demographic challenges that will shape their future.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              China is experiencing rapid aging and population decline after decades of restrictive family planning policies, with its working-age population shrinking since 2015. 
              Meanwhile, the United States maintains relative demographic stability through higher birth rates and continued immigration, though it too faces an aging Baby Boomer generation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids reveal striking differences: China's diamond shape with a narrow base signals demographic crisis ahead, 
              while America's more balanced structure, sustained by immigration and higher fertility rates, suggests greater demographic resilience for the coming decades.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Critical Demographic Differences</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> China has 4.1x the population of the USA ({(metrics2.totalPopulation / 1_000_000).toFixed(0)}M vs {(metrics1.totalPopulation / 1_000_000).toFixed(0)}M)</li>
              <li>• <strong>Median Age:</strong> USA ({metrics1.medianAge.toFixed(1)} years) vs China ({metrics2.medianAge.toFixed(1)} years) - China is aging faster</li>
              <li>• <strong>Birth Rate Impact:</strong> USA maintains replacement-level fertility; China faces record-low birth rates</li>
              <li>• <strong>Immigration Factor:</strong> USA gains ~1 million immigrants annually; China has minimal immigration</li>
              <li>• <strong>Economic Implications:</strong> China's shrinking workforce vs USA's stable labor supply</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'usa-vs-russia') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">USA vs Russia: Former Superpowers' Demographic Divergence</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United States and Russia, Cold War rivals turned 21st-century competitors, face starkly different demographic futures. 
              The USA's {(metrics1.totalPopulation / 1_000_000).toFixed(0)} million people represent a growing, immigrant-enriched society, 
              while Russia's {(metrics2.totalPopulation / 1_000_000).toFixed(0)} million face severe population decline, potentially losing 20 million by 2050.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Russia's demographic crisis stems from multiple factors: ultra-low fertility (1.5 births per woman), 
              high mortality (especially among working-age males), brain drain, and minimal immigration. The USA maintains demographic stability 
              through immigration (1 million annually) and higher fertility (1.7 births per woman), despite also facing population aging.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids illustrate this divergence: Russia's severely pinched base and missing males from high mortality create 
              an unstable structure, while America's more columnar shape with consistent immigration flows suggests sustained demographic strength 
              that underpins its continued global influence.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Geopolitical Demographic Implications</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Trajectory:</strong> USA growing (+0.4% annually) vs Russia declining (-0.2% annually)</li>
              <li>• <strong>Size Difference:</strong> USA has {((metrics1.totalPopulation - metrics2.totalPopulation) / 1_000_000).toFixed(0)} million more people (2.4x Russia's population)</li>
              <li>• <strong>Gender Imbalance:</strong> Russia has world's largest gender gap - 10.5 million more women than men</li>
              <li>• <strong>Life Expectancy Gap:</strong> American males live 10 years longer than Russian males (76 vs 66 years)</li>
              <li>• <strong>Military Demographics:</strong> USA has 2x more military-age males despite Russia's conscription</li>
              <li>• <strong>Economic Impact:</strong> Russia loses 700,000 working-age people annually; USA gains 1 million</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'usa-vs-india') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">USA vs India: Democracy's Demographic Divide</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United States and India, the world's oldest and largest democracies respectively, showcase dramatically different demographic realities. 
              India's population of {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} dwarfs the USA's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} by a factor of 4.2, 
              yet these nations represent opposite ends of the development spectrum - one a mature economy with aging population, the other a young nation poised for growth.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The median age gap tells the story: Americans at {metrics1.medianAge.toFixed(1)} years are nearly a decade older than Indians at {metrics2.medianAge.toFixed(1)} years. 
              India's demographic dividend - with 65% of its population under 35 - offers enormous economic potential, while the USA relies on immigration 
              and higher productivity to maintain its economic edge despite an aging workforce.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Their population pyramids reveal these contrasts starkly: India's broad-based pyramid indicates continued growth momentum with {((metrics2.youthPopulation / metrics2.totalPopulation) * 100).toFixed(1)}% under 15, 
              while the USA's columnar structure with {((metrics1.elderlyPopulation / metrics1.totalPopulation) * 100).toFixed(1)}% over 65 reflects a mature, stable demographic profile sustained by consistent immigration flows.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Demographic Contrasts & Opportunities</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Gap:</strong> India has {((metrics2.totalPopulation - metrics1.totalPopulation) / 1_000_000).toFixed(0)} million more people than the USA</li>
              <li>• <strong>Age Advantage:</strong> India's median age ({metrics2.medianAge.toFixed(1)}) is {(metrics1.medianAge - metrics2.medianAge).toFixed(1)} years younger than USA's ({metrics1.medianAge.toFixed(1)})</li>
              <li>• <strong>Growth Dynamics:</strong> India growing at ~0.7% annually; USA at ~0.4% (largely through immigration)</li>
              <li>• <strong>Economic Context:</strong> USA GDP per capita ~$80,000 vs India's ~$2,700 - a 30x difference</li>
              <li>• <strong>Workforce Potential:</strong> India adds 12 million to working age annually; USA adds 1 million</li>
              <li>• <strong>Urbanization Gap:</strong> USA 83% urban vs India 36% urban - different development stages</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'usa-vs-brazil') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">USA vs Brazil: Americas Economic Giants' Demographic Contrast</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United States and Brazil, the two largest economies in the Americas, showcase fascinating demographic contrasts. 
              The USA's {(metrics1.totalPopulation / 1_000_000).toFixed(0)} million people represent a mature, diverse economy with controlled growth, 
              while Brazil's {(metrics2.totalPopulation / 1_000_000).toFixed(0)} million inhabitants reflect a younger, rapidly urbanizing society transitioning to economic development.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Brazil's demographic dividend is evident in its younger population (median age {metrics2.medianAge.toFixed(1)} vs USA's {metrics1.medianAge.toFixed(1)}), 
              while the USA benefits from higher productivity and established infrastructure. Brazil maintains higher fertility rates ({(country2Fertility?.current?.totalFertilityRate || 1.8).toFixed(1)} vs {(country1Fertility?.current?.totalFertilityRate || 1.7).toFixed(1)}), 
              suggesting continued population growth, while both countries face the challenge of aging populations in coming decades.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The demographic trajectories of these two giants will significantly impact global economics, trade, and regional leadership in the 21st century. 
              Brazil's youthful workforce offers massive potential for economic expansion, while the USA's immigration-driven growth provides 
              economic stability and innovation capacity.
            </p>
          </section>

          {/* Quick Comparison Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Americas Demographics at a Glance</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Gap:</strong> USA has {((metrics1.totalPopulation - metrics2.totalPopulation) / 1_000_000).toFixed(0)} million more people (1.6x Brazil's size)</li>
              <li>• <strong>Age Structure:</strong> Brazil median age ({metrics2.medianAge.toFixed(1)}) is {(metrics1.medianAge - metrics2.medianAge).toFixed(1)} years younger than USA's ({metrics1.medianAge.toFixed(1)})</li>
              <li>• <strong>Growth Patterns:</strong> Brazil growing at ~0.8% annually; USA at ~0.4% (largely through immigration)</li>
              <li>• <strong>Economic Development:</strong> USA GDP per capita ~$80,000 vs Brazil's ~$11,000 - a 7x difference</li>
              <li>• <strong>Urbanization Levels:</strong> USA 83% urban vs Brazil 88% urban - both highly urbanized societies</li>
              <li>• <strong>Youth Opportunity:</strong> Brazil's {metrics2.childDependencyRatio.toFixed(1)}% child dependency vs USA's {metrics1.childDependencyRatio.toFixed(1)}%</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'usa-vs-indonesia') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">USA vs Indonesia: Pacific Rim Powerhouses' Demographic Divergence</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United States and Indonesia represent two influential Pacific Rim nations with vastly different demographic profiles. 
              The USA's {(metrics1.totalPopulation / 1_000_000).toFixed(0)} million people reflect a mature, developed economy with controlled growth, 
              while Indonesia's {(metrics2.totalPopulation / 1_000_000).toFixed(0)} million inhabitants showcase a dynamic emerging economy with youthful demographics and rapid transformation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Indonesia's demographic advantage is striking - with a median age of {metrics2.medianAge.toFixed(1)} compared to USA's {metrics1.medianAge.toFixed(1)}, 
              the world's largest archipelago nation possesses one of the most promising demographic dividends globally. This young workforce, 
              combined with increasing urbanization and economic liberalization, positions Indonesia as a rising economic power in Southeast Asia.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The contrast extends beyond demographics to development patterns: the USA's established infrastructure and high productivity versus 
              Indonesia's rapid growth potential and resource abundance. As Indonesia continues its demographic transition and economic development, 
              these two Pacific powers will play increasingly important roles in global trade, security, and economic stability.
            </p>
          </section>

          {/* Quick Comparison Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 border-l-4 border-blue-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Pacific Powerhouses at a Glance</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Gap:</strong> USA has {((metrics1.totalPopulation - metrics2.totalPopulation) / 1_000_000).toFixed(0)} million more people (1.2x Indonesia's size)</li>
              <li>• <strong>Youth Advantage:</strong> Indonesia median age ({metrics2.medianAge.toFixed(1)}) is {(metrics1.medianAge - metrics2.medianAge).toFixed(1)} years younger than USA's ({metrics1.medianAge.toFixed(1)})</li>
              <li>• <strong>Development Gap:</strong> USA GDP per capita ~$80,000 vs Indonesia's ~$5,000 - a 16x difference</li>
              <li>• <strong>Growth Dynamics:</strong> Indonesia growing at ~1.0% annually; USA at ~0.4% (largely through immigration)</li>
              <li>• <strong>Archipelago Challenge:</strong> Indonesia spans 17,500 islands with unique demographic distribution challenges</li>
              <li>• <strong>Demographic Dividend:</strong> Indonesia's {metrics2.childDependencyRatio.toFixed(1)}% child dependency vs USA's {metrics1.childDependencyRatio.toFixed(1)}% - massive workforce potential</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'india-vs-indonesia') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">India vs Indonesia: Asian Giants' Demographic Dynamics</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              India and Indonesia, the world's most populous and fourth most populous countries respectively, represent two Asian powerhouses with fascinating demographic parallels and contrasts. 
              India's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people dwarf Indonesia's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants by a factor of 5, 
              yet both nations share the challenge and opportunity of managing youthful, rapidly growing populations.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Both countries showcase the demographic dividend in action - India with a median age of {metrics1.medianAge.toFixed(1)} years and Indonesia at {metrics2.medianAge.toFixed(1)} years, 
              both significantly younger than global averages. This youth advantage positions these emerging economies for decades of potential growth, 
              provided they can create sufficient employment and educational opportunities for their expanding workforces.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The comparison reveals two nations at similar developmental stages but with different trajectories: India's continental scale and diversity versus 
              Indonesia's archipelagic geography spanning 17,500+ islands. Both face the critical transition from labor-intensive economies to knowledge-based development, 
              making their demographic management crucial for global economic stability and growth in the 21st century.
            </p>
          </section>

          {/* Quick Comparison Stats */}
          <div className="bg-gradient-to-r from-green-50 to-orange-50 border-l-4 border-green-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Asian Demographic Giants at a Glance</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> India has {((metrics1.totalPopulation - metrics2.totalPopulation) / 1_000_000).toFixed(0)} million more people (5x Indonesia's size)</li>
              <li>• <strong>Youth Advantage:</strong> Both young - India median age ({metrics1.medianAge.toFixed(1)}) vs Indonesia ({metrics2.medianAge.toFixed(1)}) - just {Math.abs(metrics1.medianAge - metrics2.medianAge).toFixed(1)} year difference</li>
              <li>• <strong>Growth Patterns:</strong> Both growing ~1.0% annually - massive workforce additions each year</li>
              <li>• <strong>Development Status:</strong> India GDP per capita ~$2,700 vs Indonesia's ~$5,000 - different development stages</li>
              <li>• <strong>Geographic Challenge:</strong> India's continental diversity vs Indonesia's island fragmentation</li>
              <li>• <strong>Global Impact:</strong> Combined 1.7+ billion people = 22% of humanity and rising economic influence</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'india-vs-brazil') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">India vs Brazil: Global South Powerhouses' Demographic Dynamics</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              India and Brazil, two of the world's largest emerging economies and BRICS partners, represent the demographic potential of the Global South. 
              India's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people dwarf Brazil's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants by nearly 7x, 
              yet both nations share similar challenges in harnessing their youthful populations for sustained economic growth.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Both countries exemplify the demographic dividend in action - India with a median age of {metrics1.medianAge.toFixed(1)} years and Brazil at {metrics2.medianAge.toFixed(1)} years, 
              both significantly younger than developed nations. This shared demographic advantage has positioned these emerging economies as key drivers of global growth, 
              innovation hubs for the developing world, and crucial voices in international forums from BRICS to G20.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The comparison reveals two nations at different scales but similar developmental trajectories: India's continental diversity and massive market potential versus 
              Brazil's resource abundance and regional leadership in Latin America. Both face critical decisions in education, urbanization, and economic policy that will determine 
              whether their demographic advantages translate into sustained prosperity and global influence in the coming decades.
            </p>
          </section>

          {/* Quick Comparison Stats */}
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 border-l-4 border-green-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Global South Giants at a Glance</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> India has {((metrics1.totalPopulation - metrics2.totalPopulation) / 1_000_000).toFixed(0)} million more people (6.8x Brazil's size)</li>
              <li>• <strong>Youth Demographics:</strong> India median age ({metrics1.medianAge.toFixed(1)}) vs Brazil ({metrics2.medianAge.toFixed(1)}) - {(Math.abs(metrics1.medianAge - metrics2.medianAge)).toFixed(1)} year difference</li>
              <li>• <strong>Development Status:</strong> Brazil higher GDP per capita (~$11,000 vs India's ~$2,700) but India larger total economy</li>
              <li>• <strong>BRICS Partnership:</strong> Both founding members driving South-South cooperation and alternative global governance</li>
              <li>• <strong>Growth Potential:</strong> Combined 1.7+ billion people representing 22% of humanity's emerging market potential</li>
              <li>• <strong>Regional Leadership:</strong> India leading South Asia, Brazil leading Latin America - different spheres of influence</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'china-vs-brazil') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">China vs Brazil: East Meets West in Demographic Transition</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              China and Brazil, two major BRICS partners, present a fascinating study in contrasting demographic trajectories. 
              China's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people represent a rapidly aging society grappling with the consequences of decades of fertility control, 
              while Brazil's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants embody Latin America's demographic potential with a still-growing, relatively youthful population.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These demographic differences reflect distinct development paths: China's manufacturing-driven economic miracle paired with strict population controls, 
              versus Brazil's resource-rich economy with more natural fertility decline. At {metrics1.medianAge.toFixed(1)} years, China's median age is significantly older than Brazil's {metrics2.medianAge.toFixed(1)} years, 
              highlighting the different stages of demographic transition between these emerging economy giants.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids tell this story vividly: China's diamond-shaped structure with its narrow base signals demographic challenges ahead, 
              while Brazil's more traditional pyramid shape with a broader foundation suggests continued growth potential and demographic dividend opportunities in the decades to come.
            </p>
          </section>

          {/* Quick Comparison Stats */}
          <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">BRICS Partners in Different Demographic Phases</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Ratio:</strong> China has {(metrics1.totalPopulation / metrics2.totalPopulation).toFixed(1)}x more people than Brazil</li>
              <li>• <strong>Age Gap:</strong> China's median age ({metrics1.medianAge.toFixed(1)} years) is {(metrics1.medianAge - metrics2.medianAge).toFixed(1)} years older than Brazil's ({metrics2.medianAge.toFixed(1)} years)</li>
              <li>• <strong>Youth Advantage:</strong> Brazil's {((metrics2.youthPopulation / metrics2.totalPopulation) * 100).toFixed(1)}% under 15 vs China's {((metrics1.youthPopulation / metrics1.totalPopulation) * 100).toFixed(1)}%</li>
              <li>• <strong>Economic Opportunity:</strong> Brazil's demographic dividend window vs China's aging workforce challenge</li>
              <li>• <strong>Global Trade:</strong> Combined economies driving South-South cooperation and BRICS influence</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'usa-vs-mexico') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">USA vs Mexico: North American Neighbors Across Demographic Divides</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United States and Mexico, separated by the Rio Grande but united by USMCA trade agreements and shared history, present a compelling tale of demographic contrast. 
              The USA's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people enjoy mature economic development and demographic stability, 
              while Mexico's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants represent a younger, growing population with significant demographic dividend potential.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This comparison reveals two nations at different development stages sharing a 3,145-kilometer border: the USA with its median age of {metrics1.medianAge.toFixed(1)} years representing post-industrial demographic patterns, 
              while Mexico at {metrics2.medianAge.toFixed(1)} years embodies the demographic dynamism of a middle-income country transitioning toward developed status. Migration flows from Mexico to the USA have shaped both nations' demographics for generations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids tell the story of divergent demographic destinies: Mexico's broader-based structure indicates continued population growth and youth energy, 
              while the USA's more cylindrical shape reflects demographic maturity sustained by immigration and relatively stable fertility rates.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">NAFTA/USMCA Neighbors: Demographic Dynamics</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Ratio:</strong> USA has {(metrics1.totalPopulation / metrics2.totalPopulation).toFixed(1)}x more people than Mexico</li>
              <li>• <strong>Age Gap:</strong> USA's median age ({metrics1.medianAge.toFixed(1)} years) is {(metrics1.medianAge - metrics2.medianAge).toFixed(1)} years older than Mexico's ({metrics2.medianAge.toFixed(1)} years)</li>
              <li>• <strong>Youth Advantage:</strong> Mexico's {((metrics2.youthPopulation / metrics2.totalPopulation) * 100).toFixed(1)}% under 15 vs USA's {((metrics1.youthPopulation / metrics1.totalPopulation) * 100).toFixed(1)}%</li>
              <li>• <strong>Migration Legacy:</strong> 37+ million Mexican-Americans contribute to USA's demographic diversity</li>
              <li>• <strong>Economic Integration:</strong> Complementary workforce structures drive cross-border trade and investment</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'usa-vs-uk') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">USA vs UK: Anglo-American Demographics Across the Atlantic</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United States and United Kingdom, bound by the "Special Relationship" forged through shared language, history, and values, present fascinating demographic parallels and contrasts. 
              The USA's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people represent the former colony that became a global superpower, 
              while the UK's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants embody the legacy of empire transitioning to modern European integration.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These demographic patterns reflect divergent paths since independence: America's continental expansion and immigration-driven growth versus Britain's more constrained geography and recent post-Brexit recalibration. 
              Both nations share similar median ages (USA {metrics1.medianAge.toFixed(1)} years, UK {metrics2.medianAge.toFixed(1)} years) indicating mature developed economies, yet differ significantly in scale and growth trajectories.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids reveal the demographic foundations of two closely allied but distinct societies: America's broader base and immigration-sustained growth versus Britain's more pronounced aging patterns and tighter population controls, 
              both navigating the challenges of post-industrial demographic transition while maintaining their influential roles in global affairs.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Special Relationship: Transatlantic Demographic Dynamics</h3>
            <ul className="space-y-2">
              <li>• <strong>Scale Difference:</strong> USA has {(metrics1.totalPopulation / metrics2.totalPopulation).toFixed(1)}x more people than the UK</li>
              <li>• <strong>Similar Maturity:</strong> Both have median ages around 40 years (USA {metrics1.medianAge.toFixed(1)}, UK {metrics2.medianAge.toFixed(1)})</li>
              <li>• <strong>Growth Contrast:</strong> USA growing through immigration vs UK's post-Brexit demographic adjustments</li>
              <li>• <strong>Colonial Legacy:</strong> Shared language and legal systems, different demographic trajectories</li>
              <li>• <strong>Allied Futures:</strong> Both facing aging populations while maintaining global influence</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'uk-vs-germany') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">UK vs Germany: European Powerhouses Post-Brexit Demographics</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United Kingdom and Germany, once closely integrated through EU membership, now represent divergent paths in European demographic and political evolution. 
              Germany's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} people make it Europe's most populous nation and economic powerhouse, 
              while the UK's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants navigate post-Brexit demographic and economic recalibration.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These demographic profiles reveal two nations at different stages of population aging: Germany's more advanced demographic transition with a median age of {metrics2.medianAge.toFixed(1)} years compared to the UK's {metrics1.medianAge.toFixed(1)} years. 
              Both face the challenges of aging societies, but Germany's more pronounced demographic decline contrasts with the UK's more stable, immigration-sustained population patterns.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids illustrate the demographic foundations of Europe's shifting power dynamics: Germany's increasingly inverted structure reflects the world's most rapidly aging major economy, 
              while Britain's relatively more balanced profile suggests greater demographic resilience as it charts its independent course outside the European Union.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">European Rivals: Post-Brexit Demographic Dynamics</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> Germany has {(metrics2.totalPopulation / metrics1.totalPopulation).toFixed(1)}x more people than the UK</li>
              <li>• <strong>Aging Gap:</strong> Germany's median age ({metrics2.medianAge.toFixed(1)} years) is {(metrics2.medianAge - metrics1.medianAge).toFixed(1)} years older than UK's ({metrics1.medianAge.toFixed(1)} years)</li>
              <li>• <strong>Demographic Divergence:</strong> Germany declining vs UK's controlled growth through immigration</li>
              <li>• <strong>Brexit Impact:</strong> Different migration patterns and EU integration levels</li>
              <li>• <strong>Economic Implications:</strong> Workforce aging affects European competitiveness differently</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'uk-vs-france') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">UK vs France: Channel Neighbors Through Demographic Transition</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The United Kingdom and France, separated by just 34 kilometers of English Channel but united by centuries of complex history, present a fascinating study in parallel demographic evolution. 
              France's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants represent Europe's demographic success story with historically high fertility and strong family policies, 
              while the UK's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people navigate post-Brexit demographic independence with continued immigration-driven growth.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These neighboring nations showcase different approaches to demographic sustainability: France's pronatalist policies and generous family support systems have maintained relatively robust fertility rates, 
              while Britain's more market-driven approach relies heavily on immigration to sustain population growth. With median ages of UK {metrics1.medianAge.toFixed(1)} years and France {metrics2.medianAge.toFixed(1)} years, 
              both nations face similar aging challenges while pursuing distinct demographic strategies.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids reveal the demographic foundations of two closely related yet independent societies: France's slightly younger profile reflects successful fertility policies and demographic vitality, 
              while Britain's structure shows the impact of Brexit-era migration changes and different approaches to population sustainability across the Channel divide.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Channel Neighbors: Cross-Border Demographic Dynamics</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> {metrics1.totalPopulation > metrics2.totalPopulation ? `UK has ${(metrics1.totalPopulation / metrics2.totalPopulation).toFixed(1)}x more people than France` : `France has ${(metrics2.totalPopulation / metrics1.totalPopulation).toFixed(1)}x more people than UK`}</li>
              <li>• <strong>Age Difference:</strong> {metrics2.medianAge > metrics1.medianAge ? `France's median age (${metrics2.medianAge.toFixed(1)} years) is ${(metrics2.medianAge - metrics1.medianAge).toFixed(1)} years older than UK's (${metrics1.medianAge.toFixed(1)} years)` : `UK's median age (${metrics1.medianAge.toFixed(1)} years) is ${(metrics1.medianAge - metrics2.medianAge).toFixed(1)} years older than France's (${metrics2.medianAge.toFixed(1)} years)`}</li>
              <li>• <strong>Brexit Impact:</strong> Different migration patterns since UK left the EU in 2020</li>
              <li>• <strong>Policy Contrast:</strong> France's family support vs UK's market-based demographic management</li>
              <li>• <strong>Cultural Exchange:</strong> Historic rivals turned modern allies sharing demographic challenges</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'japan-vs-germany') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">Japan vs Germany: The World's Fastest Aging Superpowers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Japan and Germany represent the pinnacle of demographic transition, showcasing the challenges facing the world's most rapidly aging developed economies. 
              Japan's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people lead the global aging revolution with the world's oldest population structure, 
              while Germany's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants represent Europe's demographic front-runner in confronting similar challenges.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These demographic powerhouses showcase the future that awaits many developed nations: Japan's median age of {metrics1.medianAge.toFixed(1)} years represents the world's most aged society, 
              while Germany at {metrics2.medianAge.toFixed(1)} years follows closely as Europe's most rapidly aging major economy. Both nations face unprecedented challenges of shrinking workforces, 
              expanding pension obligations, and healthcare systems strained by growing elderly populations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids tell the story of two post-industrial societies confronting demographic destiny: Japan's inverted structure with 30% over 65 signals the most advanced aging globally, 
              while Germany's similar trajectory shows how demographic decline unfolds in Europe's economic heartland, both nations serving as laboratories for managing aging societies in the 21st century.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Aging Superpowers: Demographic Leadership in Decline</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> {metrics2.totalPopulation > metrics1.totalPopulation ? `Germany has ${(metrics2.totalPopulation / metrics1.totalPopulation).toFixed(1)}x more people than Japan` : `Japan has ${(metrics1.totalPopulation / metrics2.totalPopulation).toFixed(1)}x more people than Germany`}</li>
              <li>• <strong>Extreme Aging:</strong> Japan's {metrics1.medianAge.toFixed(1)} years vs Germany's {metrics2.medianAge.toFixed(1)} years - world's oldest populations</li>
              <li>• <strong>Demographic Decline:</strong> Both countries experiencing population shrinkage and workforce contraction</li>
              <li>• <strong>Economic Innovation:</strong> Leading automation and robotics development to offset worker shortages</li>
              <li>• <strong>Global Implications:</strong> Demographic pioneers showing the future for all developed nations</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'india-vs-pakistan') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">India vs Pakistan: Partition's Legacy in Demographics</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              India and Pakistan, born from the traumatic partition of British India in 1947, represent one of the world's most significant demographic divides. 
              India's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people make it the world's most populous nation, 
              while Pakistan's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`} inhabitants represent the 5th largest population globally, showcasing the profound demographic consequences of political division.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These South Asian neighbors embody contrasting demographic trajectories despite shared cultural and historical roots: India's median age of {metrics1.medianAge.toFixed(1)} years reflects a nation transitioning toward demographic maturity, 
              while Pakistan at {metrics2.medianAge.toFixed(1)} years maintains one of the world's youngest populations. The partition's legacy continues to shape their demographic destinies through different governance structures, 
              economic policies, and social development approaches across the subcontinent.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids tell the story of partition's demographic inheritance: India's broader but gradually narrowing base signals demographic transition in progress, 
              while Pakistan's dramatically wide foundation with 34% under 15 represents explosive youth potential that could drive economic growth or create social challenges, 
              depending on education, employment, and governance outcomes in the coming decades.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Partition's Children: Divergent Demographic Paths</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> India has {(metrics1.totalPopulation / metrics2.totalPopulation).toFixed(1)}x more people than Pakistan ({formatPopulation(metrics1.totalPopulation)} vs {formatPopulation(metrics2.totalPopulation)})</li>
              <li>• <strong>Youth Dividend:</strong> Pakistan's {metrics2.medianAge.toFixed(1)} years vs India's {metrics1.medianAge.toFixed(1)} years median age - massive demographic opportunity</li>
              <li>• <strong>Growth Trajectories:</strong> Both still growing but Pakistan's rate exceeds India's significantly</li>
              <li>• <strong>Shared Heritage:</strong> Common culture, languages, and history despite political separation since 1947</li>
              <li>• <strong>Regional Power:</strong> Combined 1.7+ billion people representing 22% of humanity's population</li>
            </ul>
          </div>
        </>
      );
    }
    
    if (comparison === 'india-vs-bangladesh') {
      return (
        <>
          {/* Introduction Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6">India vs Bangladesh: From Bengal Division to Demographic Divergence</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              India and Bangladesh share one of the world's most complex demographic relationships, rooted in the painful partition of Bengal and subsequent liberation struggles. 
              India's {metrics1.totalPopulation >= 1_000_000_000 ? `${(metrics1.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics1.totalPopulation / 1_000_000).toFixed(0)} million`} people dwarf Bangladesh's {metrics2.totalPopulation >= 1_000_000_000 ? `${(metrics2.totalPopulation / 1_000_000_000).toFixed(2)} billion` : `${(metrics2.totalPopulation / 1_000_000).toFixed(0)} million`}, 
              yet Bangladesh achieves remarkable population density at 1,265 people per km² compared to India's 464, making it one of the world's most densely populated countries despite its small size.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              These South Asian neighbors represent fascinating demographic contrasts within shared cultural heritage: India's median age of {metrics1.medianAge.toFixed(1)} years reflects its gradual demographic transition, 
              while Bangladesh at {metrics2.medianAge.toFixed(1)} years showcases rapid development progress that has dramatically reduced birth rates from 6.9 births per woman in 1975 to current levels. 
              Bangladesh's demographic transition has been among the fastest in history, defying predictions and achieving remarkable social progress.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The population pyramids tell the story of divergent development paths: India's broader base reflects continued growth momentum across a massive diverse nation, 
              while Bangladesh's narrowing foundation signals a remarkable demographic transition achieved through innovative family planning, women's empowerment, and economic development, 
              creating a model for rapid fertility decline in developing nations worldwide.
            </p>
          </section>

          {/* Key Insights Box */}
          <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">Bengal Legacy: Density, Development, and Demographics</h3>
            <ul className="space-y-2">
              <li>• <strong>Population Scale:</strong> India has {(metrics1.totalPopulation / metrics2.totalPopulation).toFixed(1)}x more people than Bangladesh ({formatPopulation(metrics1.totalPopulation)} vs {formatPopulation(metrics2.totalPopulation)})</li>
              <li>• <strong>Density Champion:</strong> Bangladesh (1,265/km²) is 2.7x denser than India (464/km²) - among world's highest</li>
              <li>• <strong>Transition Speed:</strong> Bangladesh's fertility decline from 6.9 to 2.0 births per woman faster than most nations</li>
              <li>• <strong>Shared Heritage:</strong> Common Bengali culture, language, and traditions spanning borders</li>
              <li>• <strong>Development Models:</strong> Different approaches to managing population growth and economic progress</li>
            </ul>
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Structured Data for SEO */}
      <ComparisonStructuredData
        country1Name={country1Name}
        country2Name={country2Name}
        country1Pop={currentYear1Data.totalPopulation}
        country2Pop={currentYear2Data.totalPopulation}
        comparison={comparison}
        year={selectedYear}
      />
      
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li><Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href="/compare" className="text-blue-600 hover:text-blue-800">Compare</Link></li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-600">{country1Name} vs {country2Name}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {country1Name} vs {country2Name}: Population Comparison
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Comprehensive demographic analysis and population pyramid comparison with 2025 UN data
        </p>

        {/* Key Metrics Dashboard */}
        {country1Fertility && country2Fertility && (
          <KeyMetricsDashboard
            country1Data={currentYear1Data}
            country2Data={currentYear2Data}
            country1Name={country1Name}
            country2Name={country2Name}
            country1Slug={country1Slug}
            country2Slug={country2Slug}
            fertility1={country1Fertility.current.totalFertilityRate}
            fertility2={country2Fertility.current.totalFertilityRate}
            year={selectedYear}
          />
        )}

        {/* Custom Introduction Content */}
        {renderCustomContent()}

        {/* Population Milestone Chart - When India Overtook China */}
        <section className="mb-16">
          <PopulationMilestoneChart
            country1Data={country1Data}
            country2Data={country2Data}
            country1Name={country1Name}
            country2Name={country2Name}
          />
        </section>

        {/* Fertility Timeline Chart */}
        {country1Fertility && country2Fertility && (
          <section className="mb-16">
            <FertilityTimelineChart
              country1Fertility={country1Fertility}
              country2Fertility={country2Fertility}
              country1Name={country1Name}
              country2Name={country2Name}
            />
          </section>
        )}

        {/* Section 1: Static Side-by-Side Pyramids */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Population Pyramids 2025 - Side by Side</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SideBySidePyramids
              country1Data={currentYear1Data}
              country2Data={currentYear2Data}
              country1Name={country1Name}
              country2Name={country2Name}
              year={selectedYear}
            />
          </div>
          
          {/* Analysis of static pyramids */}
          <div className="mt-6 prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold mb-3">Population Structure Analysis</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The 2025 population pyramids reveal striking differences between {country1Name} and {country2Name}. 
              {country1Name}'s pyramid shows {metrics1.pyramidType === 'constrictive' ? 'a constrictive pattern with a narrow base, indicating declining birth rates and an aging population' : 
                metrics1.pyramidType === 'expansive' ? 'an expansive pattern with a broad base, indicating high birth rates and a young population' : 
                'a stationary pattern suggesting stable population growth'}.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In contrast, {country2Name} displays {metrics2.pyramidType === 'constrictive' ? 'a constrictive pyramid characteristic of developed nations with low fertility' : 
                metrics2.pyramidType === 'expansive' ? 'an expansive pyramid typical of developing nations with high fertility and mortality rates' : 
                'a stationary pyramid indicating balanced demographic trends'}.
              The youth dependency ratio in {country2Name} ({metrics2.childDependencyRatio.toFixed(1)}) 
              {metrics2.childDependencyRatio > metrics1.childDependencyRatio ? ' exceeds' : ' is lower than'} that 
              of {country1Name} ({metrics1.childDependencyRatio.toFixed(1)}), highlighting different demographic pressures.
            </p>
          </div>
        </section>

        {/* Section 2: Animated Synchronized Pyramids */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Historical Evolution - Animated Comparison</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AnimatedComparisonPyramids
              country1Data={country1Data}
              country2Data={country2Data}
              country1Name={country1Name}
              country2Name={country2Name}
            />
          </div>
          
          {/* Historical analysis */}
          <div className="mt-6 prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold mb-3">Demographic Transitions Over Time</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The animated comparison from 1950 to 2025 reveals how both nations have undergone dramatic demographic transformations. 
              {country1Name} experienced rapid population growth in the mid-20th century, followed by 
              {country1Name === 'China' ? ' the implementation of the one-child policy in 1979, which dramatically reshaped its age structure' : 
               ' demographic changes driven by economic development and urbanization'}.
            </p>
            <p className="text-gray-700 leading-relaxed">
              {country2Name}'s demographic journey shows 
              {country2Name === 'India' ? ' sustained high fertility rates through the 1970s and 1980s, with gradual fertility decline accelerating in recent decades' : 
               ' its unique path through the demographic transition, influenced by economic, social, and policy factors'}.
              The convergence or divergence of these pyramids over time illustrates how different development paths and policy choices shape population structures.
            </p>
          </div>
        </section>

        {/* Section 3: Superimposed Overlay */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Direct Overlay Comparison</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SuperimposedPyramid
              country1Data={currentYear1Data}
              country2Data={currentYear2Data}
              country1Name={country1Name}
              country2Name={country2Name}
              year={selectedYear}
            />
          </div>
          
          {/* Overlay analysis */}
          <div className="mt-6 prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold mb-3">Where Populations Diverge</h3>
            <p className="text-gray-700 leading-relaxed">
              The superimposed view highlights critical divergence points in the age structures. 
              The most significant differences appear in the {
                metrics1.youthPopulation > metrics2.youthPopulation ? 
                `younger age groups, where ${country1Name} has ${((metrics1.youthPopulation - metrics2.youthPopulation) / 1_000_000).toFixed(1)} million more youth (0-14 years)` :
                `younger age groups, where ${country2Name} has ${((metrics2.youthPopulation - metrics1.youthPopulation) / 1_000_000).toFixed(1)} million more youth (0-14 years)`
              }. This youth bulge has profound implications for education systems, job creation, and future economic growth.
            </p>
          </div>
        </section>

        {/* Section 4: Sex Ratio Deep Dive */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Sex Ratio Analysis</h2>
          <SexRatioComparison
            country1Data={country1Data}
            country2Data={country2Data}
            country1Name={country1Name}
            country2Name={country2Name}
            currentYear={selectedYear}
          />
        </section>

        {/* Section 5: Demographic Metrics Comparison */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Key Demographic Indicators</h2>
          <DemographicMetricsComparison
            metrics1={metrics1}
            metrics2={metrics2}
            country1Name={country1Name}
            country2Name={country2Name}
          />
        </section>

        {/* Section 6: Future Projections */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Future Population Projections</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">{country1Name} Projections</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">2030</span>
                    <span className="font-semibold">
                      {country1Data.years[2030] ? 
                        formatPopulation(country1Data.years[2030].totalPopulation) : 
                        'Data pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">2040</span>
                    <span className="font-semibold">
                      {country1Data.years[2040] ? 
                        formatPopulation(country1Data.years[2040].totalPopulation) : 
                        'Data pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">2050</span>
                    <span className="font-semibold">
                      {country1Data.years[2050] ? 
                        formatPopulation(country1Data.years[2050].totalPopulation) : 
                        'Data pending'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">{country2Name} Projections</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">2030</span>
                    <span className="font-semibold">
                      {country2Data.years[2030] ? 
                        formatPopulation(country2Data.years[2030].totalPopulation) : 
                        'Data pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">2040</span>
                    <span className="font-semibold">
                      {country2Data.years[2040] ? 
                        formatPopulation(country2Data.years[2040].totalPopulation) : 
                        'Data pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">2050</span>
                    <span className="font-semibold">
                      {country2Data.years[2050] ? 
                        formatPopulation(country2Data.years[2050].totalPopulation) : 
                        'Data pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Population projections through 2050 suggest continued divergence between {country1Name} and {country2Name}. 
              These projections, based on current fertility rates, mortality trends, and migration patterns, indicate 
              {comparison === 'china-vs-india' ? 
                ' that India will continue to grow while China faces sustained population decline, fundamentally altering the global demographic landscape' :
                ' significant shifts in relative population sizes and age structures that will impact labor markets, economic growth, and geopolitical influence'
              }.
            </p>
          </div>
        </section>

        {/* 2026 Update Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">2026 Data Update Coming Soon</h3>
              <p className="text-yellow-700">
                {country1Name} vs {country2Name} population 2026 comparison will be updated in July 2026 when the UN releases new population data 
                for {country1Name} and {country2Name}. Bookmark this page to get the latest demographic comparison and analysis.
              </p>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const bookmarkURL = window.location.href;
                    const bookmarkTitle = document.title;
                    
                    if (window.sidebar && window.sidebar.addPanel) {
                      window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
                    } else if (window.external && ('AddFavorite' in window.external)) {
                      (window.external as any).AddFavorite(bookmarkURL, bookmarkTitle);
                    } else {
                      alert('Press Ctrl+D (Cmd+D on Mac) to bookmark this page');
                    }
                  }
                }}
                className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
              >
                Bookmark This Page
              </button>
            </div>
          </div>
        </div>

        {/* Related Comparisons */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Related Comparisons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRelatedComparisons(comparison, country1Name, country2Name).map((relatedComp) => (
              <Link
                key={relatedComp.url}
                href={`/compare/${relatedComp.url}`}
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{relatedComp.title}</h3>
                <p className="text-sm text-gray-600">{relatedComp.description}</p>
                <div className="mt-2 text-blue-600 text-sm font-medium">
                  Compare →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        {country1Fertility && country2Fertility && (
          <section className="mb-16">
            <ComparisonFAQ
              comparison={comparison}
              country1Name={country1Name}
              country2Name={country2Name}
              country1Pop2025={currentYear1Data.totalPopulation}
              country2Pop2025={currentYear2Data.totalPopulation}
              country1Fertility={country1Fertility.current.totalFertilityRate}
              country2Fertility={country2Fertility.current.totalFertilityRate}
              country1MedianAge={currentYear1Data.medianAge}
              country2MedianAge={currentYear2Data.medianAge}
            />
          </section>
        )}

        {/* Links to Individual Country Pages */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">Explore Individual Country Data</h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              href={`/${country1Slug}`}
              className="bg-blue-50 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-100 transition"
            >
              View {country1Name} Population Pyramid →
            </Link>
            <Link 
              href={`/${country2Slug}`}
              className="bg-green-50 text-green-700 px-6 py-3 rounded-lg hover:bg-green-100 transition"
            >
              View {country2Name} Population Pyramid →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}