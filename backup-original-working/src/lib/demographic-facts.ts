import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

interface DemographicFact {
  icon: string;
  text: string;
  category: 'growth' | 'age' | 'projection' | 'comparison' | 'milestone';
}

export function generateDemographicFacts(
  countryName: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData,
  currentYear: number
): DemographicFact[] {
  const facts: DemographicFact[] = [];
  
  // Calculate historical growth if 1970 data available
  const data1970 = countryData.years['1970'];
  const data1990 = countryData.years['1990'];
  const data2000 = countryData.years['2000'];
  
  // Population growth facts
  if (data1970) {
    const growthMultiple = yearData.totalPopulation / data1970.totalPopulation;
    if (growthMultiple >= 3) {
      facts.push({
        icon: '📈',
        text: `${countryName}'s population has ${growthMultiple >= 4 ? 'quadrupled' : growthMultiple >= 3.5 ? 'more than tripled' : 'tripled'} since 1970, growing from ${(data1970.totalPopulation / 1000000).toFixed(1)} million to ${(yearData.totalPopulation / 1000000).toFixed(1)} million people`,
        category: 'growth'
      });
    } else if (growthMultiple >= 2) {
      facts.push({
        icon: '📊',
        text: `The population has doubled since 1970, with ${countryName} adding ${((yearData.totalPopulation - data1970.totalPopulation) / 1000000).toFixed(1)} million people over 54 years`,
        category: 'growth'
      });
    } else if (growthMultiple >= 1.5) {
      facts.push({
        icon: '⬆️',
        text: `${countryName}'s population has grown by ${((growthMultiple - 1) * 100).toFixed(0)}% since 1970, reflecting ${growthMultiple > 1.8 ? 'rapid' : 'steady'} demographic expansion`,
        category: 'growth'
      });
    } else if (growthMultiple < 0.95) {
      facts.push({
        icon: '📉',
        text: `${countryName} has experienced population decline, with ${((1 - growthMultiple) * 100).toFixed(0)}% fewer people than in 1970`,
        category: 'growth'
      });
    }
  }

  // Youth population facts
  if (metrics.youthPercentage > 40) {
    facts.push({
      icon: '👶',
      text: `Nearly half of all ${countryName.endsWith('s') ? countryName.slice(0, -1) : countryName}ans are children - ${metrics.youthPercentage.toFixed(0)}% of the population is under 15 years old`,
      category: 'age'
    });
  } else if (metrics.youthPercentage > 30) {
    facts.push({
      icon: '🎒',
      text: `1 in 3 people in ${countryName} is under 15 years old, creating massive demand for schools and youth services`,
      category: 'age'
    });
  } else if (metrics.youthPercentage < 15) {
    facts.push({
      icon: '🏫',
      text: `Only ${metrics.youthPercentage.toFixed(0)}% of ${countryName}'s population is under 15 - one of the world's smallest youth cohorts`,
      category: 'age'
    });
  }

  // Elderly population facts
  if (metrics.elderlyPercentage > 25) {
    facts.push({
      icon: '👴',
      text: `${countryName} is among the world's most aged societies, with 1 in 4 people over 65 years old`,
      category: 'age'
    });
  } else if (metrics.elderlyPercentage > 20) {
    facts.push({
      icon: '🦳',
      text: `${metrics.elderlyPercentage.toFixed(0)}% of the population is elderly (65+), making ${countryName} a rapidly aging society`,
      category: 'age'
    });
  } else if (metrics.elderlyPercentage < 3) {
    facts.push({
      icon: '🌱',
      text: `${countryName} has one of the world's youngest populations - only ${metrics.elderlyPercentage.toFixed(1)}% are over 65`,
      category: 'age'
    });
  }

  // Median age facts
  if (metrics.medianAge < 18) {
    facts.push({
      icon: '🎓',
      text: `Half of ${countryName}'s population is younger than ${metrics.medianAge.toFixed(1)} years old - younger than most high school graduates`,
      category: 'age'
    });
  } else if (metrics.medianAge > 45) {
    facts.push({
      icon: '⏰',
      text: `The median age of ${metrics.medianAge.toFixed(1)} years makes ${countryName} one of the world's most mature societies`,
      category: 'age'
    });
  } else if (data1970) {
    const ageChange = metrics.medianAge - data1970.medianAge;
    if (Math.abs(ageChange) > 0.5) {
      if (ageChange > 0) {
        facts.push({
          icon: '📅',
          text: `The median age has ${ageChange > 10 ? 'dramatically ' : ''}increased by ${ageChange.toFixed(1)} years since 1970${ageChange > 10 ? ', showing rapid population aging' : ''}`,
          category: 'age'
        });
      } else {
        facts.push({
          icon: '📅',
          text: `The median age has decreased by ${Math.abs(ageChange).toFixed(1)} years since 1970, indicating a growing youth population`,
          category: 'age'
        });
      }
    }
  }

  // Working age population facts
  if (metrics.workingAgePercentage > 70) {
    facts.push({
      icon: '💼',
      text: `${metrics.workingAgePercentage.toFixed(0)}% of the population is working age (15-64), providing a massive economic opportunity`,
      category: 'milestone'
    });
  } else if (metrics.workingAgePercentage < 55) {
    facts.push({
      icon: '⚖️',
      text: `Only ${metrics.workingAgePercentage.toFixed(0)}% are working age, meaning high dependency on fewer productive workers`,
      category: 'milestone'
    });
  }

  // Dependency ratio facts
  if (metrics.dependencyRatio > 80) {
    facts.push({
      icon: '🎯',
      text: `Each working-age person supports ${(metrics.dependencyRatio / 100 * 1).toFixed(1)} dependents - one of the world's highest dependency ratios`,
      category: 'comparison'
    });
  } else if (metrics.dependencyRatio < 40) {
    facts.push({
      icon: '🚀',
      text: `With only ${metrics.dependencyRatio.toFixed(0)} dependents per 100 workers, ${countryName} has ideal conditions for economic growth`,
      category: 'comparison'
    });
  }

  // Population density and size facts
  const populationInMillions = yearData.totalPopulation / 1000000;
  if (populationInMillions > 100) {
    facts.push({
      icon: '🌍',
      text: `With ${populationInMillions.toFixed(0)} million people, ${countryName} has more residents than most continents had in 1900`,
      category: 'comparison'
    });
  } else if (populationInMillions < 1) {
    facts.push({
      icon: '🏝️',
      text: `${countryName}'s entire population of ${(yearData.totalPopulation / 1000).toFixed(0)},000 could fit in a large sports stadium`,
      category: 'comparison'
    });
  }

  // Rapid change facts
  if (data2000) {
    const recentGrowth = ((yearData.totalPopulation - data2000.totalPopulation) / data2000.totalPopulation) * 100;
    if (recentGrowth > 50) {
      facts.push({
        icon: '⚡',
        text: `The population has grown by ${recentGrowth.toFixed(0)}% since 2000 - adding ${((yearData.totalPopulation - data2000.totalPopulation) / 1000000).toFixed(1)} million people in just 24 years`,
        category: 'growth'
      });
    } else if (recentGrowth < -5) {
      facts.push({
        icon: '📉',
        text: `${countryName} has lost ${Math.abs(recentGrowth).toFixed(1)}% of its population since 2000, reflecting demographic decline`,
        category: 'growth'
      });
    }
  }

  // Birth and fertility context - data not available in current structure
  // TODO: Add fertility rate data if needed in future versions

  // Urbanization facts - data not available in current structure
  // TODO: Add urbanization data if needed in future versions

  // Gender ratio facts
  const totalMales = yearData.ageGroups.reduce((sum, ag) => sum + ag.male, 0);
  const totalFemales = yearData.ageGroups.reduce((sum, ag) => sum + ag.female, 0);
  const maleRatio = (totalMales / totalFemales) * 100;
  
  if (maleRatio > 120) {
    facts.push({
      icon: '👨',
      text: `There are ${maleRatio.toFixed(0)} men for every 100 women, creating significant gender imbalances`,
      category: 'comparison'
    });
  } else if (maleRatio < 90) {
    facts.push({
      icon: '👩',
      text: `Women significantly outnumber men, with only ${maleRatio.toFixed(0)} males per 100 females`,
      category: 'comparison'
    });
  }

  // Future projection facts (simplified estimates)
  const currentGrowthRate = data2000 ? 
    Math.pow(yearData.totalPopulation / data2000.totalPopulation, 1/24) - 1 : 0.02;
  const projectedPop2050 = yearData.totalPopulation * Math.pow(1 + currentGrowthRate, 26);
  
  if (projectedPop2050 / yearData.totalPopulation > 1.5) {
    facts.push({
      icon: '🔮',
      text: `By 2050, ${countryName}'s population could reach ${(projectedPop2050 / 1000000).toFixed(0)} million people if current trends continue`,
      category: 'projection'
    });
  } else if (projectedPop2050 / yearData.totalPopulation < 0.9) {
    facts.push({
      icon: '📉',
      text: `Population is projected to decline to ${(projectedPop2050 / 1000000).toFixed(1)} million by 2050 due to low birth rates`,
      category: 'projection'
    });
  }

  // Global ranking context
  if (populationInMillions > 50) {
    facts.push({
      icon: '🏆',
      text: `${countryName} ranks among the world's most populous countries, with more people than most regions had throughout history`,
      category: 'comparison'
    });
  }

  // Return top 4-5 most interesting facts
  const priorityOrder = ['growth', 'age', 'milestone', 'comparison', 'projection'];
  const sortedFacts = facts.sort((a, b) => {
    return priorityOrder.indexOf(a.category) - priorityOrder.indexOf(b.category);
  });

  return sortedFacts.slice(0, 5);
}