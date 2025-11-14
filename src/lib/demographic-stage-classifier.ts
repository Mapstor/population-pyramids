import type { YearData } from '@/types/population';

export interface DemographicStage {
  stage: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  link: string;
}

export function classifyDemographicStage(data: YearData): DemographicStage {
  // Calculate key demographic indicators
  const totalPopulation = data.totalPopulation;
  const ageGroups = data.ageGroups;
  
  // Calculate age structure percentages
  const youth = ageGroups.filter(ag => ['0-4', '5-9', '10-14'].includes(ag.ageRange))
    .reduce((sum, ag) => sum + ag.total, 0) / totalPopulation * 100;
  
  const elderly = ageGroups.filter(ag => ['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'].includes(ag.ageRange))
    .reduce((sum, ag) => sum + ag.total, 0) / totalPopulation * 100;
  
  const working = ageGroups.filter(ag => ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64'].includes(ag.ageRange))
    .reduce((sum, ag) => sum + ag.total, 0) / totalPopulation * 100;

  // Approximate birth and death rates from age structure
  const birthRate = youth * 3.33; // Rough estimation based on 0-14 age group
  const deathRate = elderly * 0.8; // Rough estimation based on 65+ age group

  // Stage 1: High birth rate (>40), high death rate (>30), young population (>40% under 15)
  if (birthRate > 40 && deathRate > 25 && youth > 40) {
    return {
      stage: 1,
      name: "Stage 1: Pre-Transition",
      description: "High birth and death rates create slow population growth. Large families are common due to high infant mortality and agricultural economy.",
      link: "/blog/stage-1-demographic-transition"
    };
  }

  // Stage 2: High birth rate (>30), declining death rate (<20), rapid growth, very young population (>35% under 15)
  if (birthRate > 30 && deathRate < 20 && youth > 35) {
    return {
      stage: 2,
      name: "Stage 2: Early Transition", 
      description: "Death rates fall due to improved healthcare while birth rates remain high, causing rapid population growth and a very young age structure.",
      link: "/blog/stage-2-demographic-transition"
    };
  }

  // Stage 3: Declining birth rate (15-30), low death rate (<15), slowing growth, moderate youth (25-35% under 15)
  if (birthRate >= 15 && birthRate <= 30 && deathRate < 15 && youth >= 25 && youth <= 35) {
    return {
      stage: 3,
      name: "Stage 3: Late Transition",
      description: "Birth rates decline due to urbanization, education, and economic development. Population growth slows as families become smaller.",
      link: "/blog/stage-3-demographic-transition"
    };
  }

  // Stage 5: Very low birth rate (<10), low death rate, aging/declining population (>20% elderly)
  if (birthRate < 10 && elderly > 20) {
    return {
      stage: 5,
      name: "Stage 5: Post-Transition Decline",
      description: "Birth rates fall below replacement level, creating population decline and rapid aging. Countries face economic challenges from shrinking workforces.",
      link: "/blog/stage-5-demographic-transition"
    };
  }

  // Stage 4: Low birth rate (10-15), low death rate, stable/slow growth, balanced age structure
  return {
    stage: 4,
    name: "Stage 4: Post-Transition",
    description: "Low birth and death rates create stable population with balanced age structure. Most developed countries reach this equilibrium stage.",
    link: "/blog/stage-4-demographic-transition"
  };
}

export function getDemographicStageExplanation(stage: DemographicStage, countryName: string): string {
  return `${countryName} is in ${stage.name}. ${stage.description} You can read more about ${stage.name.toLowerCase()} here.`;
}