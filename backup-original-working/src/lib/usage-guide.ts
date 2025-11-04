import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

interface AudienceGuide {
  audience: string;
  icon: string;
  title: string;
  description: string;
  applications: string[];
  citation?: string;
  tips: string[];
}

export function generateUsageGuide(
  countryName: string,
  countrySlug: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  currentYear: number
): AudienceGuide[] {
  
  const populationInMillions = yearData.totalPopulation / 1000000;
  const isYoungPopulation = metrics.medianAge < 25;
  const isAgingPopulation = metrics.elderlyPercentage > 15;
  const hasHighGrowth = metrics.youthPercentage > 30;

  const guides: AudienceGuide[] = [
    {
      audience: 'Students',
      icon: '🎓',
      title: 'Academic Research and School Projects',
      description: `Use ${countryName}'s demographic data for geography, social studies, economics, and development studies projects. Perfect for understanding population patterns, development challenges, and global demographic trends.`,
      applications: [
        `Compare ${countryName}'s age structure with neighboring countries for regional analysis projects`,
        `Analyze demographic transition stages using ${countryName} as a case study example`,
        `Create presentations on ${isYoungPopulation ? 'youth demographics and development opportunities' : 'population aging and its societal impacts'}`,
        `Research ${hasHighGrowth ? 'rapid population growth challenges' : 'demographic stabilization patterns'} for social science assignments`,
        'Generate charts and graphs for visual learning and academic presentations'
      ],
      tips: [
        'Always include the data year (2024) when presenting statistics',
        'Compare multiple time periods to show demographic changes over time',
        'Use specific numbers rather than general statements for academic credibility',
        'Consider cultural and economic factors when analyzing demographic patterns'
      ]
    },
    {
      audience: 'Researchers',
      icon: '🔬',
      title: 'Academic and Professional Research',
      description: `Access reliable demographic data for peer-reviewed research, policy analysis, and academic publications. All data sourced from UN World Population Prospects 2024 with proper attribution guidelines.`,
      applications: [
        `Demographic transition research using ${countryName}'s ${metrics.medianAge < 25 ? 'early' : 'advanced'} transition patterns`,
        `Comparative demographic studies across ${isYoungPopulation ? 'developing' : 'developed'} nations`,
        `Economic development analysis linking demographics to ${countryName}'s growth patterns`,
        `Social policy research addressing ${isAgingPopulation ? 'aging society challenges' : 'youth development opportunities'}`,
        'Cross-national studies on fertility, mortality, and migration trends'
      ],
      citation: `Population Pyramids. (${currentYear}). ${countryName} Population Pyramid and Demographic Analysis. Retrieved from https://populationpyramids.com/${countrySlug}`,
      tips: [
        'Verify data currency - this analysis uses 2024 projections',
        'Cross-reference with original UN sources for academic rigor',
        'Consider demographic momentum when making future projections',
        'Include confidence intervals and data limitations in research'
      ]
    },
    {
      audience: 'Policy Makers',
      icon: '🏛️',
      title: 'Government Planning and Policy Development',
      description: `Essential demographic intelligence for evidence-based policy making, resource allocation, and strategic planning. Use ${countryName}'s data to inform decisions on education, healthcare, infrastructure, and social services.`,
      applications: [
        `Education planning: ${hasHighGrowth ? 'Prepare for ' + Math.round(metrics.youthPercentage * populationInMillions / 100).toFixed(1) + 'M school-age children' : 'Optimize educational resources for smaller youth cohorts'}`,
        `Healthcare systems: ${isAgingPopulation ? 'Address aging population needs with ' + metrics.elderlyPercentage.toFixed(1) + '% elderly' : 'Focus on maternal and child health services'}`,
        `Economic development: ${metrics.workingAgePercentage > 65 ? 'Leverage demographic dividend with ' + metrics.workingAgePercentage.toFixed(1) + '% working-age population' : 'Address dependency challenges with targeted interventions'}`,
        `Infrastructure planning: Anticipate ${populationInMillions > 10 ? 'large-scale' : 'moderate'} demographic pressures on urban services`,
        `Social protection: Design pension and welfare systems for current dependency ratio of ${metrics.dependencyRatio.toFixed(1)}`
      ],
      tips: [
        'Consider demographic projections for long-term planning horizons',
        'Integrate demographic data with economic and social indicators',
        'Plan for demographic transitions 15-20 years in advance',
        'Use data to justify budget allocations and resource distribution'
      ]
    },
    {
      audience: 'Businesses',
      icon: '💼',
      title: 'Market Analysis and Business Strategy',
      description: `Leverage demographic insights for market research, customer segmentation, product development, and expansion planning. ${countryName}'s demographic profile reveals ${isYoungPopulation ? 'emerging consumer markets' : 'mature market characteristics'} with specific opportunities.`,
      applications: [
        `Target marketing: ${isYoungPopulation ? 'Focus on youth-oriented products and services for large under-25 population' : 'Develop senior-focused offerings for aging demographics'}`,
        `Market sizing: ${populationInMillions.toFixed(1)} million potential customers with ${metrics.workingAgePercentage.toFixed(1)}% in prime earning years`,
        `Location planning: ${metrics.youthPercentage > 25 ? 'Education and youth services show high demand' : 'Healthcare and senior services represent growth sectors'}`,
        `Workforce planning: ${metrics.workingAgePercentage > 65 ? 'Abundant labor supply available' : 'Plan for potential labor constraints'}`,
        `Investment decisions: ${hasHighGrowth ? 'High growth potential with expanding consumer base' : 'Stable market with predictable demand patterns'}`
      ],
      tips: [
        'Combine demographic data with income and urbanization statistics',
        'Consider cultural factors alongside demographic patterns',
        'Monitor demographic trends for long-term market evolution',
        'Use data to validate market entry and expansion strategies'
      ]
    },
    {
      audience: 'Media & Journalists',
      icon: '📰',
      title: 'News Reporting and Data Journalism',
      description: `Access verified demographic data for accurate reporting on population trends, social issues, and development stories. ${countryName}'s demographic patterns provide context for ${isYoungPopulation ? 'youth-focused' : 'aging society'} news narratives.`,
      applications: [
        `Feature stories: ${hasHighGrowth ? 'Youth population boom and its implications' : 'Demographic transition and societal changes'}`,
        `Data visualization: Create compelling charts and infographics for demographic stories`,
        `Context reporting: Use statistics to support stories about ${isAgingPopulation ? 'healthcare challenges' : 'education and employment needs'}`,
        `International comparisons: Position ${countryName} within regional and global demographic trends`,
        `Policy coverage: Analyze government decisions through demographic lens'`
      ],
      tips: [
        'Always cite data sources and methodology for credibility',
        'Use current year data and note projection vs. actual figures',
        'Translate statistics into human-interest angles',
        'Verify demographic claims against authoritative sources'
      ]
    },
    {
      audience: 'Educators',
      icon: '👨‍🏫',
      title: 'Teaching and Curriculum Development',
      description: `Integrate real-world demographic data into geography, social studies, mathematics, and development education curricula. ${countryName} serves as an excellent case study for ${isYoungPopulation ? 'developing country demographics' : 'advanced demographic transition'}.`,
      applications: [
        `Lesson planning: Use ${countryName}'s data for hands-on demographic analysis exercises`,
        `Cross-curricular projects: Connect demographics to history, economics, and environmental studies`,
        `Data literacy: Teach students to interpret population pyramids and demographic indicators`,
        `Global awareness: Compare ${countryName} with other countries to show development diversity`,
        `Critical thinking: Analyze demographic causes and consequences using real data`
      ],
      tips: [
        'Start with visual pyramid charts before introducing complex indicators',
        'Use country comparisons to illustrate demographic diversity',
        'Connect demographic data to students\' own cultural contexts',
        'Encourage questions about data interpretation and limitations'
      ]
    }
  ];

  return guides;
}

export function generateUsageSummary(countryName: string, metrics: DemographicMetrics): string {
  return `${countryName}'s demographic data serves multiple purposes across education, research, policy, and business sectors. ${metrics.medianAge < 25 ? 'As a young, growing population, the data highlights development opportunities and challenges.' : metrics.elderlyPercentage > 15 ? 'As an aging society, the data reveals transition challenges and adaptation needs.' : 'As a transitional population, the data shows balanced demographic development patterns.'} Users should always cite sources, consider data limitations, and integrate demographic insights with broader socioeconomic context for comprehensive analysis and decision-making.`;
}