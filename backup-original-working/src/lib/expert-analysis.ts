import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

interface ExpertAnalysis {
  demographicDividend: string;
  fertilityTransition: string;
  demographicMomentum: string;
  agingSpeed: string;
  professionalAssessment: string;
}

export function generateExpertAnalysis(
  countryName: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData,
  year: number
): ExpertAnalysis {
  const medianAge = metrics.medianAge;
  const dependencyRatio = metrics.dependencyRatio;
  const youthPercent = metrics.youthPercentage;
  const elderlyPercent = metrics.elderlyPercentage;
  const workingAgePercent = metrics.workingAgePercentage;
  
  // Calculate demographic transition indicators
  const totalFertilityRate = estimateTFR(youthPercent);
  
  // Analyze historical trends if data available
  const earlierYear = Math.max(1970, year - 20);
  const earlierData = countryData.years[earlierYear.toString()];
  let agingRate = 0;
  if (earlierData) {
    agingRate = (medianAge - earlierData.medianAge) / 20; // Change per year
  }

  // Demographic dividend analysis
  let demographicDividend = '';
  if (dependencyRatio < 50 && workingAgePercent > 65) {
    demographicDividend = `${countryName} is experiencing an optimal demographic dividend window, with a favorable dependency ratio of ${dependencyRatio.toFixed(1)} and ${workingAgePercent.toFixed(1)}% working-age population. This demographic bonus period typically lasts 20-30 years and represents a critical opportunity for accelerated economic development through increased savings rates, investment capacity, and productivity gains.`;
  } else if (dependencyRatio < 60 && workingAgePercent > 60) {
    demographicDividend = `${countryName} is positioned within the demographic dividend transition phase, with moderate dependency ratios suggesting emerging opportunities for economic acceleration. The current window requires strategic policy interventions to maximize the benefits of demographic structure changes before population aging intensifies.`;
  } else if (dependencyRatio > 65) {
    demographicDividend = `${countryName} has moved beyond the demographic dividend phase, with high dependency ratios (${dependencyRatio.toFixed(1)}) indicating increased support burdens on the working-age population. The demographic bonus period has concluded, necessitating productivity-focused economic strategies and institutional adaptations to maintain prosperity.`;
  } else {
    demographicDividend = `${countryName} exhibits pre-dividend demographic characteristics, with high youth dependency constraining immediate economic benefits. The demographic transition pathway suggests potential future dividend opportunities contingent on successful fertility rate moderation and human capital development investments.`;
  }

  // Fertility transition analysis
  let fertilityTransition = '';
  if (totalFertilityRate > 4.0) {
    fertilityTransition = `${countryName} remains in the early fertility transition stage with elevated total fertility rates contributing to rapid natural increase and demographic momentum. The population exhibits classical high-fertility demographic patterns typical of pre-transitional societies, requiring comprehensive reproductive health and family planning interventions.`;
  } else if (totalFertilityRate > 2.5) {
    fertilityTransition = `${countryName} demonstrates intermediate fertility transition dynamics, with declining but still above-replacement fertility rates driving continued population growth. This transitional phase represents a critical demographic inflection point where policy interventions can significantly influence future population trajectories and age structure evolution.`;
  } else if (totalFertilityRate > 1.8) {
    fertilityTransition = `${countryName} has advanced through the fertility transition to near-replacement levels, indicating demographic maturation and approaching population stabilization. This late-transition stage typically precedes population aging acceleration and requires anticipatory policy frameworks for demographic change management.`;
  } else {
    fertilityTransition = `${countryName} exhibits post-transitional fertility patterns well below replacement level, characteristic of demographically mature societies. Ultra-low fertility regimes present long-term sustainability challenges including population decline, accelerated aging, and intergenerational support system pressures.`;
  }

  // Demographic momentum analysis
  let demographicMomentum = '';
  if (youthPercent > 30) {
    demographicMomentum = `Strong demographic momentum characterizes ${countryName}'s population dynamics, with ${youthPercent.toFixed(1)}% under age 15 ensuring continued growth for 2-3 generations regardless of immediate fertility changes. This built-in growth trajectory reflects the reproductive potential of large youth cohorts entering childbearing ages, creating policy imperatives for education, employment, and infrastructure development.`;
  } else if (youthPercent > 20) {
    demographicMomentum = `${countryName} exhibits moderate demographic momentum with ${youthPercent.toFixed(1)}% youth population maintaining growth potential through the next generation. The demographic structure suggests manageable population increase patterns, allowing for strategic planning and gradual adaptation to changing age distributions without dramatic policy adjustments.`;
  } else if (youthPercent > 15) {
    demographicMomentum = `Weak demographic momentum in ${countryName} reflects advanced demographic transition with reduced growth potential from age structure effects. The smaller youth cohorts indicate approaching population stabilization and eventual decline, requiring proactive policies addressing labor force sustainability and economic productivity enhancement.`;
  } else {
    demographicMomentum = `${countryName} demonstrates negative demographic momentum with severely contracted youth cohorts (${youthPercent.toFixed(1)}%) presaging population decline. The demographic structure exhibits classic post-transitional characteristics requiring comprehensive policy responses to address shrinking labor forces, pension sustainability, and economic growth maintenance.`;
  }

  // Population aging speed analysis
  let agingSpeed = '';
  if (agingRate > 0.3) {
    agingSpeed = `${countryName} experiences rapid population aging at ${(agingRate * 10).toFixed(1)} years median age increase per decade, indicating compressed demographic transition typical of developing economies. This accelerated aging pattern, faster than historical European experiences, presents unprecedented challenges requiring urgent adaptation of health systems, pension frameworks, and economic structures.`;
  } else if (agingRate > 0.1) {
    agingSpeed = `Population aging in ${countryName} proceeds at moderate pace with ${(agingRate * 10).toFixed(1)} years median age increase per decade, following conventional demographic transition pathways. This gradual aging trajectory allows for systematic institutional adaptations and policy adjustments to address emerging demographic challenges while maintaining social and economic stability.`;
  } else if (agingRate > -0.1) {
    agingSpeed = `${countryName} exhibits demographic stability with minimal median age changes, suggesting balanced age structure dynamics. This demographic equilibrium represents either pre-transition stability or post-transition stabilization, depending on overall fertility and mortality patterns, requiring context-specific policy approaches.`;
  } else {
    agingSpeed = `Negative aging trends in ${countryName} reflect population rejuvenation through high fertility or immigration, characteristic of early demographic transition phases. This demographic pattern indicates potential for future rapid aging as fertility transitions progress, necessitating long-term planning for inevitable age structure changes.`;
  }

  // Professional assessment synthesis
  let professionalAssessment = '';
  if (medianAge < 25) {
    professionalAssessment = `From a demographic perspective, ${countryName} represents a classic young population with significant development potential but requiring immediate large-scale investments in human capital formation. The demographic window of opportunity demands strategic policy coordination across education, health, and economic sectors to realize development dividends.`;
  } else if (medianAge < 35) {
    professionalAssessment = `${countryName}'s demographic profile indicates optimal transitional characteristics with balanced age structures supporting sustained development. This demographic sweet spot provides policy flexibility and growth potential while requiring strategic preparation for future aging challenges through institutional strengthening and economic diversification.`;
  } else if (medianAge < 45) {
    professionalAssessment = `The demographic landscape of ${countryName} reflects advanced transition dynamics with emerging aging challenges requiring proactive policy interventions. This intermediate aging phase necessitates comprehensive strategies balancing current economic optimization with future demographic sustainability requirements.`;
  } else {
    professionalAssessment = `${countryName} exhibits mature demographic characteristics with significant aging implications for long-term sustainability. The advanced demographic profile requires sophisticated policy frameworks addressing productivity enhancement, immigration strategies, and intergenerational equity considerations to maintain societal welfare.`;
  }

  return {
    demographicDividend,
    fertilityTransition,
    demographicMomentum,
    agingSpeed,
    professionalAssessment
  };
}

// Estimate Total Fertility Rate from youth percentage (rough approximation)
function estimateTFR(youthPercent: number): number {
  // Rough correlation between youth percentage and TFR
  if (youthPercent > 35) return 5.5;
  if (youthPercent > 30) return 4.5;
  if (youthPercent > 25) return 3.5;
  if (youthPercent > 20) return 2.8;
  if (youthPercent > 15) return 2.1;
  return 1.4;
}