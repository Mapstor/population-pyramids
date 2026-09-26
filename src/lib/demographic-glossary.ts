import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';
import { inText, sentenceStart, possessiveInText, possessiveStart } from '@/lib/country-names';
import { under15Band, over65Band, dependencyBand } from '@/lib/country-rules';

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
      context: `For ${inText(countryName)}, this means each working-age person supports ${(metrics.dependencyRatio / 100).toFixed(1)} dependents, with a dependency ratio of ${metrics.dependencyRatio.toFixed(1)} — a ${dependencyBand(metrics.dependencyRatio)} ratio.`,
      example: `${metrics.dependencyRatio > 60 ? 'High dependency ratios like ' + possessiveInText(countryName) + " require substantial social services and limit savings potential." : "Low dependency ratios like " + possessiveInText(countryName) + " create demographic dividends through increased productivity and savings."}`
    },
    {
      term: 'Sex Ratio',
      definition: 'The number of males per 100 females in a population, indicating gender balance or imbalance.',
      context: `${possessiveStart(countryName)} sex ratio of ${sexRatio.toFixed(0)} males per 100 females ${sexRatio > 105 ? 'shows a male surplus, which can affect marriage patterns and social dynamics' : sexRatio < 95 ? 'indicates more females than males, often due to higher male mortality or emigration' : 'demonstrates relatively balanced gender proportions typical of natural population patterns'}.`,
      example: `${sexRatio > 110 ? 'Significant male surpluses like in ' + inText(countryName) + ' may result from cultural preferences, migration patterns, or demographic policies.' : sexRatio < 90 ? 'Female majorities like in ' + inText(countryName) + ' often reflect longer female life expectancy or male emigration patterns.' : 'Balanced sex ratios like ' + possessiveInText(countryName) + " support healthy demographic development and social stability."}`
    },
    {
      term: 'Median Age',
      definition: 'The age that divides a population into two equal groups - half younger and half older than this age.',
      context: `At ${metrics.medianAge.toFixed(1)} years, ${inText(countryName)} ${metrics.medianAge < 25 ? 'has one of the world\'s youngest populations, indicating high birth rates and rapid population growth' : metrics.medianAge > 40 ? 'ranks among the world\'s most aged societies, reflecting low birth rates and increased longevity' : 'shows a transitional demographic profile between young and aging populations'}.`,
      example: `${metrics.medianAge < 20 ? 'Extremely young median ages like ' + possessiveInText(countryName) + " create opportunities for demographic dividends but require massive youth investments." : metrics.medianAge > 45 ? 'High median ages like ' + possessiveInText(countryName) + " indicate advanced development but create aging society challenges." : 'Moderate median ages like ' + possessiveInText(countryName) + " suggest balanced demographic development with manageable transitions."}`
    },
    {
      term: 'Population Pyramid Shape',
      definition: 'The visual representation of age and gender distribution that reveals demographic patterns and trends.',
      context: `${possessiveStart(countryName)} ${metrics.pyramidType} pyramid ${metrics.pyramidType === 'expansive' ? 'shows a wide base of young people, indicating high birth rates and rapid population growth typical of developing countries' : metrics.pyramidType === 'constrictive' ? 'displays a narrow base with fewer young people, characteristic of developed countries with low birth rates and aging populations' : 'demonstrates balanced age distribution typical of transitional demographic phases'}.`,
      example: `${metrics.pyramidType === 'expansive' ? 'Expansive pyramids like ' + possessiveInText(countryName) + " predict continued population growth and create opportunities for economic development if properly managed." : metrics.pyramidType === 'constrictive' ? 'Constrictive pyramids like ' + possessiveInText(countryName) + " indicate population stabilization or decline, requiring policies to address aging challenges." : 'Stationary pyramids like ' + possessiveInText(countryName) + " suggest demographic equilibrium with stable population growth patterns."}`
    },
    {
      term: 'Youth Bulge',
      definition: 'A demographic pattern where a large proportion of the population consists of children and young adults.',
      context: `${sentenceStart(countryName)} has a ${under15Band(metrics.youthPercentage)} under-15 share (${metrics.youthPercentage.toFixed(1)}% aged 0–14).`,
      example: `${metrics.youthPercentage > 35 ? 'Pronounced youth bulges like ' + possessiveInText(countryName) + " can drive economic growth through demographic dividends but require massive education and employment investments." : 'Smaller youth populations like ' + possessiveInText(countryName) + " allow focus on quality over quantity in human capital development."}`
    },
    {
      term: 'Population Aging',
      definition: 'The increasing proportion of elderly people in a population, typically measured as percentage over 65.',
      context: `${sentenceStart(countryName)} has a ${over65Band(metrics.elderlyPercentage)} population by the 65+ share (${metrics.elderlyPercentage.toFixed(1)}% aged 65 and over).`,
      example: `${metrics.elderlyPercentage > 20 ? 'Rapid aging like in ' + inText(countryName) + ' requires comprehensive policy responses addressing healthcare, pensions, and labor force sustainability.' : 'Limited aging like in ' + inText(countryName) + ' provides time to prepare for future demographic transitions while maximizing youth advantages.'}`
    },
    {
      term: 'Demographic Transition',
      definition: 'The shift from high birth and death rates to low birth and death rates as countries develop economically.',
      context: `${sentenceStart(countryName)} shows demographic characteristics typical of ${metrics.medianAge < 25 ? 'early transition phases' : metrics.medianAge > 40 ? 'advanced transition phases' : 'mid-transition development'}.`,
      example: `${metrics.medianAge < 25 ? 'Early transition countries like ' + inText(countryName) + ' experience rapid population growth requiring substantial infrastructure and service expansion.' : 'Post-transition countries like ' + inText(countryName) + ' face aging challenges and potential population decline requiring different policy approaches.'}`
    },
    {
      term: 'Working-Age Population',
      definition: 'People aged 15-64 who are typically economically productive and support dependents.',
      context: `${possessiveStart(countryName)} working-age population comprises ${metrics.workingAgePercentage.toFixed(1)}% of total population, ${metrics.workingAgePercentage > 65 ? 'providing excellent conditions for economic growth and development' : metrics.workingAgePercentage < 55 ? 'creating challenges with fewer productive workers supporting more dependents' : 'offering balanced demographic structure for sustainable development'}.`,
      example: `${metrics.workingAgePercentage > 70 ? 'Large working-age populations like ' + possessiveInText(countryName) + " create demographic dividends through increased productivity and reduced dependency burdens." : 'Smaller working-age populations like ' + possessiveInText(countryName) + " require productivity enhancements and efficient resource allocation to maintain economic growth."}`
    },
    // TODO Phase 1.5: dividend phase thresholds below are not sourced.
    // Add academic citation (e.g., Bloom & Williamson 2003, or UN Population
    // Division working papers) or rework classification against sourced thresholds.
    // Current thresholds are approximate demographic-literature framing, not fabricated
    // values, but the classification boundaries need citation.
    {
      term: 'Demographic Dividend',
      definition: 'Economic growth potential created when the working-age population grows relative to dependents.',
      context: `${sentenceStart(countryName)} ${metrics.dependencyRatio < 50 && metrics.workingAgePercentage > 65 ? 'is experiencing a demographic dividend with optimal age structure for economic acceleration' : metrics.dependencyRatio < 60 ? 'shows emerging dividend potential requiring strategic policy implementation' : 'faces demographic challenges with high dependency limiting dividend opportunities'}.`,
      example: `${metrics.dependencyRatio < 50 ? 'Countries experiencing demographic dividends like ' + inText(countryName) + ' can achieve rapid economic growth through increased savings, investment, and productivity.' : 'Countries missing dividend opportunities like ' + inText(countryName) + ' must focus on productivity improvements and efficient resource management.'}`
    }
  ];

  // Add historical context term if 1970 data available
  if (data1970) {
    const growthFactor = yearData.totalPopulation / data1970.totalPopulation;
    glossaryTerms.push({
      term: 'Population Growth Rate',
      definition: 'The rate at which a population increases or decreases over time, typically expressed as annual percentage.',
      context: `Since 1970, ${possessiveInText(countryName)} population has ${growthFactor > 2 ? 'more than doubled' : growthFactor > 1.5 ? 'grown significantly by ' + ((growthFactor - 1) * 100).toFixed(0) + '%' : growthFactor < 0.95 ? 'declined by ' + ((1 - growthFactor) * 100).toFixed(1) + '%' : 'grown moderately'}, reflecting ${growthFactor > 2 ? 'rapid demographic expansion typical of developing countries' : growthFactor < 1 ? 'population decline characteristic of developed nations with low fertility' : 'balanced demographic development'}.`,
      example: `${growthFactor > 2.5 ? 'Rapid growth like ' + possessiveInText(countryName) + " creates opportunities for economic expansion but challenges infrastructure and service delivery." : growthFactor < 0.9 ? 'Population decline like ' + possessiveInText(countryName) + " requires strategies addressing labor shortages and economic sustainability." : 'Moderate growth like ' + possessiveInText(countryName) + " enables manageable development planning and resource allocation."}`
    });
  }

  return glossaryTerms.slice(0, 8); // Return 8 key terms for optimal readability
}

export function generateGlossarySummary(countryName: string, metrics: DemographicMetrics): string {
  return `Understanding these demographic terms in ${possessiveInText(countryName)} specific context helps interpret population data, predict future trends, and inform policy decisions. ${metrics.medianAge < 25 ? 'As a young nation, ' + inText(countryName) + ' faces demographic opportunities requiring strategic youth development and economic planning.' : metrics.medianAge > 40 ? 'As a mature society, ' + inText(countryName) + ' must address aging challenges while maintaining economic vitality.' : 'As a transitional country, ' + inText(countryName) + ' balances youth advantages with emerging aging pressures.'} These definitions provide essential background for understanding demographic analysis and its implications for social and economic development.`;
}