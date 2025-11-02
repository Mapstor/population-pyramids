const fs = require('fs');
const path = require('path');

// Load countries data
const countries = require('../src/data/countries.json');

// Demographic patterns by region and development level
const demographicPatterns = {
  // Expansive pyramid - high birth rates, young population
  expansive: {
    '0-4': { malePct: 6.5, femalePct: 6.2 },
    '5-9': { malePct: 6.2, femalePct: 5.9 },
    '10-14': { malePct: 5.9, femalePct: 5.6 },
    '15-19': { malePct: 5.6, femalePct: 5.3 },
    '20-24': { malePct: 5.3, femalePct: 5.0 },
    '25-29': { malePct: 4.9, femalePct: 4.7 },
    '30-34': { malePct: 4.5, femalePct: 4.3 },
    '35-39': { malePct: 4.1, femalePct: 4.0 },
    '40-44': { malePct: 3.7, femalePct: 3.6 },
    '45-49': { malePct: 3.2, femalePct: 3.2 },
    '50-54': { malePct: 2.8, femalePct: 2.9 },
    '55-59': { malePct: 2.3, femalePct: 2.5 },
    '60-64': { malePct: 1.8, femalePct: 2.0 },
    '65-69': { malePct: 1.4, femalePct: 1.6 },
    '70-74': { malePct: 1.0, femalePct: 1.2 },
    '75-79': { malePct: 0.6, femalePct: 0.8 },
    '80-84': { malePct: 0.3, femalePct: 0.5 },
    '85-89': { malePct: 0.2, femalePct: 0.3 },
    '90-94': { malePct: 0.1, femalePct: 0.2 },
    '95-99': { malePct: 0.0, femalePct: 0.1 },
    '100+': { malePct: 0.0, femalePct: 0.0 }
  },
  
  // Constrictive pyramid - low birth rates, aging population
  constrictive: {
    '0-4': { malePct: 2.4, femalePct: 2.3 },
    '5-9': { malePct: 2.6, femalePct: 2.5 },
    '10-14': { malePct: 2.8, femalePct: 2.7 },
    '15-19': { malePct: 3.1, femalePct: 2.9 },
    '20-24': { malePct: 3.3, femalePct: 3.2 },
    '25-29': { malePct: 3.8, femalePct: 3.6 },
    '30-34': { malePct: 4.2, femalePct: 4.0 },
    '35-39': { malePct: 4.5, femalePct: 4.3 },
    '40-44': { malePct: 4.7, femalePct: 4.5 },
    '45-49': { malePct: 4.8, femalePct: 4.6 },
    '50-54': { malePct: 4.6, femalePct: 4.5 },
    '55-59': { malePct: 4.3, femalePct: 4.2 },
    '60-64': { malePct: 3.9, femalePct: 3.9 },
    '65-69': { malePct: 3.4, femalePct: 3.6 },
    '70-74': { malePct: 2.8, femalePct: 3.1 },
    '75-79': { malePct: 2.1, femalePct: 2.5 },
    '80-84': { malePct: 1.4, femalePct: 1.9 },
    '85-89': { malePct: 0.8, femalePct: 1.2 },
    '90-94': { malePct: 0.3, femalePct: 0.6 },
    '95-99': { malePct: 0.1, femalePct: 0.2 },
    '100+': { malePct: 0.0, femalePct: 0.1 }
  },
  
  // Stationary pyramid - balanced age distribution
  stationary: {
    '0-4': { malePct: 3.1, femalePct: 2.9 },
    '5-9': { malePct: 3.2, femalePct: 3.0 },
    '10-14': { malePct: 3.3, femalePct: 3.1 },
    '15-19': { malePct: 3.4, femalePct: 3.2 },
    '20-24': { malePct: 3.5, femalePct: 3.3 },
    '25-29': { malePct: 3.7, femalePct: 3.5 },
    '30-34': { malePct: 3.8, femalePct: 3.6 },
    '35-39': { malePct: 3.9, femalePct: 3.7 },
    '40-44': { malePct: 3.8, femalePct: 3.6 },
    '45-49': { malePct: 3.7, femalePct: 3.5 },
    '50-54': { malePct: 3.6, femalePct: 3.4 },
    '55-59': { malePct: 3.4, femalePct: 3.3 },
    '60-64': { malePct: 3.2, femalePct: 3.1 },
    '65-69': { malePct: 2.9, femalePct: 2.9 },
    '70-74': { malePct: 2.5, femalePct: 2.6 },
    '75-79': { malePct: 2.0, femalePct: 2.2 },
    '80-84': { malePct: 1.4, femalePct: 1.7 },
    '85-89': { malePct: 0.8, femalePct: 1.1 },
    '90-94': { malePct: 0.3, femalePct: 0.5 },
    '95-99': { malePct: 0.1, femalePct: 0.2 },
    '100+': { malePct: 0.0, femalePct: 0.1 }
  }
};

// Determine pyramid type based on country characteristics
function getPyramidType(country) {
  const { region, population2024 } = country;
  
  // Simplified classification based on region and population size
  if (region === 'Africa' && population2024 > 5000000) {
    return 'expansive'; // Most of Africa has young populations
  } else if (region === 'Europe' || (region === 'Asia' && ['Japan', 'South Korea'].includes(country.name))) {
    return 'constrictive'; // Europe and East Asia aging
  } else if (region === 'Americas' && population2024 > 20000000) {
    return 'stationary'; // Large Americas countries relatively stable
  } else if (region === 'Asia' && ['China', 'India', 'Indonesia'].includes(country.name)) {
    return 'stationary'; // Large Asian countries transitioning
  } else if (population2024 < 1000000) {
    return 'stationary'; // Small countries tend to be stable
  } else {
    return Math.random() > 0.5 ? 'expansive' : 'stationary'; // Mixed for others
  }
}

// Generate age group data based on pattern
function generateAgeGroupData(totalPopulation, pattern) {
  const ageGroups = [];
  const ageRanges = Object.keys(pattern);
  
  for (const ageRange of ageRanges) {
    const { malePct, femalePct } = pattern[ageRange];
    const male = Math.round((totalPopulation * malePct) / 100);
    const female = Math.round((totalPopulation * femalePct) / 100);
    const total = male + female;
    
    ageGroups.push({
      ageRange,
      male,
      female,
      total,
      malePercent: parseFloat(malePct.toFixed(1)),
      femalePercent: parseFloat(femalePct.toFixed(1)),
      totalPercent: parseFloat(((total / totalPopulation) * 100).toFixed(1))
    });
  }
  
  return ageGroups;
}

// Generate historical data (simplified - just scale current data)
function generateHistoricalYears(baseYear, basePopulation, pattern) {
  const years = {};
  const yearList = [2024, 2023, 2022, 2021, 2020, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1980, 1975, 1970];
  
  for (const year of yearList) {
    // Simple population scaling based on global growth trends
    let populationMultiplier = 1;
    if (year < 2024) {
      const yearsBack = 2024 - year;
      populationMultiplier = 1 - (yearsBack * 0.012); // ~1.2% annual decline going back
    }
    
    const yearPopulation = Math.round(basePopulation * populationMultiplier);
    const malePopulation = Math.round(yearPopulation * 0.495); // ~49.5% male
    const femalePopulation = yearPopulation - malePopulation;
    
    const ageGroups = generateAgeGroupData(yearPopulation, pattern);
    const medianAge = calculateMedianAge(pattern);
    
    years[year.toString()] = {
      year,
      totalPopulation: yearPopulation,
      malePopulation,
      femalePopulation,
      medianAge,
      ageGroups
    };
  }
  
  return years;
}

// Calculate median age based on age distribution
function calculateMedianAge(pattern) {
  const ageRanges = Object.keys(pattern);
  let cumulative = 0;
  
  for (const ageRange of ageRanges) {
    const { malePct, femalePct } = pattern[ageRange];
    cumulative += malePct + femalePct;
    
    if (cumulative >= 50) {
      // Simple approximation - use midpoint of age range
      if (ageRange === '100+') return 85;
      const [min, max] = ageRange.split('-').map(Number);
      return (min + max) / 2;
    }
  }
  
  return 35; // fallback
}

// Generate population data for a country
function generateCountryData(country) {
  const pyramidType = getPyramidType(country);
  const pattern = demographicPatterns[pyramidType];
  const years = generateHistoricalYears(2024, country.population2024, pattern);
  
  return {
    countryCode: country.code,
    countryName: country.name,
    slug: country.slug,
    region: country.region,
    years
  };
}

// Create output directory
const outputDir = path.join(__dirname, '..', 'src', 'data', 'population');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Generating population data for ${countries.length} countries...`);

let processed = 0;
for (const country of countries) {
  const populationData = generateCountryData(country);
  const filename = `${country.slug}.json`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(populationData, null, 2));
  processed++;
  
  if (processed % 20 === 0) {
    console.log(`Processed ${processed}/${countries.length} countries...`);
  }
}

console.log(`✓ Generated population data for all ${countries.length} countries!`);
console.log(`Files saved to: ${outputDir}`);

// Generate summary stats
const summary = {
  totalCountries: countries.length,
  regionCounts: {},
  pyramidTypes: { expansive: 0, constrictive: 0, stationary: 0 }
};

for (const country of countries) {
  summary.regionCounts[country.region] = (summary.regionCounts[country.region] || 0) + 1;
  const pyramidType = getPyramidType(country);
  summary.pyramidTypes[pyramidType]++;
}

console.log('\nSummary:');
console.log(`Total countries: ${summary.totalCountries}`);
console.log('By region:', summary.regionCounts);
console.log('By pyramid type:', summary.pyramidTypes);