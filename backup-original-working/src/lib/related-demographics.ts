import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

interface DemographicIndicator {
  title: string;
  icon: string;
  content: string;
  sources: {
    name: string;
    url: string;
    description: string;
  }[];
}

interface RelatedDemographics {
  indicators: DemographicIndicator[];
  summary: string;
}

export function generateRelatedDemographics(
  countryName: string,
  countrySlug: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData,
  currentYear: number
): RelatedDemographics {
  
  // Calculate contextual estimates based on available data
  const populationInMillions = yearData.totalPopulation / 1000000;
  const estimatedUrbanization = metrics.medianAge > 35 ? 75 : metrics.medianAge > 25 ? 65 : metrics.medianAge > 20 ? 55 : 35;
  const estimatedLifeExpectancy = metrics.elderlyPercentage > 15 ? 78 : metrics.elderlyPercentage > 10 ? 73 : metrics.elderlyPercentage > 5 ? 68 : 63;
  const isHighIncome = metrics.medianAge > 35;
  const isLowIncome = metrics.medianAge < 20;
  
  // Gender ratio calculation
  const totalMales = yearData.ageGroups.reduce((sum, ag) => sum + ag.male, 0);
  const totalFemales = yearData.ageGroups.reduce((sum, ag) => sum + ag.female, 0);
  const sexRatio = (totalMales / totalFemales * 100);

  const indicators: DemographicIndicator[] = [];

  // 1. Urbanization Trends
  indicators.push({
    title: 'Urbanization Trends and Urban Development',
    icon: '🏙️',
    content: `${countryName}'s urbanization rate is estimated at approximately ${estimatedUrbanization}% as of ${currentYear}, reflecting ${estimatedUrbanization > 70 ? 'advanced urban development with most citizens living in cities and metropolitan areas' : estimatedUrbanization > 50 ? 'ongoing urban transition as rural populations migrate to cities for economic opportunities' : 'predominantly rural society with emerging urban centers'}. Urban growth patterns in ${countryName} follow regional development trends, with major cities experiencing ${estimatedUrbanization > 60 ? 'infrastructure pressures from rapid population concentration' : 'gradual expansion as economic development attracts rural migrants'}. ${estimatedUrbanization > 70 ? 'High urbanization levels create challenges including housing affordability, traffic congestion, and environmental sustainability.' : 'Lower urbanization suggests significant agricultural populations and rural development needs.'} Urban planning initiatives focus on sustainable city development, public transportation systems, and inclusive housing policies. ${populationInMillions > 10 ? 'Large urban populations require comprehensive metropolitan governance and regional coordination.' : 'Smaller urban centers allow for more manageable city planning and community-focused development.'} The World Bank tracks urbanization indicators and provides development assistance for sustainable urban growth across developing nations.`,
    sources: [
      {
        name: 'World Bank Urban Development',
        url: 'https://www.worldbank.org/en/topic/urbandevelopment',
        description: 'Comprehensive data on global urbanization trends and city development indicators'
      },
      {
        name: 'UN-Habitat World Cities Report',
        url: 'https://unhabitat.org/world-cities-report',
        description: 'Detailed analysis of urban development patterns and sustainability challenges'
      }
    ]
  });

  // 2. Life Expectancy and Health Outcomes
  indicators.push({
    title: 'Life Expectancy and Health System Performance',
    icon: '🏥',
    content: `Life expectancy in ${countryName} is estimated at approximately ${estimatedLifeExpectancy} years, representing ${estimatedLifeExpectancy > 75 ? 'excellent health outcomes comparable to developed nations' : estimatedLifeExpectancy > 70 ? 'good health system performance with continued improvement potential' : 'developing health infrastructure with significant advancement opportunities'}. ${estimatedLifeExpectancy > 75 ? 'High life expectancy reflects advanced healthcare systems, disease prevention programs, and healthy lifestyle factors.' : 'Current life expectancy levels suggest ongoing health system development and public health initiatives.'} Health improvements in ${countryName} follow global patterns of reduced infectious disease mortality, improved maternal and child health, and ${isHighIncome ? 'increased focus on non-communicable disease prevention' : 'continued work on basic healthcare access and nutrition'}. ${metrics.elderlyPercentage > 10 ? 'Growing elderly populations require specialized geriatric care and chronic disease management systems.' : 'Younger populations benefit from preventive healthcare and childhood vaccination programs.'} The World Health Organization monitors health indicators and supports countries in achieving universal health coverage and improved population health outcomes through evidence-based policy recommendations.`,
    sources: [
      {
        name: 'WHO Global Health Observatory',
        url: 'https://www.who.int/data/gho',
        description: 'Comprehensive health statistics including life expectancy and mortality data'
      },
      {
        name: 'World Bank Health Indicators',
        url: 'https://datatopics.worldbank.org/health/',
        description: 'Health system performance metrics and development indicators'
      }
    ]
  });

  // 3. Education Enrollment and Human Capital
  indicators.push({
    title: 'Education Enrollment and Human Capital Development',
    icon: '🎓',
    content: `Education enrollment patterns in ${countryName} reflect ${isHighIncome ? 'advanced educational systems with near-universal access and focus on higher education quality' : isLowIncome ? 'expanding educational access with emphasis on primary school completion and literacy improvement' : 'developing educational infrastructure with growing secondary and tertiary enrollment'}. Primary education enrollment likely reaches ${isHighIncome ? '98-100%' : isLowIncome ? '75-90%' : '90-95%'} of school-age children, while secondary enrollment shows ${isHighIncome ? 'universal access with quality differentiation' : 'continued expansion challenges'}. ${metrics.youthPercentage > 25 ? 'Large youth populations create substantial demand for educational infrastructure, teacher training, and curriculum development.' : 'Smaller youth cohorts allow focus on education quality improvements and skill development programs.'} Gender parity in education has ${isHighIncome ? 'been achieved with potential female advantages in higher education' : 'improved significantly but may require continued attention in rural or traditional communities'}. UNESCO tracks global education indicators and supports countries in achieving Sustainable Development Goal 4 for inclusive and equitable quality education through policy guidance and capacity building initiatives.`,
    sources: [
      {
        name: 'UNESCO Institute for Statistics',
        url: 'http://uis.unesco.org/',
        description: 'Global education statistics including enrollment rates and literacy data'
      },
      {
        name: 'World Bank Education Data',
        url: 'https://datatopics.worldbank.org/education/',
        description: 'Education indicators and human capital development metrics'
      }
    ]
  });

  // 4. Gender Ratios and Social Development
  indicators.push({
    title: 'Gender Ratios and Social Equality Indicators',
    icon: '⚖️',
    content: `Gender ratios in ${countryName} show ${sexRatio > 105 ? 'a male surplus with approximately ' + sexRatio.toFixed(0) + ' males per 100 females, potentially reflecting cultural preferences or migration patterns' : sexRatio < 95 ? 'a female majority with ' + sexRatio.toFixed(0) + ' males per 100 females, possibly indicating male emigration or mortality differences' : 'relatively balanced gender proportions typical of natural demographic patterns'}. ${sexRatio > 110 ? 'Significant gender imbalances may affect marriage patterns, social dynamics, and require policy attention to address underlying causes.' : 'Balanced gender ratios support healthy social development and family formation patterns.'} Women's workforce participation in ${countryName} likely ${isHighIncome ? 'approaches gender parity with continued focus on leadership representation and wage equality' : 'shows improvement but may face traditional barriers requiring policy intervention'}. ${metrics.youthPercentage > 25 ? 'Large youth populations provide opportunities for advancing gender equality through education and economic empowerment programs.' : 'Smaller youth cohorts may reflect societies where gender equality has advanced alongside demographic transition.'} The UN Women organization tracks gender equality indicators and supports countries in achieving sustainable development goals related to gender empowerment and social inclusion.`,
    sources: [
      {
        name: 'UN Women Data Hub',
        url: 'https://data.unwomen.org/',
        description: 'Gender equality indicators and women\'s empowerment statistics'
      },
      {
        name: 'World Bank Gender Data Portal',
        url: 'https://genderdata.worldbank.org/',
        description: 'Comprehensive gender statistics and development indicators'
      }
    ]
  });

  // 5. Migration Patterns and Mobility
  indicators.push({
    title: 'Migration Patterns and Population Mobility',
    icon: '✈️',
    content: `Migration patterns significantly shape ${countryName}'s demographic composition through both internal rural-urban movement and international migration flows. ${estimatedUrbanization > 60 ? 'High urbanization levels suggest substantial historical rural-urban migration, with continued internal mobility toward major economic centers.' : 'Lower urbanization indicates ongoing rural-urban migration potential as economic development creates urban employment opportunities.'} International migration includes both emigration of ${countryName} citizens seeking opportunities abroad and immigration of foreign nationals for work, study, or humanitarian reasons. ${isHighIncome ? 'As a developed economy, ' + countryName + ' typically attracts skilled workers, international students, and may experience modest emigration.' : 'As a developing nation, ' + countryName + ' may experience emigration of educated youth while receiving regional migrants for specific labor needs.'} ${populationInMillions > 20 ? 'Large population size means migration flows can significantly impact both origin and destination communities.' : 'Smaller population size means migration can have proportionally larger demographic effects.'} Remittances from emigrants often provide important economic benefits, while immigration helps address labor market needs and demographic challenges. The International Organization for Migration tracks global migration trends and supports countries in developing evidence-based migration policies.`,
    sources: [
      {
        name: 'IOM Migration Data Portal',
        url: 'https://www.migrationdataportal.org/',
        description: 'Global migration statistics and trend analysis'
      },
      {
        name: 'UN DESA International Migration',
        url: 'https://www.un.org/development/desa/pd/content/international-migration',
        description: 'International migration stock and flow data'
      }
    ]
  });

  // Summary
  const summary = `These additional demographic indicators provide comprehensive context for understanding ${countryName}'s population dynamics beyond age structure and fertility patterns. ${isHighIncome ? 'As a developed nation, ' + countryName + ' faces challenges typical of advanced economies including urbanization management, aging populations, and maintaining social cohesion.' : isLowIncome ? 'As a developing country, ' + countryName + ' navigates rapid demographic change requiring investments in education, healthcare, and economic opportunities.' : 'As a transitional economy, ' + countryName + ' balances traditional demographic patterns with modernization pressures.'} Understanding these interconnected demographic factors helps policymakers, researchers, and development practitioners design effective interventions addressing population challenges while maximizing demographic opportunities for sustainable development.`;

  return {
    indicators,
    summary
  };
}