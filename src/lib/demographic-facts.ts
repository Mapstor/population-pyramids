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
  // Enhanced demographics for specific countries
  const enhancedCountries = [
    'Sweden', 'Hungary', 'Austria', 'Belarus', 'Serbia', 'Switzerland', 
    'Bulgaria', 'Israel', 'Singapore', 'Denmark', 'Slovakia', 'Norway', 
    'Ireland', 'Croatia', 'New Zealand', 'Lithuania', 'Slovenia', 'Latvia', 'Estonia',
    'Colombia', 'Morocco', 'Ecuador', 'Algeria', 'Myanmar', 'Saudi Arabia', 'Iraq', 'Cambodia', 'Jordan', 'Ghana',
    'Kenya', 'Venezuela', 'Uganda', 'Yemen', 'Nepal', 'Madagascar', 'Angola', 'Sri Lanka', 'Mozambique', 'Syria',
    'Peru', 'Malaysia', 'Uzbekistan', 'Afghanistan', 'Cameroon', 'Niger', 'Australia', 'North Korea', 'Mali',
    'Chile', 'Burkina Faso', 'Kazakhstan', 'Romania', 'Malawi', 'Zambia', 'Guatemala', 'Somalia', 'Senegal',
    'Netherlands', 'Chad', 'Zimbabwe', 'South Sudan', 'Belgium', 'Tunisia', 'Guinea', 'Rwanda', 'Benin',
    'Burundi', 'Bolivia', 'Haiti', 'Cuba', 'Dominican Republic', 'Czech Republic', 'Greece', 'Portugal', 'Azerbaijan',
    'Honduras', 'United Arab Emirates', 'Tajikistan', 'Papua New Guinea',
    'Togo', 'Sierra Leone', 'Laos', 'Paraguay', 'Libya', 'Lebanon', 'Nicaragua', 'Kyrgyzstan', 'El Salvador',
    'Turkmenistan', 'Oman', 'Costa Rica', 'Liberia', 'Bosnia and Herzegovina', 'Panama', 'Uruguay', 'Mongolia', 'Armenia', 'Jamaica', 'Kuwait', 'Albania',
    'Djibouti', 'Mauritius', 'Bahrain', 'Gambia', 'Gabon', 'Botswana', 'Namibia', 'Iceland', 'Fiji', 'Cyprus',
    'Solomon Islands', 'Trinidad and Tobago', 'Equatorial Guinea', 'Timor-Leste', 'Eswatini', 'Luxembourg', 'Malta', 'Brunei', 'Comoros',
    'Palestine', 'Vanuatu', 'United States', 'Tanzania', 'Tonga', 'Tuvalu',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Sudan', 'Suriname', 'Sao Tome and Principe'
  ];
  
  if (enhancedCountries.includes(countryName)) {
    return generateEnhancedFacts(countryName, yearData, metrics, countryData, currentYear);
  }

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

function generateEnhancedFacts(
  countryName: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData,
  currentYear: number
): DemographicFact[] {
  const data1970 = countryData.years['1970'];
  const facts: DemographicFact[] = [];

  // Generate specific facts based on country data
  switch (countryName) {
    case 'Sweden':
      facts.push(
        {
          icon: '📊',
          text: 'Sweden\'s population has grown by 28% since 1970, adding 2.3 million people through immigration and higher birth rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.5 years since 1970, reflecting Sweden\'s transition to an aging society',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 10.5 million people, Sweden has a larger population than many US states and EU countries',
          category: 'comparison'
        }
      );
      break;

    case 'Hungary':
      facts.push(
        {
          icon: '📊',
          text: 'Hungary\'s population has declined by 8% since 1990, losing over 800,000 people due to emigration and low birth rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has risen by 12.3 years since 1970, making Hungary one of Europe\'s fastest-aging nations',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 9.6 million people, Hungary has more residents than Switzerland and Austria combined',
          category: 'comparison'
        }
      );
      break;

    case 'Austria':
      facts.push(
        {
          icon: '📊',
          text: 'Austria\'s population has grown by 23% since 1970, adding 1.7 million people through immigration and natural increase',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 9.2 years since 1970, reflecting Austria\'s demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 9.1 million people, Austria has a similar population to London or New York City',
          category: 'comparison'
        }
      );
      break;

    case 'Belarus':
      facts.push(
        {
          icon: '📊',
          text: 'Belarus population has declined by 5% since 1990, losing nearly 500,000 people to emigration and demographic transition',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has risen by 11.8 years since 1970, showing rapid population aging in Eastern Europe',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 9.4 million people, Belarus has more residents than Switzerland or Israel',
          category: 'comparison'
        }
      );
      break;

    case 'Serbia':
      facts.push(
        {
          icon: '📊',
          text: 'Serbia\'s population has declined by 12% since 1990, losing over 900,000 people due to emigration and low fertility',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 14.6 years since 1970, making Serbia one of the world\'s fastest-aging societies',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 6.8 million people, Serbia has a larger population than Denmark, Finland, and Norway',
          category: 'comparison'
        }
      );
      break;

    case 'Switzerland':
      facts.push(
        {
          icon: '📊',
          text: 'Switzerland\'s population has grown by 37% since 1970, adding 2.4 million people through immigration and economic growth',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 7.8 years since 1970, showing controlled demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 8.8 million people, Switzerland has more residents than many European capitals and their metropolitan areas',
          category: 'comparison'
        }
      );
      break;

    case 'Bulgaria':
      facts.push(
        {
          icon: '📊',
          text: 'Bulgaria\'s population has declined by 23% since 1990, losing 2.1 million people to emigration and demographic collapse',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has risen by 16.4 years since 1970, making Bulgaria one of the world\'s most rapidly aging nations',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 6.9 million people, Bulgaria has a smaller population than London but covers an area larger than South Korea',
          category: 'comparison'
        }
      );
      break;

    case 'Israel':
      facts.push(
        {
          icon: '📊',
          text: 'Israel\'s population has tripled since 1970, growing from 3 million to 9.7 million people through immigration and high birth rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 2.4 years since 1970, maintaining one of the developed world\'s youngest populations',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 9.7 million people, Israel has more residents than Switzerland and a higher population density than Japan',
          category: 'comparison'
        }
      );
      break;

    case 'Singapore':
      facts.push(
        {
          icon: '📊',
          text: 'Singapore\'s population has tripled since 1970, growing from 2.1 million to 6 million people through immigration and economic development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 13.8 years since 1970, reflecting Singapore\'s rapid demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 6 million people in 728 km², Singapore has the world\'s second-highest population density after Monaco',
          category: 'comparison'
        }
      );
      break;

    case 'Denmark':
      facts.push(
        {
          icon: '📊',
          text: 'Denmark\'s population has grown by 15% since 1970, adding 750,000 people through immigration and natural increase',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 6.8 years since 1970, showing gradual demographic aging',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5.9 million people, Denmark has more residents than Norway and Finland combined',
          category: 'comparison'
        }
      );
      break;

    case 'Slovakia':
      facts.push(
        {
          icon: '📊',
          text: 'Slovakia\'s population has grown by 11% since 1970, adding 540,000 people despite post-communist emigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 12.1 years since 1970, reflecting Slovakia\'s accelerating demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5.5 million people, Slovakia has more residents than Ireland and New Zealand',
          category: 'comparison'
        }
      );
      break;

    case 'Norway':
      facts.push(
        {
          icon: '📊',
          text: 'Norway\'s population has grown by 34% since 1970, adding 1.3 million people through oil wealth and immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 6.2 years since 1970, showing controlled demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5.5 million people spread across 385,000 km², Norway has one of Europe\'s lowest population densities',
          category: 'comparison'
        }
      );
      break;

    case 'Ireland':
      facts.push(
        {
          icon: '📊',
          text: 'Ireland\'s population has grown by 65% since 1970, adding 2.1 million people through economic boom and immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 10.3 years since 1970, yet Ireland remains one of Europe\'s youngest societies',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5.1 million people, Ireland has experienced Europe\'s most dramatic population transformation since 1990',
          category: 'comparison'
        }
      );
      break;

    case 'Croatia':
      facts.push(
        {
          icon: '📊',
          text: 'Croatia\'s population has declined by 16% since 1990, losing 760,000 people due to war, emigration, and low birth rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has risen by 13.7 years since 1970, making Croatia one of Europe\'s most rapidly aging nations',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 3.9 million people, Croatia has fewer residents than most European capitals but covers more area than Switzerland',
          category: 'comparison'
        }
      );
      break;

    case 'New Zealand':
      facts.push(
        {
          icon: '📊',
          text: 'New Zealand\'s population has grown by 70% since 1970, adding 2.1 million people through immigration and natural increase',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.9 years since 1970, reflecting gradual demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5.2 million people across 268,000 km², New Zealand has a lower population density than most European countries',
          category: 'comparison'
        }
      );
      break;

    case 'Lithuania':
      facts.push(
        {
          icon: '📊',
          text: 'Lithuania\'s population has declined by 24% since 1990, losing 850,000 people to emigration and demographic collapse',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has risen by 15.2 years since 1970, showing one of the world\'s fastest aging rates',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.8 million people, Lithuania has lost more residents since independence than Latvia and Estonia combined',
          category: 'comparison'
        }
      );
      break;

    case 'Slovenia':
      facts.push(
        {
          icon: '📊',
          text: 'Slovenia\'s population has grown by 8% since 1970, adding 150,000 people despite post-Yugoslav challenges',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 12.8 years since 1970, reflecting rapid demographic aging in the Alps',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.1 million people, Slovenia has more residents per square kilometer than the United States',
          category: 'comparison'
        }
      );
      break;

    case 'Latvia':
      facts.push(
        {
          icon: '📊',
          text: 'Latvia\'s population has declined by 28% since 1990, losing 740,000 people to emigration and demographic crisis',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has risen by 14.8 years since 1970, making Latvia one of Europe\'s fastest-aging societies',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.9 million people, Latvia has fewer residents than many single cities but covers more area than Switzerland',
          category: 'comparison'
        }
      );
      break;

    case 'Estonia':
      facts.push(
        {
          icon: '📊',
          text: 'Estonia\'s population has declined by 18% since 1990, losing 260,000 people to emigration and low fertility rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 13.9 years since 1970, reflecting Estonia\'s rapid demographic transformation',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.3 million people, Estonia has fewer residents than many metropolitan areas but leads Europe in digital innovation',
          category: 'comparison'
        }
      );
      break;

    case 'Colombia':
      facts.push(
        {
          icon: '📊',
          text: 'Colombia\'s population has more than doubled since 1970, growing from 22 million to 52 million people through sustained economic development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 11.5 years since 1970, reflecting Colombia\'s demographic transition from young to mature society',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 52 million people, Colombia has more residents than Spain or South Korea and ranks as the 3rd most populous country in Latin America',
          category: 'comparison'
        }
      );
      break;

    case 'Morocco':
      facts.push(
        {
          icon: '📊',
          text: 'Morocco\'s population has doubled since 1970, growing from 18 million to 38 million people through declining mortality and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 13.2 years since 1970, showing Morocco\'s rapid transition from a young to aging society',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 38 million people, Morocco has more residents than Canada and represents nearly 40% of North Africa\'s total population',
          category: 'comparison'
        }
      );
      break;

    case 'Ecuador':
      facts.push(
        {
          icon: '📊',
          text: 'Ecuador\'s population has tripled since 1970, growing from 6.5 million to 18.3 million people through oil wealth and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 10.8 years since 1970, reflecting Ecuador\'s ongoing demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 18.3 million people, Ecuador has more residents than the Netherlands despite being smaller than California',
          category: 'comparison'
        }
      );
      break;

    case 'Algeria':
      facts.push(
        {
          icon: '📊',
          text: 'Algeria\'s population has tripled since 1970, growing from 14 million to 46 million people through oil revenues and improved healthcare',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 14.7 years since 1970, showing Algeria\'s dramatic demographic transformation',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 46 million people across Africa\'s largest country, Algeria has more residents than Argentina or Ukraine',
          category: 'comparison'
        }
      );
      break;

    case 'Myanmar':
      facts.push(
        {
          icon: '📊',
          text: 'Myanmar\'s population has doubled since 1970, growing from 27 million to 55 million people despite decades of political instability',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 9.4 years since 1970, reflecting Myanmar\'s gradual demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 55 million people, Myanmar has more residents than South Korea or Italy and ranks as Southeast Asia\'s 4th largest country',
          category: 'comparison'
        }
      );
      break;

    case 'Saudi Arabia':
      facts.push(
        {
          icon: '📊',
          text: 'Saudi Arabia\'s population has quadrupled since 1970, growing from 6 million to 36 million people through oil wealth and immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 12.8 years since 1970, yet Saudi Arabia maintains a relatively young population profile',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 36 million people across the Arabian Peninsula, Saudi Arabia has more residents than Canada or Poland',
          category: 'comparison'
        }
      );
      break;

    case 'Iraq':
      facts.push(
        {
          icon: '📊',
          text: 'Iraq\'s population has tripled since 1970, growing from 13 million to 45 million people despite wars and sanctions',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 4.2 years since 1970, maintaining one of the Middle East\'s youngest populations',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 45 million people, Iraq has more residents than Argentina and represents nearly 10% of the entire Arab world\'s population',
          category: 'comparison'
        }
      );
      break;

    case 'Cambodia':
      facts.push(
        {
          icon: '📊',
          text: 'Cambodia\'s population has doubled since 1990, growing from 8.7 million to 17.3 million people following post-conflict recovery',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 11.6 years since 1970, reflecting Cambodia\'s remarkable demographic recovery',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 17.3 million people, Cambodia has more residents than the Netherlands or Chile despite its tragic recent history',
          category: 'comparison'
        }
      );
      break;

    case 'Jordan':
      facts.push(
        {
          icon: '📊',
          text: 'Jordan\'s population has grown sixfold since 1970, expanding from 1.7 million to 11.3 million people through refugee influxes and high fertility',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.9 years since 1970, yet Jordan maintains a young population due to high birth rates',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 11.3 million people in a country smaller than South Korea, Jordan has one of the highest population densities in the Middle East',
          category: 'comparison'
        }
      );
      break;

    case 'Ghana':
      facts.push(
        {
          icon: '📊',
          text: 'Ghana\'s population has tripled since 1970, growing from 9 million to 33 million people through economic growth and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 3.8 years since 1970, maintaining one of Africa\'s youngest population profiles',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 33 million people, Ghana has more residents than Canada or Malaysia and leads West Africa in democratic governance',
          category: 'comparison'
        }
      );
      break;

    case 'Kenya':
      facts.push(
        {
          icon: '📊',
          text: 'Kenya\'s population has grown by 156% since 1970, expanding from 11.3 million to 55.1 million people through improved healthcare and economic development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 4.2 years since 1970, yet Kenya maintains one of Africa\'s youngest population profiles',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 55 million people, Kenya has more residents than South Korea and serves as East Africa\'s economic and cultural hub',
          category: 'comparison'
        },
        {
          icon: '🏆',
          text: 'Kenya ranks as the 26th most populous country globally and leads East Africa in technology innovation and wildlife conservation',
          category: 'milestone'
        }
      );
      break;

    case 'Venezuela':
      facts.push(
        {
          icon: '📊',
          text: 'Venezuela\'s population has doubled since 1970, growing from 11.4 million to 28.8 million people through oil wealth and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 12.8 years since 1970, reflecting Venezuela\'s demographic transition amid economic challenges',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 29 million people, Venezuela has more residents than Australia and represents 8% of South America\'s total population',
          category: 'comparison'
        },
        {
          icon: '⚡',
          text: 'Despite recent emigration, Venezuela maintains massive oil reserves and potential for demographic and economic recovery',
          category: 'milestone'
        }
      );
      break;

    case 'Uganda':
      facts.push(
        {
          icon: '📊',
          text: 'Uganda\'s population has quadrupled since 1970, growing from 10.3 million to 48.4 million people through high fertility and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.8 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 48 million people, Uganda has more residents than Spain and ranks as the 2nd most populous country in East Africa',
          category: 'comparison'
        },
        {
          icon: '👶',
          text: 'Nearly half of Ugandans are under 15, creating the world\'s most youthful demographic profile with massive future potential',
          category: 'milestone'
        }
      );
      break;

    case 'Yemen':
      facts.push(
        {
          icon: '📊',
          text: 'Yemen\'s population has tripled since 1970, growing from 6.8 million to 34.4 million people despite ongoing conflict and challenges',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.1 years since 1970, yet Yemen maintains a young population profile across the Arabian Peninsula',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 34 million people, Yemen has more residents than Saudi Arabia\'s neighbors and controls strategic shipping routes',
          category: 'comparison'
        },
        {
          icon: '🏺',
          text: 'Yemen represents one of the world\'s oldest civilizations with continuous habitation for over 3,000 years',
          category: 'milestone'
        }
      );
      break;

    case 'Nepal':
      facts.push(
        {
          icon: '📊',
          text: 'Nepal\'s population has tripled since 1970, growing from 11.6 million to 30.9 million people through improved healthcare and education',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.4 years since 1970, showing Nepal\'s gradual demographic transition in the Himalayas',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 31 million people, Nepal has more residents than Australia despite being landlocked between China and India',
          category: 'comparison'
        },
        {
          icon: '🏔️',
          text: 'Nepal contains 8 of the world\'s 14 highest peaks including Mount Everest, making it a global destination for mountaineering',
          category: 'milestone'
        }
      );
      break;

    case 'Madagascar':
      facts.push(
        {
          icon: '📊',
          text: 'Madagascar\'s population has tripled since 1970, growing from 7.6 million to 30.3 million people through natural increase and improved survival rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 4.1 years since 1970, maintaining a relatively young population structure in the Indian Ocean',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 30 million people, Madagascar has more residents than Australia and represents the world\'s 4th largest island nation',
          category: 'comparison'
        },
        {
          icon: '🐾',
          text: 'Madagascar hosts 90% of wildlife species found nowhere else on Earth, making it a unique biodiversity hotspot',
          category: 'milestone'
        }
      );
      break;

    case 'Angola':
      facts.push(
        {
          icon: '📊',
          text: 'Angola\'s population has tripled since 1970, growing from 6.2 million to 36.7 million people through post-conflict recovery and oil revenues',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 2.5 years since 1970, maintaining one of Africa\'s youngest demographic profiles',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 37 million people, Angola has more residents than Canada and ranks as sub-Saharan Africa\'s 3rd largest oil producer',
          category: 'comparison'
        },
        {
          icon: '💎',
          text: 'Angola produces some of the world\'s highest quality diamonds and has Africa\'s 2nd largest oil reserves',
          category: 'milestone'
        }
      );
      break;

    case 'Sri Lanka':
      facts.push(
        {
          icon: '📊',
          text: 'Sri Lanka\'s population has doubled since 1970, growing from 12.5 million to 22.0 million people through economic development and education',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 15.3 years since 1970, showing Sri Lanka\'s rapid demographic transition to an aging society',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 22 million people in an island smaller than Ireland, Sri Lanka has one of South Asia\'s highest population densities',
          category: 'comparison'
        },
        {
          icon: '🌿',
          text: 'Sri Lanka boasts the world\'s highest literacy rate in South Asia and pioneered free healthcare and education systems',
          category: 'milestone'
        }
      );
      break;

    case 'Mozambique':
      facts.push(
        {
          icon: '📊',
          text: 'Mozambique\'s population has tripled since 1970, growing from 8.8 million to 33.9 million people through post-independence recovery and development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 1.9 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 34 million people, Mozambique has more residents than Canada and controls 2,500km of strategic Indian Ocean coastline',
          category: 'comparison'
        },
        {
          icon: '🌊',
          text: 'Mozambique possesses some of the world\'s largest untapped natural gas reserves and pristine marine ecosystems',
          category: 'milestone'
        }
      );
      break;

    case 'Syria':
      facts.push(
        {
          icon: '📊',
          text: 'Syria\'s population has doubled since 1970, growing from 6.8 million to 23.2 million people despite recent conflict and displacement',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 11.6 years since 1970, reflecting Syria\'s demographic transition amid regional challenges',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 23 million people, Syria has more residents than Romania and represents a crucial crossroads between Asia and Europe',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Syria contains 6 UNESCO World Heritage Sites including Damascus, one of the world\'s oldest continuously inhabited cities',
          category: 'milestone'
        }
      );
      break;

    case 'Peru':
      facts.push(
        {
          icon: '📊',
          text: 'Peru\'s population has doubled since 1970, growing from 13.6 million to 33.7 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 11.4 years since 1970, reflecting Peru\'s demographic transition in the Andes',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 34 million people, Peru has more residents than Canada and ranks as South America\'s 5th most populous country',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Peru contains Machu Picchu and represents the heart of the ancient Incan Empire, hosting 13 UNESCO World Heritage Sites',
          category: 'milestone'
        }
      );
      break;

    case 'Malaysia':
      facts.push(
        {
          icon: '📊',
          text: 'Malaysia\'s population has doubled since 1970, growing from 10.9 million to 34.3 million people through economic transformation and immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 10.8 years since 1970, showing Malaysia\'s rapid demographic and economic modernization',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 34 million people across Peninsular Malaysia and Borneo, Malaysia controls strategic shipping lanes between Asia and Europe',
          category: 'comparison'
        },
        {
          icon: '🌴',
          text: 'Malaysia leads the world in palm oil production and contains some of Earth\'s oldest tropical rainforests',
          category: 'milestone'
        }
      );
      break;

    case 'Uzbekistan':
      facts.push(
        {
          icon: '📊',
          text: 'Uzbekistan\'s population has doubled since 1970, growing from 12.5 million to 36.4 million people through post-Soviet independence and development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 7.9 years since 1970, reflecting Uzbekistan\'s gradual demographic transition in Central Asia',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 36 million people, Uzbekistan has more residents than Canada and represents Central Asia\'s most populous country',
          category: 'comparison'
        },
        {
          icon: '🏺',
          text: 'Uzbekistan contains Samarkand and Bukhara, ancient Silk Road cities that were centers of Islamic scholarship for over 1,000 years',
          category: 'milestone'
        }
      );
      break;

    case 'Afghanistan':
      facts.push(
        {
          icon: '📊',
          text: 'Afghanistan\'s population has tripled since 1970, growing from 11.2 million to 42.2 million people despite decades of conflict',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 2.1 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 42 million people, Afghanistan has more residents than Argentina and serves as a crucial bridge between Central and South Asia',
          category: 'comparison'
        },
        {
          icon: '🗻',
          text: 'Afghanistan sits at the crossroads of ancient civilizations and contains the Hindu Kush mountains with peaks over 7,000 meters',
          category: 'milestone'
        }
      );
      break;

    case 'Cameroon':
      facts.push(
        {
          icon: '📊',
          text: 'Cameroon\'s population has tripled since 1970, growing from 6.0 million to 28.6 million people through oil revenues and agricultural development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 3.1 years since 1970, maintaining a young population profile in Central Africa',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 29 million people, Cameroon has more residents than Australia and represents Central Africa\'s most populous country',
          category: 'comparison'
        },
        {
          icon: '🦍',
          text: 'Cameroon contains Africa\'s second-largest rainforest and serves as a crucial habitat for endangered gorillas and chimpanzees',
          category: 'milestone'
        }
      );
      break;

    case 'Niger':
      facts.push(
        {
          icon: '📊',
          text: 'Niger\'s population has tripled since 1970, growing from 4.0 million to 27.2 million people through one of the world\'s highest fertility rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 0.4 years since 1970, maintaining the world\'s youngest population with half under 15',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 27 million people across the Sahel, Niger has more residents than Australia despite facing significant climate challenges',
          category: 'comparison'
        },
        {
          icon: '⚛️',
          text: 'Niger produces 20% of the world\'s uranium and contains some of the planet\'s largest uranium deposits',
          category: 'milestone'
        }
      );
      break;

    case 'Australia':
      facts.push(
        {
          icon: '📊',
          text: 'Australia\'s population has doubled since 1970, growing from 12.7 million to 26.6 million people through immigration and economic prosperity',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 4.8 years since 1970, reflecting Australia\'s controlled demographic transition and aging workforce',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 27 million people across 7.7 million km², Australia has one of the world\'s lowest population densities at 3.5 people per km²',
          category: 'comparison'
        },
        {
          icon: '🦘',
          text: 'Australia contains 80% of animal and plant species found nowhere else on Earth, making it a unique biodiversity continent',
          category: 'milestone'
        }
      );
      break;

    case 'North Korea':
      facts.push(
        {
          icon: '📊',
          text: 'North Korea\'s population has doubled since 1970, growing from 14.4 million to 26.2 million people despite economic isolation',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 15.8 years since 1970, showing rapid demographic aging in one of the world\'s most closed societies',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 26 million people, North Korea has more residents than Australia and maintains one of Asia\'s highest population densities',
          category: 'comparison'
        },
        {
          icon: '🏔️',
          text: 'North Korea contains Mount Paektu, considered sacred by Koreans and forming the border with China at 2,744 meters elevation',
          category: 'milestone'
        }
      );
      break;

    case 'Mali':
      facts.push(
        {
          icon: '📊',
          text: 'Mali\'s population has tripled since 1970, growing from 5.5 million to 23.3 million people through high fertility and improved survival rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.7 years since 1970, maintaining one of Africa\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 23 million people across the Sahel, Mali has more residents than Romania and covers an area larger than South Africa',
          category: 'comparison'
        },
        {
          icon: '🏺',
          text: 'Mali contains Timbuktu, once the center of Islamic learning and trade, and 4 UNESCO World Heritage Sites',
          category: 'milestone'
        }
      );
      break;

    case 'Chile':
      facts.push(
        {
          icon: '📊',
          text: 'Chile\'s population has grown by 48% since 1970, expanding from 9.5 million to 19.6 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 12.4 years since 1970, reflecting Chile\'s rapid demographic transition in South America',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 20 million people in a narrow strip 4,300km long, Chile has one of the world\'s most unique geographical populations',
          category: 'comparison'
        },
        {
          icon: '🏔️',
          text: 'Chile controls the Atacama Desert, the world\'s driest non-polar desert, and contains 25% of global copper reserves',
          category: 'milestone'
        }
      );
      break;

    case 'Burkina Faso':
      facts.push(
        {
          icon: '📊',
          text: 'Burkina Faso\'s population has quadrupled since 1970, growing from 5.2 million to 23.3 million people through high fertility and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.2 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 23 million people in the Sahel region, Burkina Faso has more residents than Romania despite landlocked challenges',
          category: 'comparison'
        },
        {
          icon: '🥇',
          text: 'Burkina Faso produces 10% of the world\'s cotton and leads West Africa in gold mining production',
          category: 'milestone'
        }
      );
      break;

    case 'Kazakhstan':
      facts.push(
        {
          icon: '📊',
          text: 'Kazakhstan\'s population has grown by 51% since 1970, expanding from 13.2 million to 20.0 million people through post-Soviet development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 6.8 years since 1970, reflecting Kazakhstan\'s gradual demographic modernization in Central Asia',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 20 million people across 2.7 million km², Kazakhstan has one of the world\'s lowest population densities at 7 people per km²',
          category: 'comparison'
        },
        {
          icon: '⚛️',
          text: 'Kazakhstan contains 40% of world uranium reserves and serves as the primary launch site for international space missions',
          category: 'milestone'
        }
      );
      break;

    case 'Romania':
      facts.push(
        {
          icon: '📊',
          text: 'Romania\'s population has declined by 6% since 1990, losing 1.3 million people to emigration following EU integration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 11.2 years since 1970, showing Romania\'s rapid demographic transition in Eastern Europe',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 19 million people, Romania has more residents than the Netherlands and represents the EU\'s 7th most populous member',
          category: 'comparison'
        },
        {
          icon: '🏰',
          text: 'Romania contains the Carpathian Mountains, Dracula\'s castle, and Europe\'s largest remaining old-growth forests',
          category: 'milestone'
        }
      );
      break;

    case 'Malawi':
      facts.push(
        {
          icon: '📊',
          text: 'Malawi\'s population has tripled since 1970, growing from 4.5 million to 20.4 million people through improved healthcare and high fertility',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.8 years since 1970, maintaining one of Africa\'s youngest demographic profiles',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 20 million people in a landlocked country smaller than England, Malawi has one of Africa\'s highest population densities',
          category: 'comparison'
        },
        {
          icon: '🏞️',
          text: 'Malawi contains Lake Malawi, Africa\'s 3rd largest lake with more fish species than any other lake in the world',
          category: 'milestone'
        }
      );
      break;

    case 'Zambia':
      facts.push(
        {
          icon: '📊',
          text: 'Zambia\'s population has quadrupled since 1970, growing from 4.2 million to 20.0 million people through copper wealth and high fertility',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.5 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 20 million people across the Zambezi basin, Zambia has more residents than Romania and controls major water resources',
          category: 'comparison'
        },
        {
          icon: '💎',
          text: 'Zambia produces 70% of Africa\'s copper and contains Victoria Falls, one of the world\'s largest waterfalls',
          category: 'milestone'
        }
      );
      break;

    case 'Guatemala':
      facts.push(
        {
          icon: '📊',
          text: 'Guatemala\'s population has tripled since 1970, growing from 5.2 million to 18.1 million people through high birth rates and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 7.8 years since 1970, showing Guatemala\'s gradual demographic transition in Central America',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 18 million people, Guatemala has more residents than the Netherlands and represents Central America\'s most populous country',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Guatemala contains Tikal, one of the largest Maya cities, and represents the heart of ancient Maya civilization',
          category: 'milestone'
        }
      );
      break;

    case 'Somalia':
      facts.push(
        {
          icon: '📊',
          text: 'Somalia\'s population has tripled since 1970, growing from 3.7 million to 18.1 million people despite decades of conflict and instability',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.4 years since 1970, maintaining one of the world\'s youngest populations with half under 18',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 18 million people along the Horn of Africa, Somalia controls the longest coastline in mainland Africa at 3,025km',
          category: 'comparison'
        },
        {
          icon: '🐪',
          text: 'Somalia contains 25% of the world\'s camels and represents one of Africa\'s most important nomadic pastoral societies',
          category: 'milestone'
        }
      );
      break;

    case 'Senegal':
      facts.push(
        {
          icon: '📊',
          text: 'Senegal\'s population has tripled since 1970, growing from 4.0 million to 17.7 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 3.8 years since 1970, maintaining a young population profile in West Africa',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 18 million people, Senegal has more residents than the Netherlands and serves as West Africa\'s democratic anchor',
          category: 'comparison'
        },
        {
          icon: '🏝️',
          text: 'Senegal contains Goree Island, a UNESCO World Heritage site that served as a major slave trade center for 400 years',
          category: 'milestone'
        }
      );
      break;

    case 'Netherlands':
      facts.push(
        {
          icon: '📊',
          text: 'Netherlands\' population has grown by 33% since 1970, expanding from 13.0 million to 17.5 million people through immigration and economic prosperity',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 6.8 years since 1970, reflecting the Netherlands\' controlled demographic transition in Western Europe',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 18 million people in 41,500 km², Netherlands has one of the world\'s highest population densities at 421 people per km²',
          category: 'comparison'
        },
        {
          icon: '🌊',
          text: 'Netherlands sits 26% below sea level with advanced flood management systems protecting millions from the North Sea',
          category: 'milestone'
        }
      );
      break;

    case 'Chad':
      facts.push(
        {
          icon: '📊',
          text: 'Chad\'s population has tripled since 1970, growing from 3.6 million to 18.2 million people despite landlocked challenges and climate variability',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.1 years since 1970, maintaining one of the world\'s youngest populations in the Sahel',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 18 million people across the Sahara transition zone, Chad has more residents than the Netherlands despite geographic challenges',
          category: 'comparison'
        },
        {
          icon: '🏜️',
          text: 'Chad bridges the Sahara and sub-Saharan Africa, containing Lake Chad and serving as a crucial migration corridor',
          category: 'milestone'
        }
      );
      break;

    case 'Zimbabwe':
      facts.push(
        {
          icon: '📊',
          text: 'Zimbabwe\'s population has grown by 83% since 1970, expanding from 5.2 million to 16.3 million people despite economic challenges',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 2.1 years since 1970, maintaining a relatively young population profile in Southern Africa',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 16 million people, Zimbabwe has more residents than Belgium and contains Africa\'s largest waterfall complex at Victoria Falls',
          category: 'comparison'
        },
        {
          icon: '🏺',
          text: 'Zimbabwe contains Great Zimbabwe ruins, ancient stone city that gave the country its name and UNESCO World Heritage status',
          category: 'milestone'
        }
      );
      break;

    case 'South Sudan':
      facts.push(
        {
          icon: '📊',
          text: 'South Sudan\'s population has doubled since 1970, growing from 3.4 million to 11.1 million people through post-independence development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 2.8 years since 1970, maintaining one of the world\'s youngest populations since independence in 2011',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 11 million people, South Sudan has more residents than Belgium and represents the world\'s newest sovereign nation',
          category: 'comparison'
        },
        {
          icon: '🛢️',
          text: 'South Sudan contains 75% of former Sudan\'s oil reserves and controls crucial White Nile headwater regions',
          category: 'milestone'
        }
      );
      break;

    case 'Belgium':
      facts.push(
        {
          icon: '📊',
          text: 'Belgium\'s population has grown by 19% since 1970, expanding from 9.7 million to 11.7 million people through EU integration and immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 6.2 years since 1970, showing Belgium\'s gradual demographic transition in Western Europe',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 12 million people in 30,500 km², Belgium has a higher population density than the Netherlands at 383 people per km²',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Belgium hosts EU headquarters in Brussels and contains 15 UNESCO World Heritage Sites including medieval Bruges',
          category: 'milestone'
        }
      );
      break;

    case 'Tunisia':
      facts.push(
        {
          icon: '📊',
          text: 'Tunisia\'s population has doubled since 1970, growing from 5.1 million to 12.4 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 14.8 years since 1970, showing Tunisia\'s dramatic demographic transition in North Africa',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 12 million people, Tunisia has more residents than Belgium and serves as the birthplace of the Arab Spring movement',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Tunisia contains Carthage ruins and 8 UNESCO World Heritage Sites, representing 3,000 years of Mediterranean civilization',
          category: 'milestone'
        }
      );
      break;

    case 'Guinea':
      facts.push(
        {
          icon: '📊',
          text: 'Guinea\'s population has tripled since 1970, growing from 4.0 million to 14.2 million people through natural increase and mining development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 2.4 years since 1970, maintaining one of West Africa\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 14 million people, Guinea has more residents than Belgium and contains the source of major West African rivers',
          category: 'comparison'
        },
        {
          icon: '💎',
          text: 'Guinea contains 25% of the world\'s bauxite reserves and produces aluminum for global industry',
          category: 'milestone'
        }
      );
      break;

    case 'Rwanda':
      facts.push(
        {
          icon: '📊',
          text: 'Rwanda\'s population has tripled since 1970, growing from 3.7 million to 13.8 million people through post-genocide recovery and development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 3.2 years since 1970, maintaining a young population profile in the Great Lakes region',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 14 million people in 26,300 km², Rwanda has Africa\'s highest population density at 525 people per km²',
          category: 'comparison'
        },
        {
          icon: '🦍',
          text: 'Rwanda protects 30% of the world\'s remaining mountain gorillas and leads Africa in environmental conservation initiatives',
          category: 'milestone'
        }
      );
      break;

    case 'Benin':
      facts.push(
        {
          icon: '📊',
          text: 'Benin\'s population has tripled since 1970, growing from 2.8 million to 13.5 million people through high fertility and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 2.1 years since 1970, maintaining one of West Africa\'s youngest demographic profiles',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 14 million people, Benin has more residents than Belgium and serves as the birthplace of the Vodun religion',
          category: 'comparison'
        },
        {
          icon: '👑',
          text: 'Benin was the seat of the powerful Kingdom of Dahomey and contains multiple UNESCO World Heritage royal palaces',
          category: 'milestone'
        }
      );
      break;

    case 'Burundi':
      facts.push(
        {
          icon: '📊',
          text: 'Burundi\'s population has tripled since 1970, growing from 3.5 million to 13.2 million people despite being one of the world\'s smallest countries',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.9 years since 1970, maintaining one of the world\'s youngest populations in East Africa',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 13 million people in 27,800 km², Burundi has one of Africa\'s highest population densities at 463 people per km²',
          category: 'comparison'
        },
        {
          icon: '🌊',
          text: 'Burundi controls part of Lake Tanganyika, the world\'s longest and second-deepest freshwater lake',
          category: 'milestone'
        }
      );
      break;

    case 'Bolivia':
      facts.push(
        {
          icon: '📊',
          text: 'Bolivia\'s population has doubled since 1970, growing from 4.2 million to 12.3 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 9.8 years since 1970, showing Bolivia\'s demographic transition in the Andes',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 12 million people, Bolivia has more residents than Belgium and contains the world\'s largest salt flat at Salar de Uyuni',
          category: 'comparison'
        },
        {
          icon: '🏔️',
          text: 'Bolivia contains the world\'s highest capital city La Paz at 3,500 meters and 60% of global lithium reserves',
          category: 'milestone'
        }
      );
      break;

    case 'Haiti':
      facts.push(
        {
          icon: '📊',
          text: 'Haiti\'s population has doubled since 1970, growing from 4.5 million to 11.7 million people despite economic and natural challenges',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 6.8 years since 1970, reflecting Haiti\'s gradual demographic transition in the Caribbean',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 12 million people in 27,800 km², Haiti has a higher population density than Cuba despite occupying only one-third of Hispaniola',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Haiti became the world\'s first independent Black republic in 1804 and the second independent nation in the Americas',
          category: 'milestone'
        }
      );
      break;

    case 'Cuba':
      facts.push(
        {
          icon: '📊',
          text: 'Cuba\'s population has grown by 33% since 1970, expanding from 8.6 million to 11.2 million people through socialist development policies',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 18.2 years since 1970, making Cuba one of the Caribbean\'s most rapidly aging societies',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 11 million people, Cuba has more residents than Belgium and represents the Caribbean\'s most populous island nation',
          category: 'comparison'
        },
        {
          icon: '⚕️',
          text: 'Cuba achieved universal healthcare and literacy, producing more doctors per capita than any other country in the world',
          category: 'milestone'
        }
      );
      break;

    case 'Dominican Republic':
      facts.push(
        {
          icon: '📊',
          text: 'Dominican Republic\'s population has doubled since 1970, growing from 4.4 million to 11.3 million people through economic growth and tourism',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.6 years since 1970, showing the Dominican Republic\'s demographic transition in the Caribbean',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 11 million people, the Dominican Republic has more residents than Cuba and shares Hispaniola island with Haiti',
          category: 'comparison'
        },
        {
          icon: '🏝️',
          text: 'Dominican Republic contains the Caribbean\'s highest peak Pico Duarte and the first European settlement in the Americas',
          category: 'milestone'
        }
      );
      break;

    case 'Czech Republic':
      facts.push(
        {
          icon: '📊',
          text: 'Czech Republic\'s population has grown by 14% since 1970, expanding from 9.8 million to 10.5 million people through post-communist development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 7.8 years since 1970, reflecting the Czech Republic\'s demographic transition in Central Europe',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 11 million people, Czech Republic has more residents than Austria and serves as Central Europe\'s industrial heart',
          category: 'comparison'
        },
        {
          icon: '🏰',
          text: 'Czech Republic contains Prague Castle, the world\'s largest ancient castle complex, and 16 UNESCO World Heritage Sites',
          category: 'milestone'
        }
      );
      break;

    case 'Greece':
      facts.push(
        {
          icon: '📊',
          text: 'Greece\'s population has grown by 17% since 1970, expanding from 8.8 million to 10.4 million people through EU membership and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 12.8 years since 1970, making Greece one of Europe\'s most rapidly aging societies',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 10 million people across 6,000 islands, Greece has more residents than Austria and controls strategic Mediterranean passages',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Greece is the birthplace of democracy, philosophy, and the Olympic Games, with 18 UNESCO World Heritage Sites',
          category: 'milestone'
        }
      );
      break;

    case 'Portugal':
      facts.push(
        {
          icon: '📊',
          text: 'Portugal\'s population has grown by 11% since 1970, expanding from 9.0 million to 10.3 million people through EU integration and economic development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 13.2 years since 1970, showing Portugal\'s rapid demographic transition in Western Europe',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 10 million people, Portugal has more residents than Austria and established the world\'s first global maritime empire',
          category: 'comparison'
        },
        {
          icon: '🌊',
          text: 'Portugal pioneered ocean exploration, establishing trade routes to Asia and Brazil, and contains 17 UNESCO World Heritage Sites',
          category: 'milestone'
        }
      );
      break;

    case 'Azerbaijan':
      facts.push(
        {
          icon: '📊',
          text: 'Azerbaijan\'s population has grown by 36% since 1970, expanding from 5.2 million to 10.1 million people through oil wealth and post-Soviet development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 7.4 years since 1970, reflecting Azerbaijan\'s gradual demographic transition in the Caucasus',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 10 million people, Azerbaijan has more residents than Austria and bridges Europe and Asia at the Caspian Sea',
          category: 'comparison'
        },
        {
          icon: '🛢️',
          text: 'Azerbaijan contains 7% of global oil reserves and the world\'s first offshore oil platform, pioneering modern petroleum industry',
          category: 'milestone'
        }
      );
      break;

    case 'Honduras':
      facts.push(
        {
          icon: '📊',
          text: 'Honduras\' population has tripled since 1970, growing from 2.6 million to 10.4 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.2 years since 1970, showing Honduras\' demographic transition in Central America',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 10 million people, Honduras has more residents than Austria and represents Central America\'s 3rd most populous country',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Honduras contains Copán, one of the most important Maya archaeological sites and a UNESCO World Heritage center',
          category: 'milestone'
        }
      );
      break;

    case 'United Arab Emirates':
      facts.push(
        {
          icon: '📊',
          text: 'UAE\'s population has grown 50-fold since 1970, exploding from 230,000 to 9.4 million people through oil wealth and massive immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 6.8 years since 1970, yet the UAE maintains a relatively young population due to immigration',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 9 million people, the UAE has more residents than Austria despite being founded as recently as 1971',
          category: 'comparison'
        },
        {
          icon: '🏗️',
          text: 'UAE contains the world\'s tallest building Burj Khalifa and has transformed from desert to global business hub in 50 years',
          category: 'milestone'
        }
      );
      break;

    case 'Tajikistan':
      facts.push(
        {
          icon: '📊',
          text: 'Tajikistan\'s population has doubled since 1970, growing from 3.0 million to 10.1 million people through post-Soviet development and high fertility',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 4.8 years since 1970, maintaining a relatively young population in Central Asia',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 10 million people, Tajikistan has more residents than Austria and controls crucial water resources in Central Asia',
          category: 'comparison'
        },
        {
          icon: '🏔️',
          text: 'Tajikistan is 93% mountainous with the Pamir Mountains and contains glaciers that supply water to Central Asian rivers',
          category: 'milestone'
        }
      );
      break;

    case 'Papua New Guinea':
      facts.push(
        {
          icon: '📊',
          text: 'Papua New Guinea\'s population has tripled since 1970, growing from 2.4 million to 9.9 million people through natural increase and development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 4.2 years since 1970, maintaining one of the Pacific\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 10 million people across 600 islands, Papua New Guinea has more residents than Austria and incredible linguistic diversity',
          category: 'comparison'
        },
        {
          icon: '🗣️',
          text: 'Papua New Guinea contains over 800 languages, representing 12% of all world languages in just one country',
          category: 'milestone'
        }
      );
      break;

    case 'Togo':
      facts.push(
        {
          icon: '📊',
          text: 'Togo\'s population has tripled since 1970, growing from 2.0 million to 8.8 million people through high fertility and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 2.8 years since 1970, maintaining one of West Africa\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 9 million people in a narrow coastal strip, Togo has more residents than Austria despite being one of Africa\'s smallest countries',
          category: 'comparison'
        },
        {
          icon: '🌍',
          text: 'Togo serves as a crucial commercial gateway for landlocked Sahel countries, connecting the Atlantic coast to the interior',
          category: 'milestone'
        }
      );
      break;

    case 'Sierra Leone':
      facts.push(
        {
          icon: '📊',
          text: 'Sierra Leone\'s population has doubled since 1970, growing from 2.8 million to 8.6 million people through post-conflict recovery and development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 2.1 years since 1970, maintaining one of the world\'s youngest population profiles',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 9 million people, Sierra Leone has more residents than Austria and contains some of the world\'s finest diamonds',
          category: 'comparison'
        },
        {
          icon: '💎',
          text: 'Sierra Leone produces exceptional diamonds and was historically known as the "Athens of West Africa" for education',
          category: 'milestone'
        }
      );
      break;

    case 'Laos':
      facts.push(
        {
          icon: '📊',
          text: 'Laos\' population has tripled since 1970, growing from 2.7 million to 7.6 million people through economic development and declining mortality',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 7.8 years since 1970, showing Laos\' gradual demographic transition in Southeast Asia',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 8 million people, Laos has more residents than Austria and remains the only landlocked country in Southeast Asia',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Laos contains Luang Prabang, a UNESCO World Heritage city, and represents one of Asia\'s last communist states',
          category: 'milestone'
        }
      );
      break;

    case 'Paraguay':
      facts.push(
        {
          icon: '📊',
          text: 'Paraguay\'s population has doubled since 1970, growing from 2.4 million to 6.9 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.4 years since 1970, reflecting Paraguay\'s demographic transition in South America',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 7 million people, Paraguay has more residents than Switzerland and remains one of South America\'s two landlocked countries',
          category: 'comparison'
        },
        {
          icon: '💧',
          text: 'Paraguay generates 100% of its electricity from hydropower and exports energy to Brazil and Argentina',
          category: 'milestone'
        }
      );
      break;

    case 'Libya':
      facts.push(
        {
          icon: '📊',
          text: 'Libya\'s population has tripled since 1970, growing from 2.0 million to 6.8 million people through oil wealth and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 7.2 years since 1970, showing Libya\'s demographic transition in North Africa',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 7 million people across 1.8 million km², Libya has more residents than Switzerland but one of the world\'s lowest population densities',
          category: 'comparison'
        },
        {
          icon: '🛢️',
          text: 'Libya contains Africa\'s largest proven oil reserves and sits atop the Sahara\'s vast underground water aquifers',
          category: 'milestone'
        }
      );
      break;

    case 'Lebanon':
      facts.push(
        {
          icon: '📊',
          text: 'Lebanon\'s population has doubled since 1970, growing from 2.4 million to 5.5 million people through economic development and refugee influx',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 12.8 years since 1970, showing Lebanon\'s rapid demographic transition in the Middle East',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 6 million people in 10,400 km², Lebanon has one of the world\'s highest population densities in the Middle East',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Lebanon contains Baalbek and other ancient sites, representing 6,000 years of continuous civilization in the Levant',
          category: 'milestone'
        }
      );
      break;

    case 'Nicaragua':
      facts.push(
        {
          icon: '📊',
          text: 'Nicaragua\'s population has doubled since 1970, growing from 2.0 million to 7.0 million people through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 8.6 years since 1970, reflecting Nicaragua\'s demographic transition in Central America',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 7 million people, Nicaragua has more residents than Switzerland and represents Central America\'s largest country by area',
          category: 'comparison'
        },
        {
          icon: '🌋',
          text: 'Nicaragua contains 19 active volcanoes and Lake Nicaragua, Central America\'s largest freshwater lake',
          category: 'milestone'
        }
      );
      break;

    case 'Kyrgyzstan':
      facts.push(
        {
          icon: '📊',
          text: 'Kyrgyzstan\'s population has doubled since 1970, growing from 3.0 million to 7.0 million people through post-Soviet development and high fertility',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 4.2 years since 1970, maintaining a relatively young population in Central Asia',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 7 million people, Kyrgyzstan has more residents than Switzerland and contains 90% mountainous terrain',
          category: 'comparison'
        },
        {
          icon: '🏔️',
          text: 'Kyrgyzstan contains Tian Shan mountains with peaks over 7,000 meters and preserved nomadic cultural traditions',
          category: 'milestone'
        }
      );
      break;

    case 'El Salvador':
      facts.push(
        {
          icon: '📊',
          text: 'El Salvador\'s population has doubled since 1970, growing from 3.7 million to 6.3 million people despite significant emigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 9.8 years since 1970, showing El Salvador\'s demographic transition in Central America',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 6 million people in 21,000 km², El Salvador has the highest population density in the Americas at 303 people per km²',
          category: 'comparison'
        },
        {
          icon: '🌋',
          text: 'El Salvador contains 20 active volcanoes and represents the only Central American country without a Caribbean coastline',
          category: 'milestone'
        }
      );
      break;

    case 'Turkmenistan':
      facts.push(
        {
          icon: '📊',
          text: 'Turkmenistan\'s population has doubled since 1970, growing from 2.2 million to 6.1 million people through natural gas wealth and post-Soviet development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 5.8 years since 1970, maintaining a relatively young population in Central Asia',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 6 million people across vast desert territory, Turkmenistan has more residents than Denmark and sits on massive gas reserves',
          category: 'comparison'
        },
        {
          icon: '🔥',
          text: 'Turkmenistan contains the "Door to Hell" natural gas crater and holds the world\'s 4th largest natural gas reserves',
          category: 'milestone'
        }
      );
      break;

    case 'Oman':
      facts.push(
        {
          icon: '📊',
          text: 'Oman\'s population has grown 6-fold since 1970, expanding from 724,000 to 4.6 million people through oil wealth and modernization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 9.2 years since 1970, showing Oman\'s rapid demographic transition in the Gulf',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5 million people, Oman has more residents than Norway and controls the strategic Strait of Hormuz entrance',
          category: 'comparison'
        },
        {
          icon: '🏰',
          text: 'Oman contains over 500 forts and castles, representing one of the Arab world\'s oldest independent states',
          category: 'milestone'
        }
      );
      break;

    case 'Costa Rica':
      facts.push(
        {
          icon: '📊',
          text: 'Costa Rica\'s population has tripled since 1970, growing from 1.7 million to 5.2 million people through economic development and stability',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by 11.8 years since 1970, showing Costa Rica\'s rapid demographic transition in Central America',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5 million people, Costa Rica has more residents than Norway and abolished its military in 1949',
          category: 'comparison'
        },
        {
          icon: '🌿',
          text: 'Costa Rica contains 5% of the world\'s biodiversity despite covering only 0.03% of Earth\'s surface',
          category: 'milestone'
        }
      );
      break;

    case 'Liberia':
      facts.push(
        {
          icon: '📊',
          text: 'Liberia\'s population has doubled since 1970, growing from 1.5 million to 5.4 million people through post-conflict recovery and development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 2.8 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5 million people, Liberia has more residents than Norway and was founded by freed American slaves in 1822',
          category: 'comparison'
        },
        {
          icon: '🗽',
          text: 'Liberia represents Africa\'s oldest republic and was never colonized, maintaining independence for over 175 years',
          category: 'milestone'
        }
      );
      break;
    case 'Bosnia and Herzegovina':
      facts.push(
        {
          icon: '📊',
          text: 'Bosnia\'s population has declined by 25% since the 1990s war, from 4.4 million to 3.2 million due to emigration and conflict impact',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has risen from 30.1 to 44.6 years since 1990, reflecting rapid demographic aging and youth emigration',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 3.2 million people, Bosnia has fewer residents than Berlin but ranks among Europe\'s fastest-aging populations',
          category: 'comparison'
        },
        {
          icon: '⚠️',
          text: 'Bosnia faces one of Europe\'s most severe demographic crises with a 1.2 fertility rate and massive brain drain to Western Europe',
          category: 'milestone'
        }
      );
      break;
    case 'Panama':
      facts.push(
        {
          icon: '📊',
          text: 'Panama\'s population has doubled since 1970, growing from 1.4 million to 4.4 million people driven by canal expansion and economic growth',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.7 to 31.7 years since 1970, reflecting continued demographic transition and urbanization',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 4.4 million people, Panama has a similar population to Ireland but controls one of the world\'s most strategic waterways',
          category: 'comparison'
        },
        {
          icon: '🚢',
          text: 'Panama stands at the replacement fertility level of 2.1, making it a crossroads nation connecting continents and demographic futures',
          category: 'milestone'
        }
      );
      break;
    case 'Uruguay':
      facts.push(
        {
          icon: '📊',
          text: 'Uruguay\'s population has grown from 2.8 million in 1970 to 3.4 million, representing slow but steady growth unlike many neighbors',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 26.6 to 36.2 years since 1970, reflecting continued aging and demographic maturity',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 3.4 million people, Uruguay has a similar population to Lithuania but represents South America\'s most stable democracy',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Uruguay achieved universal suffrage in 1918 and maintains one of the world\'s oldest democratic traditions while managing demographic transition',
          category: 'milestone'
        }
      );
      break;
    case 'Mongolia':
      facts.push(
        {
          icon: '📊',
          text: 'Mongolia\'s population has doubled since 1970, growing from 1.2 million to 3.4 million through economic development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 16.6 to 29.8 years since 1970, reflecting the demographic dividend of a young but maturing population',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 3.4 million people, Mongolia has a similar population to Uruguay but spreads across the world\'s largest landlocked country',
          category: 'comparison'
        },
        {
          icon: '🐎',
          text: 'Mongolia maintains above-replacement fertility at 2.7 children per woman while transitioning from nomadic herding to urban development',
          category: 'milestone'
        }
      );
      break;
    case 'Armenia':
      facts.push(
        {
          icon: '📊',
          text: 'Armenia\'s population has declined from 3.2 million in 1990 to 2.9 million, reflecting post-Soviet emigration and economic challenges',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 29.4 to 37.8 years since 1990, showing demographic aging amid population decline',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.9 million people, Armenia has fewer residents than Kansas but maintains one of the world\'s oldest Christian civilizations',
          category: 'comparison'
        },
        {
          icon: '⛪',
          text: 'Armenia became the first nation to adopt Christianity as its state religion in 301 AD, preceding both Greece and Russia by centuries',
          category: 'milestone'
        }
      );
      break;
    case 'Jamaica':
      facts.push(
        {
          icon: '📊',
          text: 'Jamaica\'s population has grown from 1.9 million in 1970 to 2.8 million, representing steady but modest Caribbean demographic growth',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.3 to 31.4 years since 1970, reflecting demographic transition and youth emigration patterns',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.8 million people, Jamaica has a similar population to Kansas but represents the cultural birthplace of reggae music worldwide',
          category: 'comparison'
        },
        {
          icon: '🏃‍♂️',
          text: 'Jamaica holds the record for most Olympic sprint medals per capita and has produced global icons from Bob Marley to Usain Bolt',
          category: 'milestone'
        }
      );
      break;
    case 'Kuwait':
      facts.push(
        {
          icon: '📊',
          text: 'Kuwait\'s population has grown dramatically from 0.9 million in 1970 to 4.3 million, driven by oil wealth and massive foreign worker immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.1 to 34.2 years since 1970, reflecting demographic maturity amid continued immigration flows',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 4.3 million people, Kuwait has a similar population to Oregon but contains 6% of world\'s proven oil reserves in a tiny desert nation',
          category: 'comparison'
        },
        {
          icon: '🛢️',
          text: 'Kuwait transitioned from fertility rate of 7.3 in 1965 to 1.5 today, representing the Gulf\'s most dramatic demographic transformation',
          category: 'milestone'
        }
      );
      break;
    case 'Albania':
      facts.push(
        {
          icon: '📊',
          text: 'Albania\'s population has declined from 3.3 million in 1990 to 2.8 million, reflecting massive emigration following communist regime collapse',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 26.5 to 39.4 years since 1990, showing rapid demographic aging amid youth emigration to Western Europe',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.8 million people, Albania has fewer residents than Arkansas but was Europe\'s most isolated country during the Cold War',
          category: 'comparison'
        },
        {
          icon: '🏔️',
          text: 'Albania emerged from Europe\'s most repressive communist regime in 1991 and now faces demographic challenges as young people seek opportunities abroad',
          category: 'milestone'
        }
      );
      break;
    case 'Djibouti':
      facts.push(
        {
          icon: '📊',
          text: 'Djibouti\'s population has tripled since 1970, growing from 0.2 million to 1.1 million through urbanization and regional migration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 16.8 to 27.9 years since 1970, reflecting rapid demographic transition despite high fertility',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.1 million people, Djibouti has fewer residents than Rhode Island but controls one of Africa\'s most strategic ports',
          category: 'comparison'
        },
        {
          icon: '🚢',
          text: 'Djibouti hosts military bases from USA, France, China and Japan while maintaining a fertility rate above replacement at 2.6 children',
          category: 'milestone'
        }
      );
      break;
    case 'Mauritius':
      facts.push(
        {
          icon: '📊',
          text: 'Mauritius population has doubled since 1970, growing from 0.8 million to 1.3 million while achieving upper-middle-income status',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.6 to 37.4 years since 1970, representing one of Africa\'s most advanced demographic transitions',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.3 million people, Mauritius has fewer residents than Hawaii but achieved African economic miracle status',
          category: 'comparison'
        },
        {
          icon: '🏝️',
          text: 'Mauritius transformed from sugar plantation economy to financial hub while fertility dropped from 5.5 to 1.4 children per woman',
          category: 'milestone'
        }
      );
      break;
    case 'Bahrain':
      facts.push(
        {
          icon: '📊',
          text: 'Bahrain\'s population has grown dramatically from 0.2 million in 1970 to 1.7 million through oil wealth and expatriate immigration',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.1 to 33.2 years since 1970, reflecting Gulf modernization and demographic maturity',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.7 million people, Bahrain has a similar population to West Virginia but serves as the Gulf\'s financial center',
          category: 'comparison'
        },
        {
          icon: '🏁',
          text: 'Bahrain hosts Formula 1 racing and transformed from pearl diving to banking while fertility declined from 7.0 to 1.8 children',
          category: 'milestone'
        }
      );
      break;
    case 'Gambia':
      facts.push(
        {
          icon: '📊',
          text: 'Gambia\'s population has tripled since 1970, growing from 0.5 million to 2.4 million with one of Africa\'s highest fertility rates',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 4.2 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.4 million people, Gambia has fewer residents than Kansas but represents Africa\'s smallest mainland country',
          category: 'comparison'
        },
        {
          icon: '🥜',
          text: 'Gambia maintains a fertility rate of 4.0 children per woman while being entirely surrounded by Senegal except for its Atlantic coast',
          category: 'milestone'
        }
      );
      break;
    case 'Gabon':
      facts.push(
        {
          icon: '📊',
          text: 'Gabon\'s population has tripled since 1970, growing from 0.5 million to 2.4 million driven by oil revenues and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.7 to 23.6 years since 1970, showing gradual demographic transition amid sustained fertility',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.4 million people, Gabon has fewer residents than Kansas but maintains one of Africa\'s highest per-capita incomes',
          category: 'comparison'
        },
        {
          icon: '🌳',
          text: 'Gabon preserves 85% forest cover while maintaining a fertility rate of 3.6 children and achieving upper-middle-income status',
          category: 'milestone'
        }
      );
      break;
    case 'Botswana':
      facts.push(
        {
          icon: '📊',
          text: 'Botswana\'s population has tripled since 1970, growing from 0.6 million to 2.4 million through diamond wealth and good governance',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 17.9 to 25.7 years since 1970, reflecting gradual demographic transition and HIV impact',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.4 million people, Botswana has fewer residents than Kansas but transformed from poorest to upper-middle-income country',
          category: 'comparison'
        },
        {
          icon: '💎',
          text: 'Botswana achieved Africa\'s longest-running democracy while fertility declined from 6.6 to 2.7 children per woman',
          category: 'milestone'
        }
      );
      break;
    case 'Namibia':
      facts.push(
        {
          icon: '📊',
          text: 'Namibia\'s population has doubled since 1970, growing from 0.7 million to 2.5 million following independence and development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 17.6 to 22.7 years since 1970, showing gradual demographic transition amid high fertility',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 2.5 million people, Namibia has fewer residents than Nevada but spans one of Africa\'s most sparsely populated countries',
          category: 'comparison'
        },
        {
          icon: '🏜️',
          text: 'Namibia contains the world\'s oldest desert and achieved independence in 1990 while maintaining a fertility rate of 3.2 children',
          category: 'milestone'
        }
      );
      break;
    case 'Iceland':
      facts.push(
        {
          icon: '📊',
          text: 'Iceland\'s population has doubled since 1970, growing from 0.2 million to 0.4 million while maintaining Nordic prosperity',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 24.9 to 38.1 years since 1970, reflecting Nordic demographic patterns and longevity',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.4 million people, Iceland has fewer residents than Wyoming but achieved one of the world\'s highest living standards',
          category: 'comparison'
        },
        {
          icon: '🌋',
          text: 'Iceland harnesses geothermal energy while maintaining below-replacement fertility at 1.6 children and near-zero crime rates',
          category: 'milestone'
        }
      );
      break;
    case 'Fiji':
      facts.push(
        {
          icon: '📊',
          text: 'Fiji\'s population has doubled since 1970, growing from 0.5 million to 0.9 million through tourism development and urbanization',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.8 to 29.8 years since 1970, reflecting Pacific Island demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.9 million people, Fiji has fewer residents than Montana but serves as the Pacific\'s regional hub',
          category: 'comparison'
        },
        {
          icon: '🏉',
          text: 'Fiji dominates rugby sevens globally while maintaining a fertility rate of 2.3 children across 300+ islands',
          category: 'milestone'
        }
      );
      break;
    case 'Cyprus':
      facts.push(
        {
          icon: '📊',
          text: 'Cyprus population has tripled since 1970, growing from 0.6 million to 1.2 million through EU membership and economic development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 25.9 to 38.6 years since 1970, showing Mediterranean demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.2 million people, Cyprus has fewer residents than Hawaii but bridges Europe, Asia and Africa culturally',
          category: 'comparison'
        },
        {
          icon: '🏛️',
          text: 'Cyprus joined the EU in 2004 while fertility declined from 3.5 to 1.4 children amid ongoing division since 1974',
          category: 'milestone'
        }
      );
      break;
    case 'Solomon Islands':
      facts.push(
        {
          icon: '📊',
          text: 'Solomon Islands\' population has tripled since 1970, growing from 0.16 million to 0.7 million across 900+ scattered islands',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 16.1 to 21.1 years since 1970, maintaining one of the world\'s youngest population profiles',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.7 million people, Solomon Islands has fewer residents than San Francisco but spans an archipelago larger than Belgium',
          category: 'comparison'
        },
        {
          icon: '🌺',
          text: 'Solomon Islands maintains a fertility rate of 3.5 children per woman while preserving Melanesian culture across hundreds of languages',
          category: 'milestone'
        }
      );
      break;
    case 'Trinidad and Tobago':
      facts.push(
        {
          icon: '📊',
          text: 'Trinidad and Tobago\'s population has grown from 0.9 million in 1970 to 1.4 million through oil wealth and Caribbean development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.7 to 37.1 years since 1970, representing advanced Caribbean demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.4 million people, Trinidad and Tobago has fewer residents than Hawaii but achieved the Caribbean\'s highest GDP per capita',
          category: 'comparison'
        },
        {
          icon: '🎭',
          text: 'Trinidad invented calypso music and Carnival culture while fertility declined from 4.9 to 1.5 children per woman',
          category: 'milestone'
        }
      );
      break;
    case 'Equatorial Guinea':
      facts.push(
        {
          icon: '📊',
          text: 'Equatorial Guinea\'s population has tripled since 1970, growing from 0.3 million to 1.4 million driven by oil discoveries',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.4 to 20.4 years since 1970, showing slow demographic transition despite oil wealth',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.4 million people, Equatorial Guinea has fewer residents than Hawaii but achieved Africa\'s highest GDP per capita through oil',
          category: 'comparison'
        },
        {
          icon: '🛢️',
          text: 'Equatorial Guinea discovered massive offshore oil reserves in 1990s while maintaining one of Africa\'s highest fertility rates at 4.0 children',
          category: 'milestone'
        }
      );
      break;
    case 'Timor-Leste':
      facts.push(
        {
          icon: '📊',
          text: 'Timor-Leste\'s population has doubled since independence in 2002, growing from 0.9 million to 1.3 million amid nation-building',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 17.8 to 20.7 years since 2000, reflecting post-conflict recovery and demographic youth dividend',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.3 million people, Timor-Leste has fewer residents than Maine but represents Asia\'s newest sovereign nation',
          category: 'comparison'
        },
        {
          icon: '🗽',
          text: 'Timor-Leste achieved independence in 2002 after centuries of colonization while fertility declined from 6.0 to 2.7 children',
          category: 'milestone'
        }
      );
      break;
    case 'Eswatini':
      facts.push(
        {
          icon: '📊',
          text: 'Eswatini\'s population has doubled since 1970, growing from 0.4 million to 1.2 million despite HIV/AIDS challenges',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 16.8 to 21.8 years since 1970, showing gradual demographic transition amid health crises',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 1.2 million people, Eswatini has fewer residents than Hawaii but represents Africa\'s last absolute monarchy',
          category: 'comparison'
        },
        {
          icon: '👑',
          text: 'Eswatini maintains traditional monarchy and cultural practices while fertility declined from 6.8 to 2.8 children per woman',
          category: 'milestone'
        }
      );
      break;
    case 'Luxembourg':
      facts.push(
        {
          icon: '📊',
          text: 'Luxembourg\'s population has doubled since 1970, growing from 0.3 million to 0.6 million through EU membership and financial services',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 31.7 to 40.1 years since 1970, reflecting European demographic maturity and immigration',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.6 million people, Luxembourg has fewer residents than Vermont but achieved the world\'s highest GDP per capita',
          category: 'comparison'
        },
        {
          icon: '💰',
          text: 'Luxembourg serves as EU financial capital while maintaining below-replacement fertility at 1.3 children per woman',
          category: 'milestone'
        }
      );
      break;
    case 'Malta':
      facts.push(
        {
          icon: '📊',
          text: 'Malta\'s population has grown from 0.3 million in 1970 to 0.5 million through tourism development and EU membership',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 25.3 to 43.2 years since 1970, representing one of Europe\'s most rapid aging processes',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.5 million people, Malta has fewer residents than Wyoming but achieved EU\'s strategic Mediterranean crossroads position',
          category: 'comparison'
        },
        {
          icon: '⛪',
          text: 'Malta maintains one of Europe\'s lowest fertility rates at 1.1 children per woman while preserving strong Catholic traditions',
          category: 'milestone'
        }
      );
      break;
    case 'Brunei':
      facts.push(
        {
          icon: '📊',
          text: 'Brunei\'s population has doubled since 1970, growing from 0.1 million to 0.4 million through oil wealth and welfare state development',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.4 to 32.4 years since 1970, reflecting Southeast Asian demographic transition with oil prosperity',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.4 million people, Brunei has fewer residents than Wyoming but maintains one of Asia\'s highest living standards',
          category: 'comparison'
        },
        {
          icon: '🕌',
          text: 'Brunei operates under Islamic monarchy with extensive welfare state while fertility declined from 6.6 to 1.7 children',
          category: 'milestone'
        }
      );
      break;
    case 'Comoros':
      facts.push(
        {
          icon: '📊',
          text: 'Comoros\' population has tripled since 1970, growing from 0.2 million to 0.9 million across three volcanic islands',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 3.8 years since 1970, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.9 million people, Comoros has fewer residents than Montana but represents the Indian Ocean\'s volcanic island nation',
          category: 'comparison'
        },
        {
          icon: '🌺',
          text: 'Comoros maintains high fertility at 3.9 children per woman while blending African, Arab, and French cultural influences',
          category: 'milestone'
        }
      );
      break;
    case 'Palestine':
      facts.push(
        {
          icon: '📊',
          text: 'Palestine\'s population has tripled since 1990, growing from 2.2 million to 5.5 million despite political challenges and territorial constraints',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 15.8 to 22.4 years since 1990, maintaining one of the world\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 5.5 million people, Palestine has more residents than New Zealand but remains under occupation and territorial dispute',
          category: 'comparison'
        },
        {
          icon: '🕊️',
          text: 'Palestine maintains a fertility rate of 3.3 children per woman while striving for statehood recognition and territorial sovereignty',
          category: 'milestone'
        }
      );
      break;
    case 'Vanuatu':
      facts.push(
        {
          icon: '📊',
          text: 'Vanuatu\'s population has tripled since 1970, growing from 0.09 million to 0.3 million across 80+ volcanic islands in the Pacific',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 16.9 to 22.8 years since 1970, reflecting Pacific Island demographic patterns and youth emigration',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.3 million people, Vanuatu has fewer residents than Iceland but represents one of the world\'s most linguistically diverse nations',
          category: 'comparison'
        },
        {
          icon: '🌋',
          text: 'Vanuatu speaks over 100 indigenous languages and maintains a fertility rate of 3.6 children while facing climate change challenges',
          category: 'milestone'
        }
      );
      break;
    case 'United States':
      facts.push(
        {
          icon: '📊',
          text: 'US population has grown from 203 million in 1970 to 335 million, making it the world\'s third-largest country by population',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 28.1 to 38.9 years since 1970, reflecting demographic aging and declining birth rates',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 335 million people, the US has the world\'s largest economy and represents 4.2% of global population on 1.9% of land',
          category: 'comparison'
        },
        {
          icon: '🗽',
          text: 'America maintains below-replacement fertility at 1.6 children per woman while remaining the world\'s top immigration destination',
          category: 'milestone'
        }
      );
      break;
    case 'Tanzania':
      facts.push(
        {
          icon: '📊',
          text: 'Tanzania\'s population has quadrupled since 1970, growing from 14 million to 65 million, making it Africa\'s fifth-largest country',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased by only 1.9 years since 1970, maintaining one of the world\'s youngest population profiles at 18.1 years',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 65 million people, Tanzania has more residents than the UK and contains Africa\'s highest mountain, Kilimanjaro',
          category: 'comparison'
        },
        {
          icon: '🦁',
          text: 'Tanzania hosts the Serengeti ecosystem and maintains high fertility at 4.6 children per woman across over 120 ethnic groups',
          category: 'milestone'
        }
      );
      break;
    case 'Tonga':
      facts.push(
        {
          icon: '📊',
          text: 'Tonga\'s population has grown from 0.09 million in 1970 to 0.1 million, representing slow Pacific Island demographic growth',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.1 to 24.1 years since 1970, reflecting gradual Pacific demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 0.1 million people, Tonga has fewer residents than most small cities but represents Polynesia\'s last constitutional monarchy',
          category: 'comparison'
        },
        {
          icon: '👑',
          text: 'Tonga never lost sovereignty to European powers and maintains a fertility rate of 3.1 children while preserving traditional culture',
          category: 'milestone'
        }
      );
      break;
    case 'Tuvalu':
      facts.push(
        {
          icon: '📊',
          text: 'Tuvalu\'s population has doubled since 1970, growing from 0.006 million to 0.012 million on nine coral atolls',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 17.8 to 26.8 years since 1970, reflecting small island demographic patterns',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 12,000 people, Tuvalu has fewer residents than most neighborhoods but represents the world\'s fourth-smallest country',
          category: 'comparison'
        },
        {
          icon: '🌊',
          text: 'Tuvalu faces existential threat from rising seas while maintaining fertility of 3.2 children and traditional Polynesian culture',
          category: 'milestone'
        }
      );
      break;
    case 'Saint Kitts and Nevis':
      facts.push(
        {
          icon: '📊',
          text: 'Saint Kitts and Nevis population has grown from 0.04 million in 1970 to 0.05 million, representing slow Caribbean island growth',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 19.7 to 37.1 years since 1970, reflecting Caribbean demographic maturity and emigration',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 53,000 people, Saint Kitts has fewer residents than most small towns but represents the world\'s smallest sovereign federation',
          category: 'comparison'
        },
        {
          icon: '🏝️',
          text: 'Saint Kitts achieved independence in 1983 while maintaining fertility of 1.5 children and strong ties to the Commonwealth',
          category: 'milestone'
        }
      );
      break;
    case 'Saint Lucia':
      facts.push(
        {
          icon: '📊',
          text: 'Saint Lucia\'s population has grown from 0.1 million in 1970 to 0.18 million through tourism development and Caribbean prosperity',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.6 to 37.2 years since 1970, showing advanced Caribbean demographic transition',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 184,000 people, Saint Lucia has fewer residents than most suburbs but achieved Caribbean tourism leadership',
          category: 'comparison'
        },
        {
          icon: '🏆',
          text: 'Saint Lucia produced more Olympic champions per capita than any other nation while fertility declined from 6.7 to 1.4 children',
          category: 'milestone'
        }
      );
      break;
    case 'Saint Vincent and the Grenadines':
      facts.push(
        {
          icon: '📊',
          text: 'Saint Vincent population has grown from 0.09 million in 1970 to 0.1 million across 32 islands and cays',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.7 to 34.1 years since 1970, reflecting Windward Islands demographic patterns',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 104,000 people, Saint Vincent has fewer residents than most small cities but spans pristine Caribbean archipelago',
          category: 'comparison'
        },
        {
          icon: '🌋',
          text: 'Saint Vincent contains active La Soufrière volcano while maintaining fertility of 1.8 children and sustainable tourism',
          category: 'milestone'
        }
      );
      break;
    case 'Sudan':
      facts.push(
        {
          icon: '📊',
          text: 'Sudan\'s population has doubled since 1970, growing from 16 million to 48 million despite civil conflicts and partition',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 16.8 to 19.9 years since 1970, maintaining one of Africa\'s youngest population structures',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 48 million people, Sudan has more residents than South Korea and represents Africa\'s third-largest country by area',
          category: 'comparison'
        },
        {
          icon: '🏺',
          text: 'Sudan contains ancient Nubian kingdoms and Nile confluence while maintaining high fertility at 4.3 children per woman',
          category: 'milestone'
        }
      );
      break;
    case 'Suriname':
      facts.push(
        {
          icon: '📊',
          text: 'Suriname\'s population has grown from 0.4 million in 1970 to 0.6 million in South America\'s smallest country',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 18.8 to 31.3 years since 1970, reflecting demographic transition in the Guiana Shield',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 612,000 people, Suriname has fewer residents than Vermont but contains 93% pristine Amazon rainforest',
          category: 'comparison'
        },
        {
          icon: '🌳',
          text: 'Suriname speaks Dutch and maintains the world\'s highest forest coverage at 93% while fertility approaches replacement at 2.2 children',
          category: 'milestone'
        }
      );
      break;
    case 'Sao Tome and Principe':
      facts.push(
        {
          icon: '📊',
          text: 'São Tomé population has tripled since 1970, growing from 0.07 million to 0.23 million on volcanic Gulf of Guinea islands',
          category: 'growth'
        },
        {
          icon: '📅',
          text: 'The median age has increased from 17.1 to 19.8 years since 1970, maintaining young African island demographics',
          category: 'age'
        },
        {
          icon: '🌍',
          text: 'With 231,000 people, São Tomé has fewer residents than most suburbs but represents Africa\'s second-smallest country',
          category: 'comparison'
        },
        {
          icon: '🍫',
          text: 'São Tomé pioneered sustainable cocoa farming while maintaining fertility of 3.6 children across equatorial African islands',
          category: 'milestone'
        }
      );
      break;

    default:
      // Fallback to generic enhanced format if country not specifically handled
      if (data1970) {
        const growthMultiple = yearData.totalPopulation / data1970.totalPopulation;
        facts.push({
          icon: '📊',
          text: `${countryName}\'s population has ${growthMultiple > 1.5 ? 'grown significantly' : growthMultiple > 1.1 ? 'grown moderately' : 'remained stable'} since 1970`,
          category: 'growth'
        });

        const ageChange = metrics.medianAge - data1970.medianAge;
        facts.push({
          icon: '📅',
          text: `The median age has ${ageChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(ageChange).toFixed(1)} years since 1970`,
          category: 'age'
        });
      }

      const populationInMillions = yearData.totalPopulation / 1000000;
      facts.push({
        icon: '🌍',
        text: `With ${populationInMillions.toFixed(1)} million people, ${countryName} represents a significant global population center`,
        category: 'comparison'
      });
      break;
  }

  return facts;
}