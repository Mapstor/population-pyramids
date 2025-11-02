import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

interface ContentSections {
  understanding: string;
  ageDistribution: string;
  historicalChanges: string;
  futureTrends: string;
  comparison: string;
  faqs: Array<{ question: string; answer: string }>;
}

export function generateCountryContent(
  countryName: string,
  currentYearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData
): ContentSections {
  
  const pyramidType = metrics.pyramidType;
  const years = Object.keys(countryData.years).map(Number).sort();
  const oldestYear = Math.min(...years);
  const oldestYearData = countryData.years[oldestYear.toString()];
  
  // Calculate growth
  const populationGrowth = ((currentYearData.totalPopulation - oldestYearData.totalPopulation) / oldestYearData.totalPopulation) * 100;
  const medianAgeChange = currentYearData.medianAge - oldestYearData.medianAge;

  return {
    understanding: generateUnderstandingSection(countryName, metrics, pyramidType, currentYearData),
    ageDistribution: generateAgeDistributionSection(countryName, metrics, currentYearData),
    historicalChanges: generateHistoricalSection(countryName, populationGrowth, medianAgeChange, oldestYear, currentYearData.year),
    futureTrends: generateFutureTrendsSection(countryName, metrics, pyramidType),
    comparison: generateComparisonSection(countryName, metrics),
    faqs: generateFAQs(countryName, currentYearData, metrics, populationGrowth)
  };
}

function generateUnderstandingSection(
  countryName: string,
  metrics: DemographicMetrics,
  pyramidType: string,
  yearData: YearData
): string {
  const pyramidDescriptions = {
    expansive: `${countryName}'s population pyramid displays an expansive structure, characterized by a broad base that gradually narrows toward the top. This classic pyramid shape indicates a young, rapidly growing population with high birth rates and relatively lower life expectancy. The wide base represents a large proportion of children and young adults, suggesting that ${countryName} has significant demographic momentum for continued population growth in the coming decades. This type of age structure is common in developing nations and presents both opportunities and challenges for economic development, education systems, and healthcare infrastructure.`,
    
    constrictive: `${countryName}'s population pyramid exhibits a constrictive or inverted structure, with a narrow base and a bulging middle and upper section. This age distribution pattern indicates a mature, aging population with declining birth rates and increasing life expectancy. The smaller proportion of young people compared to middle-aged and elderly populations suggests that ${countryName} is experiencing demographic transition typical of developed nations. This age structure presents significant implications for pension systems, healthcare costs, labor force dynamics, and economic growth potential.`,
    
    stationary: `${countryName}'s population pyramid shows a stationary or columnar structure, with relatively uniform width from bottom to top until the elderly age groups. This balanced age distribution indicates that ${countryName} has achieved demographic stability, with birth rates and death rates in relative equilibrium. The population is neither growing rapidly nor declining significantly. This demographic pattern represents a transition phase that many countries experience as they develop economically and socially, moving from high to low birth and death rates.`
  };

  return pyramidDescriptions[pyramidType as keyof typeof pyramidDescriptions] || 
    `${countryName}'s population pyramid provides insight into the country's demographic structure and trends.`;
}

function generateAgeDistributionSection(
  countryName: string,
  metrics: DemographicMetrics,
  yearData: YearData
): string {
  return `The age distribution of ${countryName}'s population reveals important demographic characteristics. The youth population (ages 0-14) comprises ${metrics.youthPercentage.toFixed(1)}% of the total, representing approximately ${(metrics.youthPopulation / 1000000).toFixed(1)} million individuals. This proportion of young people has significant implications for education systems, future labor force size, and long-term demographic momentum.

The working-age population (ages 15-64) accounts for ${metrics.workingAgePercentage.toFixed(1)}% of ${countryName}'s total population, totaling about ${(metrics.workingAgePopulation / 1000000).toFixed(1)} million people. This segment of the population is crucial for economic productivity, as it represents the primary labor force and tax base that supports both younger and older dependents.

The elderly population (ages 65 and above) makes up ${metrics.elderlyPercentage.toFixed(1)}% of the total, with approximately ${(metrics.elderlyPopulation / 1000000).toFixed(1)} million senior citizens. The proportion and growth rate of this age group has important implications for healthcare systems, pension programs, and social services. The median age of ${yearData.medianAge.toFixed(1)} years provides a useful summary statistic, indicating that half of ${countryName}'s population is younger than this age and half is older.`;
}

function generateHistoricalSection(
  countryName: string,
  populationGrowth: number,
  medianAgeChange: number,
  oldestYear: number,
  currentYear: number
): string {
  const growthDirection = populationGrowth > 0 ? 'increased' : 'decreased';
  const ageDirection = medianAgeChange > 0 ? 'increased' : 'decreased';
  
  return `Between ${oldestYear} and ${currentYear}, ${countryName}'s population has ${growthDirection} by ${Math.abs(populationGrowth).toFixed(1)}%, reflecting significant demographic transformation over this ${currentYear - oldestYear}-year period. This population change represents one of the most important social and economic shifts in the country's modern history.

The median age has ${ageDirection} by ${Math.abs(medianAgeChange).toFixed(1)} years during this period, indicating ${medianAgeChange > 0 ? 'population aging' : 'a younger demographic profile'}. This shift in age structure reflects changes in fertility rates, life expectancy, and migration patterns that have reshaped ${countryName}'s demographic landscape. ${medianAgeChange > 0 ? 'The aging trend suggests declining birth rates combined with improvements in healthcare and living standards that have extended life expectancy.' : 'The younger trend may reflect high birth rates or significant youth migration into the country.'}

These demographic changes have been driven by various factors including economic development, healthcare improvements, education expansion, urbanization, and changing social norms around family size. The evolution of ${countryName}'s population pyramid over these decades tells a story of social transformation and provides insights into future demographic trajectories.`;
}

function generateFutureTrendsSection(
  countryName: string,
  metrics: DemographicMetrics,
  pyramidType: string
): string {
  const futurePredictions = {
    expansive: `Based on the current expansive pyramid structure, ${countryName} is likely to experience continued population growth in the coming decades. The large proportion of young people entering reproductive age will drive natural population increase, even if fertility rates decline somewhat. This demographic momentum means that ${countryName}'s population will likely continue expanding for at least the next 20-30 years.

The economic implications are significant: a growing working-age population can provide a "demographic dividend" if adequate employment opportunities, education, and healthcare are available. However, rapid population growth also presents challenges, including the need for expanded infrastructure, education systems, housing, and job creation. Family planning policies, education levels (especially for women), and economic development will be key factors in determining how ${countryName}'s demographic trajectory evolves.`,

    constrictive: `The constrictive pyramid structure suggests that ${countryName} faces an aging population with declining or negative natural population growth. Without significant changes in birth rates or immigration patterns, the population is likely to shrink and age further in the coming decades. This demographic trend presents substantial challenges for economic growth, pension sustainability, and healthcare systems.

To address these challenges, ${countryName} may need to implement policies that encourage higher birth rates, attract immigrants, extend working lives, or increase productivity to maintain economic output with a smaller workforce. The ratio of working-age individuals to retirees will continue to decline, potentially creating fiscal pressures on social security and healthcare systems. Innovation, automation, and productivity improvements will be crucial for maintaining living standards as the population ages.`,

    stationary: `With a stationary pyramid structure, ${countryName} is likely to experience relatively stable population levels in the near term, though the direction of future trends depends on whether fertility rates remain at replacement level. Many countries with this demographic profile eventually transition toward aging populations as fertility declines and life expectancy increases.

${countryName} has an opportunity to maintain demographic balance through policies that support families, encourage sustainable birth rates, and manage migration effectively. The country should prepare for potential population aging while capitalizing on the current relatively balanced age structure. Investments in education, healthcare, and economic development during this demographic transition phase can position ${countryName} favorably for long-term prosperity.`
  };

  return futurePredictions[pyramidType as keyof typeof futurePredictions] || 
    `${countryName}'s demographic future will depend on trends in fertility, mortality, and migration.`;
}

function generateComparisonSection(countryName: string, metrics: DemographicMetrics): string {
  return `When compared to global demographic patterns, ${countryName}'s age structure provides insights into its development trajectory. Countries with similar demographic profiles often face comparable challenges and opportunities in terms of economic development, social services, and policy planning. Understanding these comparative demographics helps contextualize ${countryName}'s position within regional and global population trends.`;
}

function generateFAQs(
  countryName: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  populationGrowth: number
): Array<{ question: string; answer: string }> {
  return [
    {
      question: `What is the current population of ${countryName}?`,
      answer: `As of ${yearData.year}, ${countryName}'s population is ${yearData.totalPopulation.toLocaleString()} people. This includes ${yearData.malePopulation.toLocaleString()} males and ${yearData.femalePopulation.toLocaleString()} females, giving a sex ratio of ${metrics.sexRatio.toFixed(1)} males per 100 females.`
    },
    {
      question: `Is ${countryName}'s population growing or declining?`,
      answer: `${countryName}'s population has ${populationGrowth > 0 ? 'grown' : 'declined'} by ${Math.abs(populationGrowth).toFixed(1)}% since 1970. The current population pyramid structure suggests ${metrics.pyramidType === 'expansive' ? 'continued growth' : metrics.pyramidType === 'constrictive' ? 'potential decline' : 'relative stability'} in the coming years, driven by current birth rates, death rates, and migration patterns.`
    },
    {
      question: `What is the median age in ${countryName}?`,
      answer: `The median age in ${countryName} is ${yearData.medianAge.toFixed(1)} years, meaning half the population is younger than this age and half is older. This median age provides a useful summary of the population's age structure and is ${yearData.medianAge < 25 ? 'relatively young' : yearData.medianAge > 40 ? 'relatively old' : 'moderate'} compared to global averages.`
    },
    {
      question: `What percentage of ${countryName}'s population is elderly?`,
      answer: `Approximately ${metrics.elderlyPercentage.toFixed(1)}% of ${countryName}'s population is 65 years or older, totaling about ${(metrics.elderlyPopulation / 1000000).toFixed(2)} million people. This proportion of elderly citizens has important implications for healthcare systems, pension programs, and the old-age dependency ratio, which currently stands at ${metrics.oldAgeDependencyRatio.toFixed(1)}.`
    },
    {
      question: `How many young people live in ${countryName}?`,
      answer: `The youth population (ages 0-14) in ${countryName} comprises ${metrics.youthPercentage.toFixed(1)}% of the total population, representing approximately ${(metrics.youthPopulation / 1000000).toFixed(2)} million young people. This proportion determines the youth dependency ratio of ${metrics.childDependencyRatio.toFixed(1)}, indicating the number of young dependents per 100 working-age individuals.`
    },
    {
      question: `What is the dependency ratio in ${countryName}?`,
      answer: `${countryName}'s total dependency ratio is ${metrics.dependencyRatio.toFixed(1)}, meaning there are ${metrics.dependencyRatio.toFixed(1)} dependents (both young and old) for every 100 working-age individuals. This breaks down into a youth dependency ratio of ${metrics.childDependencyRatio.toFixed(1)} and an old-age dependency ratio of ${metrics.oldAgeDependencyRatio.toFixed(1)}, providing insights into the economic support burden on the working-age population.`
    },
    {
      question: `What type of population pyramid does ${countryName} have?`,
      answer: `${countryName} has a ${metrics.pyramidType} population pyramid, which ${metrics.pyramidType === 'expansive' ? 'indicates a young, growing population typical of developing nations with high birth rates' : metrics.pyramidType === 'constrictive' ? 'indicates an aging population typical of developed nations with low birth rates and high life expectancy' : 'indicates a stable population with balanced birth and death rates'}.`
    },
    {
      question: `How has ${countryName}'s population changed over time?`,
      answer: `Historical population data shows significant demographic evolution in ${countryName}. By examining population pyramids from different decades, we can observe changes in birth rates, life expectancy, and age structure that reflect social and economic development. These changes provide valuable context for understanding current demographic challenges and future trends.`
    }
  ];
}