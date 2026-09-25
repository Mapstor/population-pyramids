import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';
import { formatPopulationProse } from '@/lib/number-format';
import { ordinal, formatShare, popWords } from '@/lib/country-format';
import { computeShare } from '@/lib/country-rank';
import { worldPopulation } from '@/lib/world-population';
import { inText, sentenceStart, possessiveInText, possessiveStart } from '@/lib/country-names';

interface FAQ {
  question: string;
  answer: string;
  category: 'population' | 'age' | 'fertility' | 'migration' | 'comparison' | 'trends' | 'social' | 'economic';
}

export function generateExpandedFAQ(
  countryName: string,
  countrySlug: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData,
  currentYear: number,
  rank: number | null = null
): FAQ[] {
  const faqs: FAQ[] = [];

  // Grammar forms — no-ops for names that take no article.
  const nameMid = inText(countryName);
  const NameStart = sentenceStart(countryName);
  const namePoss = possessiveInText(countryName); // mid-sentence possessive ("the United States'")
  const namePossStart = possessiveStart(countryName); // sentence-initial possessive ("The United States'")

  const populationInMillions = yearData.totalPopulation / 1000000;

  // 1. Population ranking question — real rank + real world share (T2 Step 4).
  const sharePct = computeShare(yearData.totalPopulation, currentYear);
  const world = worldPopulation(currentYear);
  const shareClause =
    sharePct != null && world != null && yearData.totalPopulation >= 1_000_000
      ? `, representing ${formatShare(sharePct)} of the global total of ${popWords(world)}`
      : '';
  faqs.push({
    question: `How does ${nameMid} rank globally by population?`,
    answer: rank
      ? `${NameStart} ranks ${ordinal(rank)} in the world by population with ${formatPopulationProse(yearData.totalPopulation)} people as of ${currentYear}${shareClause}. This places ${nameMid} among the world's ${rank <= 10 ? 'most populous nations' : 'larger countries'}. ${rank <= 5 ? 'As one of the population giants, demographic changes in ' + nameMid + ' significantly affect global trends.' : `While not among the population superpowers, ${namePoss} demographic patterns reflect important regional and global development trends.`} The country's population size influences its economic potential, political weight, and resource requirements on the international stage.`
      : `${NameStart} has a population of ${formatPopulationProse(yearData.totalPopulation)} people as of ${currentYear}${shareClause}. ${namePoss} demographic characteristics are significant for regional development patterns. The country's population size positions it as ${populationInMillions > 50 ? 'a medium-sized nation' : populationInMillions > 10 ? 'a smaller but notable country' : 'a smaller nation'} in global demographic terms. Understanding ${namePoss} population dynamics provides insight into broader trends affecting similar-sized countries worldwide, particularly regarding development challenges and opportunities.`,
    category: 'comparison'
  });

  // 9. Age structure question
  faqs.push({
    question: `What does ${namePoss} age structure reveal about its development?`,
    answer: `${namePossStart} age structure, with ${metrics.youthPercentage.toFixed(1)}% under 15, ${metrics.workingAgePercentage.toFixed(1)}% working-age (15-64), and ${metrics.elderlyPercentage.toFixed(1)}% elderly (65+), indicates ${metrics.medianAge < 25 ? 'early demographic transition with high growth potential' : metrics.medianAge < 35 ? 'intermediate development with demographic dividend opportunities' : 'advanced transition with aging challenges'}. The median age of ${metrics.medianAge.toFixed(1)} years reflects ${metrics.medianAge < 30 ? 'a young society with significant future workforce entry' : 'a maturing population with established workforce patterns'}. This demographic structure ${metrics.dependencyRatio < 50 ? 'provides favorable conditions for economic growth through low dependency ratios' : 'presents challenges with high dependency ratios requiring substantial support systems'}. ${metrics.youthPercentage > 30 ? 'The large youth population demands major investment in education, healthcare, and job creation over the coming decades.' : 'The smaller youth cohorts suggest approaching population stabilization and eventual aging pressures.'} Age structure directly influences economic planning, social service needs, labor market dynamics, and long-term fiscal sustainability in ${nameMid}.`,
    category: 'age'
  });

  // 10. Economic implications question
  faqs.push({
    question: `What are the economic implications of ${namePoss} demographics?`,
    answer: `${namePossStart} demographic profile creates ${metrics.dependencyRatio < 50 ? 'significant economic opportunities' : 'notable economic challenges'} through its impact on labor markets, consumption patterns, and fiscal requirements. With ${metrics.workingAgePercentage.toFixed(1)}% of the population in working ages, the country has ${metrics.workingAgePercentage > 65 ? 'abundant labor-force potential supporting economic expansion' : 'moderate workforce capacity requiring productivity enhancements'}. The dependency ratio of ${metrics.dependencyRatio.toFixed(1)} means each working person supports ${(metrics.dependencyRatio / 100).toFixed(1)} dependents, ${metrics.dependencyRatio < 50 ? 'enabling high savings rates and investment capacity' : 'requiring substantial resources for dependent care'}. ${metrics.elderlyPercentage > 15 ? 'Significant elderly populations increase healthcare and pension costs while reducing labor-force participation.' : 'Lower elderly proportions postpone aging-related fiscal pressures.'} These demographic patterns influence economic growth potential, social spending priorities, and long-term fiscal sustainability in ${nameMid}.`,
    category: 'economic'
  });

  // 11. Demographic dividend question
  faqs.push({
    question: `Is ${nameMid} experiencing a demographic dividend?`,
    answer: `${NameStart} is ${metrics.dependencyRatio < 50 && metrics.workingAgePercentage > 65 ? 'currently experiencing' : metrics.dependencyRatio < 60 && metrics.workingAgePercentage > 60 ? 'entering' : metrics.dependencyRatio > 70 ? 'past' : 'approaching'} a demographic dividend phase. ${metrics.dependencyRatio < 50 ? 'With low dependency ratios and a large working-age population, conditions are favorable for accelerated economic growth through increased savings, investment, and productivity.' : 'Current demographic conditions ' + (metrics.dependencyRatio > 70 ? 'have moved beyond the dividend window, requiring focus on productivity and automation' : 'suggest emerging opportunities for demographic benefits') + '.'} The demographic dividend occurs when fertility declines create a bulge in working-age population while dependency ratios remain manageable. ${NameStart} ${metrics.youthPercentage > 25 ? 'still has significant youth populations that will enter the workforce over the next 15 years' : 'shows more balanced age structures typical of dividend or post-dividend phases'}. Realizing demographic-dividend benefits requires strategic investment in education, healthcare, job creation, and governance so the working-age population can contribute productively. ${metrics.dependencyRatio < 50 ? 'This demographic window typically lasts 20-30 years, making current policy decisions crucial for maximizing economic benefits.' : 'Understanding demographic timing helps inform appropriate economic and social policies.'}`,
    category: 'economic'
  });

  // 13. Future challenges question
  faqs.push({
    question: `What demographic challenges will ${nameMid} face in the future?`,
    answer: `${NameStart} faces ${metrics.medianAge < 25 ? 'youth-related demographic challenges' : metrics.medianAge > 40 ? 'aging-related demographic pressures' : 'transitional demographic adjustments'} over the coming decades. ${metrics.youthPercentage > 30 ? 'The large youth population (' + metrics.youthPercentage.toFixed(1) + '%) requires major investment in education and economic development.' : 'Smaller youth cohorts will create eventual labor shortages and reduced economic dynamism.'} ${metrics.elderlyPercentage > 15 ? 'Rapid population aging will strain healthcare systems, pension programs, and social services while reducing workforce participation.' : 'Future aging pressures will emerge as current working-age populations retire over the next 20-30 years.'} Climate change, technological disruption, and global economic shifts will compound demographic pressures. Successful navigation requires proactive policies addressing education, healthcare, employment, social protection, and sustainable development to manage demographic transitions effectively.`,
    category: 'trends'
  });

  // 16. Gender dynamics question
  const totalMales = yearData.ageGroups.reduce((sum, ag) => sum + ag.male, 0);
  const totalFemales = yearData.ageGroups.reduce((sum, ag) => sum + ag.female, 0);
  const sexRatio = (totalMales / totalFemales) * 100;
  faqs.push({
    question: `What are the gender dynamics in ${namePoss} population?`,
    answer: `${NameStart} has ${sexRatio > 105 ? 'more males than females' : sexRatio < 95 ? 'more females than males' : 'relatively balanced gender proportions'}, with approximately ${sexRatio.toFixed(0)} males per 100 females. This ${sexRatio > 110 ? 'significant male surplus' : sexRatio < 90 ? 'notable female majority' : 'balanced ratio'} ${sexRatio !== 100 ? 'affects marriage patterns, workforce participation, and social dynamics' : 'supports natural demographic balance'}. Gender ratios vary by age group, with ${sexRatio > 105 ? 'male advantages potentially reflecting cultural preferences or migration patterns' : 'female advantages possibly indicating male emigration or mortality differences'}. ${metrics.elderlyPercentage > 10 ? 'Among elderly populations, women typically outnumber men because of higher female life expectancy.' : 'Younger populations may show different gender balances because of birth preferences or migration.'} Gender dynamics influence economic development through women's workforce participation, education access, and reproductive-health outcomes. Understanding gender demographics helps inform policies on education equality, healthcare access, economic empowerment, and social development in ${nameMid}.`,
    category: 'social'
  });

  return faqs.slice(0, 6);
}
