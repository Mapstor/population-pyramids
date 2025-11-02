import type { CountryPopulationData, YearData } from '@/types/population';

interface DecadeData {
  decade: string;
  startYear: number;
  endYear: number;
  startData: YearData | null;
  endData: YearData | null;
  populationChange: number;
  medianAgeChange: number;
  youthPercentChange: number;
  elderlyPercentChange: number;
  majorTrends: string[];
}

// Historical context database for major events affecting demographics
const historicalEvents: Record<string, Record<string, string[]>> = {
  // Global events that affected most countries
  'global': {
    '1970s': ['Oil crisis impact on economic development', 'Green Revolution affects agricultural societies', 'Cold War influences development policies'],
    '1980s': ['Economic liberalization begins in many countries', 'HIV/AIDS epidemic emerges', 'Debt crisis affects developing nations'],
    '1990s': ['End of Cold War reshapes global politics', 'Economic globalization accelerates', 'Internet revolution begins'],
    '2000s': ['Millennium Development Goals launched', 'Global financial crisis', 'Rise of emerging economies'],
    '2010s': ['Sustainable Development Goals adopted', 'Global refugee crises', 'Climate change impacts increase'],
    '2020s': ['COVID-19 pandemic affects global demographics', 'Digital transformation accelerates', 'Climate migration increases']
  },

  // Country-specific events
  'angola': {
    '1970s': ['Independence from Portugal (1975)', 'Civil war begins affecting population movement', 'Oil industry development starts'],
    '1980s': ['Prolonged civil war continues', 'Economic instability affects living standards', 'Rural-urban migration increases'],
    '1990s': ['Peace agreements attempted', 'Economic reforms begin', 'Infrastructure rebuilding starts'],
    '2000s': ['Civil war ends (2002)', 'Economic boom from oil revenues', 'Major infrastructure development'],
    '2010s': ['Diversification efforts beyond oil', 'Urbanization accelerates', 'Healthcare improvements expand'],
    '2020s': ['Economic diversification continues', 'Youth population growth challenges', 'Infrastructure modernization']
  },

  'china': {
    '1970s': ['One-child policy introduced (1979)', 'Economic reforms begin', 'Cultural Revolution ends'],
    '1980s': ['One-child policy strictly enforced', 'Economic liberalization accelerates', 'Urban development increases'],
    '1990s': ['Economic growth accelerates', 'Population control continues', 'Rural-urban migration increases'],
    '2000s': ['Economic boom continues', 'Aging population concerns emerge', 'Healthcare improvements'],
    '2010s': ['One-child policy relaxed (2015)', 'Rapid aging acceleration', 'Economic transition'],
    '2020s': ['Three-child policy introduced', 'Demographic transition challenges', 'Economic maturation']
  },

  'nigeria': {
    '1970s': ['Oil boom transforms economy', 'Rapid population growth', 'Urban development accelerates'],
    '1980s': ['Economic challenges from oil price drops', 'Structural adjustment programs', 'Rural-urban migration continues'],
    '1990s': ['Democracy restoration efforts', 'Economic liberalization', 'Population growth continues'],
    '2000s': ['Democratic consolidation', 'Economic diversification efforts', 'Health improvements'],
    '2010s': ['Economic growth acceleration', 'Demographic dividend potential', 'Youth bulge challenges'],
    '2020s': ['Demographic transition beginning', 'Urbanization acceleration', 'Economic development challenges']
  },

  'germany': {
    '1970s': ['Guest worker programs affect demographics', 'Declining birth rates begin', 'Economic prosperity'],
    '1980s': ['Continued low fertility rates', 'Immigration policies evolve', 'Aging concerns emerge'],
    '1990s': ['German reunification (1990)', 'East-West demographic integration', 'Immigration increases'],
    '2000s': ['EU expansion affects migration', 'Aging population policies', 'Immigration reforms'],
    '2010s': ['Refugee crisis response', 'Demographic challenges intensify', 'Immigration increases'],
    '2020s': ['Post-pandemic demographic impacts', 'Climate migration begins', 'Aging society adaptations']
  },

  'japan': {
    '1970s': ['Post-war baby boom ends', 'Economic miracle continues', 'Urbanization completes'],
    '1980s': ['Asset price bubble era', 'Declining birth rates accelerate', 'Longest life expectancy achieved'],
    '1990s': ['Economic stagnation begins', 'Aging society concerns emerge', 'Immigration debates begin'],
    '2000s': ['Super-aging society status reached', 'Population decline begins', 'Demographic crisis recognized'],
    '2010s': ['Abenomics policies introduced', 'Immigration policies liberalized', 'Rural depopulation accelerates'],
    '2020s': ['Pandemic impacts demographics', 'Labor shortage intensifies', 'Aging society innovations']
  },

  'india': {
    '1970s': ['Family planning programs intensify', 'Green Revolution transforms agriculture', 'Emergency period affects policies'],
    '1980s': ['Economic liberalization begins', 'Population growth continues', 'Healthcare improvements'],
    '1990s': ['Economic reforms accelerate', 'IT industry emerges', 'Demographic transition begins'],
    '2000s': ['Economic growth accelerates', 'Demographic dividend begins', 'Urbanization increases'],
    '2010s': ['Digital India initiatives', 'Demographic dividend peaks', 'Healthcare access improves'],
    '2020s': ['Demographic transition continues', 'Urbanization accelerates', 'Aging challenges emerge']
  }
};

function getDecadeEvents(countrySlug: string, decade: string): string[] {
  const countryEvents = historicalEvents[countrySlug]?.[decade] || [];
  const globalEvents = historicalEvents['global'][decade] || [];
  return [...countryEvents, ...globalEvents.slice(0, 2)]; // Include 2 global events
}

function calculateDecadeChange(start: number, end: number): string {
  const change = ((end - start) / start) * 100;
  if (Math.abs(change) < 1) return 'remained stable';
  return change > 0 ? `increased by ${Math.abs(change).toFixed(1)}%` : `decreased by ${Math.abs(change).toFixed(1)}%`;
}

function getDecadeData(countryData: CountryPopulationData): DecadeData[] {
  const decades = [
    { decade: '1970s', startYear: 1970, endYear: 1980 },
    { decade: '1980s', startYear: 1980, endYear: 1990 },
    { decade: '1990s', startYear: 1990, endYear: 2000 },
    { decade: '2000s', startYear: 2000, endYear: 2010 },
    { decade: '2010s', startYear: 2010, endYear: 2020 },
    { decade: '2020s', startYear: 2020, endYear: 2024 } // Current decade
  ];

  return decades.map(({ decade, startYear, endYear }) => {
    const startData = countryData.years[startYear.toString()] || null;
    const endData = countryData.years[endYear.toString()] || 
                   countryData.years[Math.min(endYear, 2024).toString()] || null;

    let populationChange = 0;
    let medianAgeChange = 0;
    let youthPercentChange = 0;
    let elderlyPercentChange = 0;

    if (startData && endData) {
      populationChange = ((endData.totalPopulation - startData.totalPopulation) / startData.totalPopulation) * 100;
      medianAgeChange = endData.medianAge - startData.medianAge;
      
      const startYouth = (startData.ageGroups.filter(ag => ag.ageRange && ['0-4', '5-9', '10-14'].includes(ag.ageRange))
        .reduce((sum, ag) => sum + (ag.total || 0), 0) / startData.totalPopulation) * 100;
      const endYouth = (endData.ageGroups.filter(ag => ag.ageRange && ['0-4', '5-9', '10-14'].includes(ag.ageRange))
        .reduce((sum, ag) => sum + (ag.total || 0), 0) / endData.totalPopulation) * 100;
      youthPercentChange = endYouth - startYouth;

      const startElderly = (startData.ageGroups.filter(ag => ag.ageRange && (ag.ageRange.includes('65') || ag.ageRange.includes('70') || ag.ageRange.includes('75') || ag.ageRange.includes('80') || ag.ageRange.includes('85') || ag.ageRange.includes('90') || ag.ageRange.includes('95') || ag.ageRange.includes('100')))
        .reduce((sum, ag) => sum + (ag.total || 0), 0) / startData.totalPopulation) * 100;
      const endElderly = (endData.ageGroups.filter(ag => ag.ageRange && (ag.ageRange.includes('65') || ag.ageRange.includes('70') || ag.ageRange.includes('75') || ag.ageRange.includes('80') || ag.ageRange.includes('85') || ag.ageRange.includes('90') || ag.ageRange.includes('95') || ag.ageRange.includes('100')))
        .reduce((sum, ag) => sum + (ag.total || 0), 0) / endData.totalPopulation) * 100;
      elderlyPercentChange = endElderly - startElderly;
    }

    return {
      decade,
      startYear,
      endYear,
      startData,
      endData,
      populationChange,
      medianAgeChange,
      youthPercentChange,
      elderlyPercentChange,
      majorTrends: []
    };
  });
}

export function generateDecadeAnalysis(
  countryName: string,
  countrySlug: string,
  countryData: CountryPopulationData
): Record<string, string> {
  const decadeData = getDecadeData(countryData);
  const analysis: Record<string, string> = {};

  decadeData.forEach(({ decade, startYear, endYear, startData, endData, populationChange, medianAgeChange, youthPercentChange, elderlyPercentChange }) => {
    if (!startData || !endData) {
      analysis[decade] = `Limited demographic data is available for ${countryName} during the ${decade}. This period represents a gap in comprehensive population records, which was common for many countries during earlier decades of demographic data collection. The absence of detailed age-structure data from this period highlights the evolution of statistical capacity and international data standardization that has occurred since the 1970s.`;
      return;
    }

    const events = getDecadeEvents(countrySlug, decade);
    const startPop = (startData.totalPopulation / 1000000).toFixed(1);
    const endPop = (endData.totalPopulation / 1000000).toFixed(1);
    
    let content = `During the ${decade}, ${countryName} experienced significant demographic transformation. The population ${calculateDecadeChange(startData.totalPopulation, endData.totalPopulation)}, growing from ${startPop} million in ${startYear} to ${endPop} million by ${endYear === 2024 ? '2024' : endYear}. `;

    // Median age analysis
    if (Math.abs(medianAgeChange) > 0.5) {
      content += `The median age ${medianAgeChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(medianAgeChange).toFixed(1)} years, indicating ${medianAgeChange > 0 ? 'population aging' : 'a younger demographic profile'} during this period. `;
    }

    // Age structure changes
    if (Math.abs(youthPercentChange) > 1) {
      content += `The youth population share ${youthPercentChange > 0 ? 'expanded' : 'contracted'} by ${Math.abs(youthPercentChange).toFixed(1)} percentage points, reflecting changing birth rates and family planning trends. `;
    }

    if (Math.abs(elderlyPercentChange) > 0.5) {
      content += `Meanwhile, the elderly population proportion ${elderlyPercentChange > 0 ? 'grew' : 'declined'} by ${Math.abs(elderlyPercentChange).toFixed(1)} percentage points, showing ${elderlyPercentChange > 0 ? 'improvements in life expectancy and healthcare' : 'the dominance of younger age groups'}. `;
    }

    // Historical context
    if (events.length > 0) {
      content += `This demographic evolution occurred against the backdrop of major historical developments, including ${events.slice(0, 2).join(' and ').toLowerCase()}. `;
      if (events.length > 2) {
        content += `Additional factors such as ${events[2].toLowerCase()} also influenced population dynamics during this transformative decade. `;
      }
    }

    // Economic and social implications
    const growthRate = populationChange / 10; // Annual average
    if (growthRate > 2) {
      content += `The rapid population growth of approximately ${growthRate.toFixed(1)}% annually presented both opportunities for economic expansion and challenges for infrastructure development, education systems, and healthcare provision. `;
    } else if (growthRate < 0.5) {
      content += `The relatively slow population growth of ${growthRate.toFixed(1)}% annually reflected demographic maturation and presented implications for labor force dynamics and economic growth patterns. `;
    }

    // Future implications
    content += `These demographic shifts established important foundations for subsequent population trends and continue to influence ${countryName}'s current age structure and socioeconomic development trajectory.`;

    analysis[decade] = content;
  });

  return analysis;
}