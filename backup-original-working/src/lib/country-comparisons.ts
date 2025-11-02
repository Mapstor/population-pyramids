export const countryComparisons: Record<string, string[]> = {
  // North America
  'united-states': ['china', 'india', 'canada', 'mexico'],
  'canada': ['united-states', 'united-kingdom', 'australia', 'france'],
  'mexico': ['united-states', 'brazil', 'colombia', 'argentina'],
  
  // South America
  'brazil': ['mexico', 'argentina', 'colombia', 'united-states'],
  'argentina': ['brazil', 'chile', 'uruguay', 'mexico'],
  'colombia': ['brazil', 'mexico', 'venezuela', 'peru'],
  'chile': ['argentina', 'peru', 'bolivia', 'uruguay'],
  'peru': ['colombia', 'brazil', 'chile', 'ecuador'],
  'venezuela': ['colombia', 'brazil', 'mexico', 'argentina'],
  
  // Europe
  'germany': ['france', 'united-kingdom', 'italy', 'poland'],
  'france': ['germany', 'united-kingdom', 'italy', 'spain'],
  'united-kingdom': ['germany', 'france', 'spain', 'italy'],
  'italy': ['germany', 'france', 'spain', 'united-kingdom'],
  'spain': ['france', 'italy', 'portugal', 'united-kingdom'],
  'poland': ['germany', 'ukraine', 'czech-republic', 'belarus'],
  'russia': ['china', 'japan', 'germany', 'ukraine'],
  
  // Asia
  'china': ['india', 'united-states', 'japan', 'indonesia'],
  'india': ['china', 'pakistan', 'bangladesh', 'indonesia'],
  'japan': ['south-korea', 'germany', 'china', 'taiwan'],
  'south-korea': ['japan', 'north-korea', 'china', 'taiwan'],
  'indonesia': ['india', 'philippines', 'malaysia', 'bangladesh'],
  'pakistan': ['india', 'bangladesh', 'afghanistan', 'iran'],
  'bangladesh': ['india', 'pakistan', 'indonesia', 'philippines'],
  'vietnam': ['thailand', 'philippines', 'cambodia', 'myanmar'],
  'thailand': ['vietnam', 'myanmar', 'malaysia', 'cambodia'],
  'philippines': ['indonesia', 'vietnam', 'malaysia', 'thailand'],
  
  // Africa
  'nigeria': ['ethiopia', 'egypt', 'democratic-republic-of-the-congo', 'south-africa'],
  'ethiopia': ['nigeria', 'kenya', 'tanzania', 'uganda'],
  'egypt': ['nigeria', 'algeria', 'sudan', 'morocco'],
  'south-africa': ['nigeria', 'kenya', 'tanzania', 'zimbabwe'],
  'kenya': ['ethiopia', 'tanzania', 'uganda', 'south-africa'],
  'tanzania': ['kenya', 'uganda', 'mozambique', 'democratic-republic-of-the-congo'],
  'algeria': ['egypt', 'morocco', 'tunisia', 'libya'],
  'morocco': ['algeria', 'spain', 'tunisia', 'egypt'],
  'democratic-republic-of-the-congo': ['nigeria', 'angola', 'tanzania', 'uganda'],
  'angola': ['democratic-republic-of-the-congo', 'zambia', 'namibia', 'mozambique'],
  
  // Middle East
  'iran': ['pakistan', 'turkey', 'iraq', 'afghanistan'],
  'turkey': ['iran', 'germany', 'egypt', 'syria'],
  'saudi-arabia': ['egypt', 'iran', 'iraq', 'yemen'],
  'iraq': ['iran', 'turkey', 'syria', 'saudi-arabia'],
  
  // Oceania
  'australia': ['canada', 'united-kingdom', 'new-zealand', 'united-states'],
  'new-zealand': ['australia', 'united-kingdom', 'canada', 'singapore'],
};

// Fallback if country not in map
export function getComparisons(countrySlug: string): string[] {
  return countryComparisons[countrySlug] || ['united-states', 'china', 'india', 'germany'];
}