import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

interface GlossaryTerm {
  term: string;
  definition: string;
  context: string;
  example: string;
}

export function generateDemographicGlossary(
  countryName: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData,
  currentYear: number
): GlossaryTerm[] {
  
  // Calculate additional context
  const totalMales = yearData.ageGroups.reduce((sum, ag) => sum + ag.male, 0);
  const totalFemales = yearData.ageGroups.reduce((sum, ag) => sum + ag.female, 0);
  const sexRatio = (totalMales / totalFemales * 100);
  const data1970 = countryData.years['1970'];
  
  const glossaryTerms: GlossaryTerm[] = [
    {
      term: 'Dependency Ratio',
      definition: 'The number of dependents (children under 15 and adults over 65) per 100 working-age people (15-64 years old).',
      context: `For ${countryName}, this means each working-age person supports ${(metrics.dependencyRatio / 100).toFixed(1)} dependents, with a dependency ratio of ${metrics.dependencyRatio.toFixed(1)}. This ${metrics.dependencyRatio > 60 ? 'high ratio indicates significant economic pressure on the working population' : metrics.dependencyRatio < 50 ? 'favorable ratio suggests optimal conditions for economic growth' : 'moderate ratio shows balanced demographic structure'}.`,
      example: `${metrics.dependencyRatio > 60 ? 'High dependency ratios like ' + countryName + "'s require substantial social services and limit savings potential." : "Low dependency ratios like " + countryName + "'s create demographic dividends through increased productivity and savings."}`
    },
    {
      term: 'Sex Ratio',
      definition: 'The number of males per 100 females in a population, indicating gender balance or imbalance.',
      context: `${countryName}'s sex ratio of ${sexRatio.toFixed(0)} males per 100 females ${sexRatio > 105 ? 'shows a male surplus, which can affect marriage patterns and social dynamics' : sexRatio < 95 ? 'indicates more females than males, often due to higher male mortality or emigration' : 'demonstrates relatively balanced gender proportions typical of natural population patterns'}.`,
      example: `${sexRatio > 110 ? 'Significant male surpluses like in ' + countryName + ' may result from cultural preferences, migration patterns, or demographic policies.' : sexRatio < 90 ? 'Female majorities like in ' + countryName + ' often reflect longer female life expectancy or male emigration patterns.' : 'Balanced sex ratios like ' + countryName + "'s support healthy demographic development and social stability."}`
    },
    {
      term: 'Median Age',
      definition: 'The age that divides a population into two equal groups - half younger and half older than this age.',
      context: `At ${metrics.medianAge.toFixed(1)} years, ${countryName} ${metrics.medianAge < 25 ? 'has one of the world\'s youngest populations, indicating high birth rates and rapid population growth' : metrics.medianAge > 40 ? 'ranks among the world\'s most aged societies, reflecting low birth rates and increased longevity' : 'shows a transitional demographic profile between young and aging populations'}.`,
      example: `${metrics.medianAge < 20 ? 'Extremely young median ages like ' + countryName + "'s create opportunities for demographic dividends but require massive youth investments." : metrics.medianAge > 45 ? 'High median ages like ' + countryName + "'s indicate advanced development but create aging society challenges." : 'Moderate median ages like ' + countryName + "'s suggest balanced demographic development with manageable transitions."}`
    },
    {
      term: 'Population Pyramid Shape',
      definition: 'The visual representation of age and gender distribution that reveals demographic patterns and trends.',
      context: `${countryName}'s ${metrics.pyramidType} pyramid ${metrics.pyramidType === 'expansive' ? 'shows a wide base of young people, indicating high birth rates and rapid population growth typical of developing countries' : metrics.pyramidType === 'constrictive' ? 'displays a narrow base with fewer young people, characteristic of developed countries with low birth rates and aging populations' : 'demonstrates balanced age distribution typical of transitional demographic phases'}.`,
      example: `${metrics.pyramidType === 'expansive' ? 'Expansive pyramids like ' + countryName + "'s predict continued population growth and create opportunities for economic development if properly managed." : metrics.pyramidType === 'constrictive' ? 'Constrictive pyramids like ' + countryName + "'s indicate population stabilization or decline, requiring policies to address aging challenges." : 'Stationary pyramids like ' + countryName + "'s suggest demographic equilibrium with stable population growth patterns."}`
    },
    {
      term: 'Total Fertility Rate',
      definition: 'The average number of children a woman would have in her lifetime based on current birth rates.',
      context: `${countryName}'s estimated fertility rate of ${metrics.youthPercentage > 35 ? '5.0+' : metrics.youthPercentage > 25 ? '3.2' : metrics.youthPercentage > 20 ? '2.1' : '1.6'} children per woman ${(metrics.youthPercentage > 25 ? 3.5 : 1.8) > 2.1 ? 'likely exceeds replacement level, driving population growth' : 'likely falls below replacement level of 2.1, leading toward population decline'}.`,
      example: `${(metrics.youthPercentage > 25 ? 3.5 : 1.8) > 4 ? 'High fertility rates like ' + countryName + "'s support rapid population growth but challenge resource allocation and development planning." : (metrics.youthPercentage > 25 ? 3.5 : 1.8) < 1.5 ? 'Ultra-low fertility like ' + countryName + "'s threatens long-term population sustainability and economic growth." : 'Moderate fertility rates like ' + countryName + "'s balance population stability with manageable growth patterns."}`
    },
    {
      term: 'Youth Bulge',
      definition: 'A demographic pattern where a large proportion of the population consists of children and young adults.',
      context: `${countryName} ${metrics.youthPercentage > 30 ? 'exhibits a significant youth bulge with ' + metrics.youthPercentage.toFixed(1) + '% under 15, creating both opportunities and challenges' : 'has a moderate youth population of ' + metrics.youthPercentage.toFixed(1) + '% under 15, suggesting balanced demographic development'}.`,
      example: `${metrics.youthPercentage > 35 ? 'Pronounced youth bulges like ' + countryName + "'s can drive economic growth through demographic dividends but require massive education and employment investments." : 'Smaller youth populations like ' + countryName + "'s allow focus on quality over quantity in human capital development."}`
    },
    {
      term: 'Population Aging',
      definition: 'The increasing proportion of elderly people in a population, typically measured as percentage over 65.',
      context: `${countryName} shows ${metrics.elderlyPercentage > 15 ? 'advanced population aging with ' + metrics.elderlyPercentage.toFixed(1) + '% elderly, requiring significant adaptation of health and social systems' : metrics.elderlyPercentage > 7 ? 'emerging aging trends with ' + metrics.elderlyPercentage.toFixed(1) + '% elderly, indicating demographic transition progress' : 'minimal aging with only ' + metrics.elderlyPercentage.toFixed(1) + '% elderly, reflecting young population structure'}.`,
      example: `${metrics.elderlyPercentage > 20 ? 'Rapid aging like in ' + countryName + ' requires comprehensive policy responses addressing healthcare, pensions, and labor force sustainability.' : 'Limited aging like in ' + countryName + ' provides time to prepare for future demographic transitions while maximizing youth advantages.'}`
    },
    {
      term: 'Demographic Transition',
      definition: 'The shift from high birth and death rates to low birth and death rates as countries develop economically.',
      context: `${countryName} appears to be in ${metrics.medianAge < 25 ? 'early demographic transition with high fertility and declining mortality' : metrics.medianAge > 40 ? 'late or post-transition phases with low fertility and mortality' : 'mid-transition with declining fertility and continued mortality improvements'}.`,
      example: `${metrics.medianAge < 25 ? 'Early transition countries like ' + countryName + ' experience rapid population growth requiring substantial infrastructure and service expansion.' : 'Post-transition countries like ' + countryName + ' face aging challenges and potential population decline requiring different policy approaches.'}`
    },
    {
      term: 'Working-Age Population',
      definition: 'People aged 15-64 who are typically economically productive and support dependents.',
      context: `${countryName}'s working-age population comprises ${metrics.workingAgePercentage.toFixed(1)}% of total population, ${metrics.workingAgePercentage > 65 ? 'providing excellent conditions for economic growth and development' : metrics.workingAgePercentage < 55 ? 'creating challenges with fewer productive workers supporting more dependents' : 'offering balanced demographic structure for sustainable development'}.`,
      example: `${metrics.workingAgePercentage > 70 ? 'Large working-age populations like ' + countryName + "'s create demographic dividends through increased productivity and reduced dependency burdens." : 'Smaller working-age populations like ' + countryName + "'s require productivity enhancements and efficient resource allocation to maintain economic growth."}`
    },
    {
      term: 'Demographic Dividend',
      definition: 'Economic growth potential created when the working-age population grows relative to dependents.',
      context: `${countryName} ${metrics.dependencyRatio < 50 && metrics.workingAgePercentage > 65 ? 'is experiencing a demographic dividend with optimal age structure for economic acceleration' : metrics.dependencyRatio < 60 ? 'shows emerging dividend potential requiring strategic policy implementation' : 'faces demographic challenges with high dependency limiting dividend opportunities'}.`,
      example: `${metrics.dependencyRatio < 50 ? 'Countries experiencing demographic dividends like ' + countryName + ' can achieve rapid economic growth through increased savings, investment, and productivity.' : 'Countries missing dividend opportunities like ' + countryName + ' must focus on productivity improvements and efficient resource management.'}`
    }
  ];

  // Add historical context term if 1970 data available
  if (data1970) {
    const growthFactor = yearData.totalPopulation / data1970.totalPopulation;
    glossaryTerms.push({
      term: 'Population Growth Rate',
      definition: 'The rate at which a population increases or decreases over time, typically expressed as annual percentage.',
      context: `Since 1970, ${countryName}'s population has ${growthFactor > 2 ? 'more than doubled' : growthFactor > 1.5 ? 'grown significantly by ' + ((growthFactor - 1) * 100).toFixed(0) + '%' : growthFactor < 0.95 ? 'declined by ' + ((1 - growthFactor) * 100).toFixed(1) + '%' : 'grown moderately'}, reflecting ${growthFactor > 2 ? 'rapid demographic expansion typical of developing countries' : growthFactor < 1 ? 'population decline characteristic of developed nations with low fertility' : 'balanced demographic development'}.`,
      example: `${growthFactor > 2.5 ? 'Rapid growth like ' + countryName + "'s creates opportunities for economic expansion but challenges infrastructure and service delivery." : growthFactor < 0.9 ? 'Population decline like ' + countryName + "'s requires strategies addressing labor shortages and economic sustainability." : 'Moderate growth like ' + countryName + "'s enables manageable development planning and resource allocation."}`
    });
  }

  return glossaryTerms.slice(0, 8); // Return 8 key terms for optimal readability
}

export function generateGlossarySummary(countryName: string, metrics: DemographicMetrics): string {
  return `Understanding these demographic terms in ${countryName}'s specific context helps interpret population data, predict future trends, and inform policy decisions. ${metrics.medianAge < 25 ? 'As a young nation, ' + countryName + ' faces demographic opportunities requiring strategic youth development and economic planning.' : metrics.medianAge > 40 ? 'As a mature society, ' + countryName + ' must address aging challenges while maintaining economic vitality.' : 'As a transitional country, ' + countryName + ' balances youth advantages with emerging aging pressures.'} These definitions provide essential background for understanding demographic analysis and its implications for social and economic development.`;
}