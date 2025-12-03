// Regional neighbors and comparison countries for demographic analysis
export const countryNeighbors: Record<string, string[]> = {
  // Africa
  'algeria': ['morocco', 'tunisia', 'libya', 'egypt'],
  'angola': ['namibia', 'zambia', 'democratic-republic-of-the-congo', 'botswana'],
  'botswana': ['south-africa', 'namibia', 'zambia', 'zimbabwe'],
  'cameroon': ['nigeria', 'chad', 'central-african-republic', 'gabon'],
  'democratic-republic-of-the-congo': ['angola', 'zambia', 'tanzania', 'uganda', 'central-african-republic'],
  'egypt': ['libya', 'sudan', 'algeria', 'morocco'],
  'ethiopia': ['kenya', 'sudan', 'somalia', 'eritrea', 'uganda'],
  'ghana': ['nigeria', 'burkina-faso', 'ivory-coast', 'togo'],
  'kenya': ['ethiopia', 'uganda', 'tanzania', 'somalia'],
  'morocco': ['algeria', 'tunisia', 'spain', 'egypt'],
  'namibia': ['south-africa', 'botswana', 'zambia', 'angola'],
  'nigeria': ['cameroon', 'niger', 'chad', 'ghana'],
  'south-africa': ['namibia', 'botswana', 'zimbabwe', 'zambia'],
  'tanzania': ['kenya', 'uganda', 'rwanda', 'burundi', 'democratic-republic-of-the-congo'],
  'uganda': ['kenya', 'tanzania', 'rwanda', 'democratic-republic-of-the-congo', 'sudan'],
  'zambia': ['democratic-republic-of-the-congo', 'tanzania', 'malawi', 'mozambique', 'zimbabwe', 'botswana', 'namibia', 'angola'],
  
  // Europe
  'france': ['germany', 'spain', 'italy', 'united-kingdom', 'belgium'],
  'germany': ['france', 'poland', 'netherlands', 'austria', 'czech-republic'],
  'italy': ['france', 'spain', 'germany', 'austria', 'slovenia'],
  'poland': ['germany', 'czech-republic', 'slovakia', 'ukraine', 'lithuania'],
  'spain': ['france', 'portugal', 'italy', 'morocco'],
  'united-kingdom': ['ireland', 'france', 'netherlands', 'belgium', 'norway'],
  
  // Nordic Countries
  'finland': ['sweden', 'norway', 'estonia', 'russia'],
  'sweden': ['norway', 'finland', 'denmark'],
  'norway': ['sweden', 'finland', 'denmark'],
  'denmark': ['sweden', 'norway', 'germany'],
  'iceland': ['norway', 'denmark', 'united-kingdom'],
  'estonia': ['finland', 'latvia', 'lithuania', 'russia'],
  'latvia': ['estonia', 'lithuania', 'russia'],
  'lithuania': ['latvia', 'estonia', 'poland', 'russia'],
  
  // Asia
  'china': ['india', 'russia', 'mongolia', 'kazakhstan', 'japan'],
  'india': ['china', 'pakistan', 'bangladesh', 'nepal', 'sri-lanka'],
  'indonesia': ['malaysia', 'singapore', 'thailand', 'philippines', 'brunei'],
  'japan': ['south-korea', 'china', 'russia'],
  'pakistan': ['india', 'afghanistan', 'iran', 'china'],
  'thailand': ['myanmar', 'laos', 'cambodia', 'malaysia', 'vietnam'],
  'vietnam': ['china', 'laos', 'cambodia', 'thailand'],
  
  // North America
  'canada': ['united-states', 'denmark', 'russia'],
  'mexico': ['united-states', 'guatemala', 'belize'],
  'united-states': ['canada', 'mexico'],
  
  // South America
  'argentina': ['chile', 'brazil', 'uruguay', 'paraguay', 'bolivia'],
  'brazil': ['argentina', 'colombia', 'venezuela', 'peru', 'bolivia'],
  'chile': ['argentina', 'peru', 'bolivia'],
  'colombia': ['venezuela', 'brazil', 'peru', 'ecuador', 'panama'],
  'peru': ['brazil', 'colombia', 'ecuador', 'bolivia', 'chile'],
  'venezuela': ['colombia', 'brazil', 'guyana'],
  
  // Oceania
  'australia': ['new-zealand', 'indonesia', 'papua-new-guinea'],
  'new-zealand': ['australia'],
  
  // Middle East
  'iran': ['turkey', 'iraq', 'afghanistan', 'pakistan'],
  'israel': ['egypt', 'jordan', 'lebanon', 'syria', 'turkey'],
  'saudi-arabia': ['yemen', 'oman', 'united-arab-emirates', 'kuwait', 'qatar', 'bahrain', 'jordan', 'iraq'],
  'turkey': ['greece', 'bulgaria', 'georgia', 'armenia', 'iran', 'iraq', 'syria'],
  'united-arab-emirates': ['saudi-arabia', 'oman', 'qatar'],
};

// Get neighbors for a country, with fallback to regional countries
export function getCountryNeighbors(countrySlug: string): string[] {
  return countryNeighbors[countrySlug] || [];
}

// Regional groupings for broader comparisons
export const regionalGroups: Record<string, string[]> = {
  'sub-saharan-africa': ['nigeria', 'ethiopia', 'democratic-republic-of-the-congo', 'tanzania', 'south-africa', 'kenya', 'uganda', 'ghana', 'mozambique', 'madagascar'],
  'north-africa': ['egypt', 'algeria', 'sudan', 'morocco', 'tunisia', 'libya'],
  'western-europe': ['germany', 'france', 'united-kingdom', 'italy', 'spain', 'netherlands', 'belgium', 'greece', 'portugal', 'austria'],
  'nordic-baltic': ['sweden', 'norway', 'denmark', 'finland', 'iceland', 'estonia', 'latvia', 'lithuania'],
  'eastern-europe': ['russia', 'poland', 'ukraine', 'romania', 'czech-republic', 'hungary', 'belarus', 'bulgaria', 'slovakia', 'croatia'],
  'east-asia': ['china', 'japan', 'south-korea', 'north-korea', 'mongolia'],
  'south-asia': ['india', 'pakistan', 'bangladesh', 'sri-lanka', 'nepal', 'afghanistan', 'bhutan', 'maldives'],
  'southeast-asia': ['indonesia', 'thailand', 'vietnam', 'myanmar', 'malaysia', 'cambodia', 'laos', 'singapore', 'philippines', 'brunei'],
  'middle-east': ['turkey', 'iran', 'iraq', 'saudi-arabia', 'syria', 'israel', 'jordan', 'lebanon', 'yemen', 'united-arab-emirates'],
  'north-america': ['united-states', 'canada', 'mexico'],
  'south-america': ['brazil', 'argentina', 'colombia', 'peru', 'venezuela', 'chile', 'ecuador', 'bolivia', 'paraguay', 'uruguay'],
  'oceania': ['australia', 'new-zealand', 'papua-new-guinea', 'fiji']
};

export function getRegionalCountries(countrySlug: string): string[] {
  for (const [region, countries] of Object.entries(regionalGroups)) {
    if (countries.includes(countrySlug)) {
      return countries.filter(c => c !== countrySlug).slice(0, 4); // Return 4 regional countries
    }
  }
  return [];
}