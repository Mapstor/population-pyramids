import type { YearData, DemographicMetrics } from '@/types/population';

interface ImplicationsAnalysis {
  economy: string;
  healthcare: string;
  education: string;
  pensions: string;
  employment: string;
  summary: string;
}

export function generateImplications(
  countryName: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  year: number
): ImplicationsAnalysis {
  const totalPop = yearData.totalPopulation;
  const youthPercent = metrics.youthPercentage;
  const workingAgePercent = metrics.workingAgePercentage;
  const elderlyPercent = metrics.elderlyPercentage;
  const dependencyRatio = metrics.dependencyRatio;
  const medianAge = metrics.medianAge;
  
  // Calculate absolute numbers for context
  const workingAgePop = Math.round(totalPop * (workingAgePercent / 100));
  const elderlyPop = Math.round(totalPop * (elderlyPercent / 100));
  const youthPop = Math.round(totalPop * (youthPercent / 100));
  
  // Economic implications
  let economy = '';
  if (workingAgePercent > 65) {
    economy = `The large working-age population (${workingAgePercent.toFixed(1)}% or ${(workingAgePop / 1000000).toFixed(1)} million people) represents a significant economic opportunity for ${countryName}. This demographic dividend can drive economic growth through increased productivity, higher savings rates, and expanded consumer markets. However, realizing this potential requires substantial job creation and skills development programs.`;
  } else if (workingAgePercent < 55) {
    economy = `${countryName}'s relatively small working-age population (${workingAgePercent.toFixed(1)}%) presents economic challenges, with fewer people supporting dependents and contributing to economic output. This demographic structure may limit economic growth potential and requires policies focused on productivity enhancement, automation, and encouraging workforce participation among all eligible populations.`;
  } else {
    economy = `${countryName}'s working-age population of ${workingAgePercent.toFixed(1)}% provides a stable foundation for economic activity. With ${(workingAgePop / 1000000).toFixed(1)} million people in their productive years, the country has balanced demographic support for sustained economic development, though continued investment in human capital remains crucial.`;
  }

  // Healthcare implications
  let healthcare = '';
  if (elderlyPercent > 15) {
    healthcare = `With ${elderlyPercent.toFixed(1)}% elderly population (${(elderlyPop / 1000000).toFixed(1)} million people), ${countryName} faces rising healthcare demands and costs. Age-related conditions, chronic diseases, and long-term care needs will strain healthcare systems. Investment in geriatric care, preventive medicine, and healthcare infrastructure expansion is critical to meet growing demands.`;
  } else if (elderlyPercent < 5) {
    healthcare = `${countryName}'s young population structure (only ${elderlyPercent.toFixed(1)}% elderly) means current healthcare priorities should focus on maternal and child health, vaccination programs, and building robust primary care systems. However, planning for future aging is essential as today's large youth cohorts will eventually require elderly care services.`;
  } else {
    healthcare = `${countryName}'s moderate elderly population (${elderlyPercent.toFixed(1)}%) requires balanced healthcare investment across all age groups. While immediate elderly care demands are manageable, proactive planning for population aging, chronic disease prevention, and healthcare workforce development will position the country well for future demographic changes.`;
  }

  // Education implications
  let education = '';
  if (youthPercent > 25) {
    education = `The large youth population (${youthPercent.toFixed(1)}% or ${(youthPop / 1000000).toFixed(1)} million under 15) demands massive educational investment in ${countryName}. School infrastructure, teacher training, and educational quality improvements are urgent priorities. This generation's education will determine the country's future competitiveness and ability to leverage its demographic dividend.`;
  } else if (youthPercent < 15) {
    education = `With a smaller youth cohort (${youthPercent.toFixed(1)}%), ${countryName} can focus on educational quality over quantity. Fewer students per capita allows for enhanced per-pupil investment, smaller class sizes, and more personalized education. However, declining birth rates may lead to school consolidations and teacher surplus in some regions.`;
  } else {
    education = `${countryName}'s youth population of ${youthPercent.toFixed(1)}% represents balanced educational demands. Investment should focus on improving educational outcomes, digital literacy, and preparing students for a modern economy. Maintaining educational quality while adapting to changing demographics and skill requirements is key.`;
  }

  // Pension implications
  let pensions = '';
  if (dependencyRatio > 60) {
    pensions = `The high dependency ratio of ${dependencyRatio.toFixed(1)} means fewer working-age people support each dependent in ${countryName}. This strains pension systems and social security programs. Reforms may be needed including raising retirement ages, encouraging private savings, and diversifying pension funding sources to ensure long-term sustainability.`;
  } else if (dependencyRatio < 40) {
    pensions = `${countryName}'s favorable dependency ratio of ${dependencyRatio.toFixed(1)} provides a window of opportunity to strengthen pension systems. With more workers per dependent, now is the ideal time to build robust pension reserves, implement reforms, and establish sustainable social security systems for future demographic transitions.`;
  } else {
    pensions = `${countryName}'s dependency ratio of ${dependencyRatio.toFixed(1)} indicates moderate pressure on pension systems. Gradual reforms and strategic planning can maintain pension sustainability while ensuring adequate retirement security. Balancing current benefits with future obligations requires careful policy design and public engagement.`;
  }

  // Employment implications
  let employment = '';
  const annualJobCreation = Math.round((youthPop * 0.6) / 15); // Rough estimate of annual job market entrants
  if (youthPercent > 25) {
    employment = `${countryName} must create approximately ${(annualJobCreation / 1000).toFixed(0)},000 new jobs annually to absorb young people entering the workforce. This requires robust economic growth, entrepreneurship support, and skills training programs aligned with market demands. Failure to provide adequate employment opportunities could lead to social instability and youth emigration.`;
  } else if (youthPercent < 15) {
    employment = `With fewer young people entering the job market, ${countryName} may face labor shortages in coming decades. Strategies should include productivity improvements, automation adoption, immigration policies to fill skill gaps, and programs to extend working lives. The focus shifts from job creation to optimizing existing workforce potential.`;
  } else {
    employment = `${countryName} needs to create roughly ${(annualJobCreation / 1000).toFixed(0)},000 jobs annually for new workforce entrants. This manageable challenge allows for focus on job quality, skills development, and economic diversification. Investing in education-to-employment pathways and supporting innovation-driven industries will optimize demographic opportunities.`;
  }

  // Summary implications
  let summary = '';
  if (medianAge < 25) {
    summary = `${countryName}'s young population structure offers tremendous potential but requires immediate, large-scale investments in education, job creation, and social infrastructure. Successfully managing this demographic transition could unlock decades of economic growth and development.`;
  } else if (medianAge > 40) {
    summary = `${countryName}'s aging population demands strategic adaptation focusing on productivity enhancement, healthcare system strengthening, and pension sustainability. While challenges exist, proper planning can maintain prosperity and quality of life through demographic transition.`;
  } else {
    summary = `${countryName} sits at a demographic sweet spot with balanced age structure. This provides flexibility to prepare for future changes while capitalizing on current demographic advantages. Strategic investments now will position the country well for long-term prosperity.`;
  }

  return {
    economy,
    healthcare,
    education,
    pensions,
    employment,
    summary
  };
}