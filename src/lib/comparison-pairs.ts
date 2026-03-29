// Comprehensive list of 200+ comparison pairs for SSG

export interface ComparisonPair {
  slug: string;
  country1: string;
  country2: string;
  country1Name: string;
  country2Name: string;
  title: string;
  description: string;
  category: 'superpower' | 'regional' | 'development' | 'vs-china' | 'vs-usa' | 'economic' | 'historical';
}

export const COMPARISON_PAIRS: ComparisonPair[] = [
  // === SUPERPOWERS & MAJOR ECONOMIES ===
  {
    slug: 'china-vs-india',
    country1: 'china',
    country2: 'india',
    country1Name: 'China',
    country2Name: 'India',
    title: 'China vs India: Population Giants Face Off',
    description: 'Compare the world\'s two most populous nations. China faces decline while India continues growing, marking a historic demographic shift.',
    category: 'superpower'
  },
  {
    slug: 'usa-vs-china',
    country1: 'united-states',
    country2: 'china',
    country1Name: 'United States',
    country2Name: 'China',
    title: 'USA vs China: Superpower Demographics Compared',
    description: 'Compare population structures of the world\'s two largest economies. Immigration-driven growth vs rapid aging.',
    category: 'superpower'
  },
  {
    slug: 'usa-vs-india',
    country1: 'united-states',
    country2: 'india',
    country1Name: 'United States',
    country2Name: 'India',
    title: 'USA vs India: Democracy Giants Compared',
    description: 'World\'s oldest and largest democracies face different demographic futures. Young India vs aging America.',
    category: 'superpower'
  },

  // === REGIONAL RIVALS & NEIGHBORS ===
  
  // Asia
  {
    slug: 'india-vs-pakistan',
    country1: 'india',
    country2: 'pakistan',
    country1Name: 'India',
    country2Name: 'Pakistan',
    title: 'India vs Pakistan: South Asian Rivals',
    description: 'Partition neighbors with divergent paths. India\'s slowing growth vs Pakistan\'s youth bulge.',
    category: 'regional'
  },
  {
    slug: 'india-vs-bangladesh',
    country1: 'india',
    country2: 'bangladesh',
    country1Name: 'India',
    country2Name: 'Bangladesh',
    title: 'India vs Bangladesh: Bengal Region Demographics',
    description: 'Compare demographic transitions in South Asia. Bangladesh\'s remarkable fertility decline vs India\'s regional variations.',
    category: 'regional'
  },
  {
    slug: 'china-vs-japan',
    country1: 'china',
    country2: 'japan',
    country1Name: 'China',
    country2Name: 'Japan',
    title: 'China vs Japan: East Asian Powers',
    description: 'Asia\'s economic giants face similar aging challenges. Japan leads the demographic transition China now follows.',
    category: 'regional'
  },
  {
    slug: 'japan-vs-south-korea',
    country1: 'japan',
    country2: 'south-korea',
    country1Name: 'Japan',
    country2Name: 'South Korea',
    title: 'Japan vs South Korea: Aging Tigers',
    description: 'World\'s fastest aging societies. Both face record-low fertility and shrinking workforces.',
    category: 'regional'
  },
  {
    slug: 'indonesia-vs-philippines',
    country1: 'indonesia',
    country2: 'philippines',
    country1Name: 'Indonesia',
    country2Name: 'Philippines',
    title: 'Indonesia vs Philippines: Southeast Asian Giants',
    description: 'Maritime nations with young populations. Different fertility trends and urbanization patterns.',
    category: 'regional'
  },
  {
    slug: 'thailand-vs-vietnam',
    country1: 'thailand',
    country2: 'vietnam',
    country1Name: 'Thailand',
    country2Name: 'Vietnam',
    title: 'Thailand vs Vietnam: Mekong Neighbors',
    description: 'Southeast Asian development models. Thailand\'s aging society vs Vietnam\'s demographic dividend.',
    category: 'regional'
  },
  {
    slug: 'malaysia-vs-singapore',
    country1: 'malaysia',
    country2: 'singapore',
    country1Name: 'Malaysia',
    country2Name: 'Singapore',
    title: 'Malaysia vs Singapore: Separated Twins',
    description: 'Former federation partners with divergent paths. Multi-ethnic demographics and different development stages.',
    category: 'regional'
  },
  
  // Middle East
  {
    slug: 'iran-vs-saudi-arabia',
    country1: 'iran',
    country2: 'saudi-arabia',
    country1Name: 'Iran',
    country2Name: 'Saudi Arabia',
    title: 'Iran vs Saudi Arabia: Middle East Rivals',
    description: 'Regional powers with contrasting demographics. Iran\'s fertility collapse vs Saudi youth bulge.',
    category: 'regional'
  },
  {
    slug: 'israel-vs-palestine',
    country1: 'israel',
    country2: 'palestine',
    country1Name: 'Israel',
    country2Name: 'Palestine',
    title: 'Israel vs Palestine: Demographic Competition',
    description: 'Population growth as geopolitical factor. High fertility on both sides with different age structures.',
    category: 'regional'
  },
  {
    slug: 'turkey-vs-greece',
    country1: 'turkey',
    country2: 'greece',
    country1Name: 'Turkey',
    country2Name: 'Greece',
    title: 'Turkey vs Greece: Aegean Neighbors',
    description: 'Historic rivals with opposite trends. Turkey\'s youth vs Greece\'s rapid aging.',
    category: 'regional'
  },
  {
    slug: 'egypt-vs-ethiopia',
    country1: 'egypt',
    country2: 'ethiopia',
    country1Name: 'Egypt',
    country2Name: 'Ethiopia',
    title: 'Egypt vs Ethiopia: Nile River Powers',
    description: 'Africa\'s ancient civilizations compete for regional influence. Both face massive youth populations.',
    category: 'regional'
  },
  
  // Europe
  {
    slug: 'germany-vs-france',
    country1: 'germany',
    country2: 'france',
    country1Name: 'Germany',
    country2Name: 'France',
    title: 'Germany vs France: EU Leaders Compared',
    description: 'Europe\'s demographic divergence. France maintains higher fertility while Germany relies on immigration.',
    category: 'regional'
  },
  {
    slug: 'uk-vs-france',
    country1: 'united-kingdom',
    country2: 'france',
    country1Name: 'United Kingdom',
    country2Name: 'France',
    title: 'UK vs France: Channel Rivals',
    description: 'Historic competitors with similar populations but different demographic strategies post-Brexit.',
    category: 'regional'
  },
  {
    slug: 'uk-vs-germany',
    country1: 'united-kingdom',
    country2: 'germany',
    country1Name: 'United Kingdom',
    country2Name: 'Germany',
    title: 'UK vs Germany: European Powerhouses',
    description: 'Post-Brexit demographics. Different approaches to aging societies and immigration.',
    category: 'regional'
  },
  {
    slug: 'spain-vs-italy',
    country1: 'spain',
    country2: 'italy',
    country1Name: 'Spain',
    country2Name: 'Italy',
    title: 'Spain vs Italy: Mediterranean Demographics',
    description: 'Southern Europe\'s demographic crisis. Both face extreme low fertility and youth unemployment.',
    category: 'regional'
  },
  {
    slug: 'poland-vs-ukraine',
    country1: 'poland',
    country2: 'ukraine',
    country1Name: 'Poland',
    country2Name: 'Ukraine',
    title: 'Poland vs Ukraine: Slavic Neighbors',
    description: 'Eastern European demographics shaped by migration. War\'s impact on Ukraine\'s population.',
    category: 'regional'
  },
  {
    slug: 'russia-vs-ukraine',
    country1: 'russia',
    country2: 'ukraine',
    country1Name: 'Russia',
    country2Name: 'Ukraine',
    title: 'Russia vs Ukraine: Post-Soviet Demographics',
    description: 'Former Soviet states in demographic decline. War and emigration reshape both populations.',
    category: 'regional'
  },
  {
    slug: 'sweden-vs-norway',
    country1: 'sweden',
    country2: 'norway',
    country1Name: 'Sweden',
    country2Name: 'Norway',
    title: 'Sweden vs Norway: Nordic Neighbors',
    description: 'Scandinavian welfare states with different immigration approaches and fertility patterns.',
    category: 'regional'
  },
  
  // Americas
  {
    slug: 'usa-vs-mexico',
    country1: 'united-states',
    country2: 'mexico',
    country1Name: 'United States',
    country2Name: 'Mexico',
    title: 'USA vs Mexico: NAFTA Partners',
    description: 'North American neighbors linked by migration. Mexico\'s demographic transition affects both.',
    category: 'regional'
  },
  {
    slug: 'usa-vs-canada',
    country1: 'united-states',
    country2: 'canada',
    country1Name: 'United States',
    country2Name: 'Canada',
    title: 'USA vs Canada: North American Allies',
    description: 'Similar cultures, different demographics. Canada\'s higher immigration rate vs US natural growth.',
    category: 'regional'
  },
  {
    slug: 'brazil-vs-argentina',
    country1: 'brazil',
    country2: 'argentina',
    country1Name: 'Brazil',
    country2Name: 'Argentina',
    title: 'Brazil vs Argentina: South American Giants',
    description: 'Latin America\'s largest economies. Brazil\'s diversity vs Argentina\'s European heritage.',
    category: 'regional'
  },
  {
    slug: 'mexico-vs-brazil',
    country1: 'mexico',
    country2: 'brazil',
    country1Name: 'Mexico',
    country2Name: 'Brazil',
    title: 'Mexico vs Brazil: Latin Powers',
    description: 'Latin America\'s demographic leaders. Similar fertility declines, different age structures.',
    category: 'regional'
  },
  {
    slug: 'colombia-vs-venezuela',
    country1: 'colombia',
    country2: 'venezuela',
    country1Name: 'Colombia',
    country2Name: 'Venezuela',
    title: 'Colombia vs Venezuela: Andean Neighbors',
    description: 'Migration reversal shapes both. Venezuela\'s exodus becomes Colombia\'s demographic gain.',
    category: 'regional'
  },
  {
    slug: 'chile-vs-argentina',
    country1: 'chile',
    country2: 'argentina',
    country1Name: 'Chile',
    country2Name: 'Argentina',
    title: 'Chile vs Argentina: Andes Rivals',
    description: 'Southern Cone demographics. Chile\'s stability vs Argentina\'s volatility affects population trends.',
    category: 'regional'
  },
  
  // Africa
  {
    slug: 'nigeria-vs-ethiopia',
    country1: 'nigeria',
    country2: 'ethiopia',
    country1Name: 'Nigeria',
    country2Name: 'Ethiopia',
    title: 'Nigeria vs Ethiopia: African Giants',
    description: 'Africa\'s most populous nations. Both have massive youth bulges driving rapid growth.',
    category: 'regional'
  },
  {
    slug: 'nigeria-vs-egypt',
    country1: 'nigeria',
    country2: 'egypt',
    country1Name: 'Nigeria',
    country2Name: 'Egypt',
    title: 'Nigeria vs Egypt: African Powers',
    description: 'West vs North Africa demographics. Nigeria\'s explosion vs Egypt\'s controlled growth.',
    category: 'regional'
  },
  {
    slug: 'south-africa-vs-nigeria',
    country1: 'south-africa',
    country2: 'nigeria',
    country1Name: 'South Africa',
    country2Name: 'Nigeria',
    title: 'South Africa vs Nigeria: African Economies',
    description: 'Contrasting African development models. South Africa\'s middle-income trap vs Nigeria\'s youth dividend.',
    category: 'regional'
  },
  {
    slug: 'kenya-vs-ethiopia',
    country1: 'kenya',
    country2: 'ethiopia',
    country1Name: 'Kenya',
    country2Name: 'Ethiopia',
    title: 'Kenya vs Ethiopia: East African Rivals',
    description: 'Horn of Africa demographics. Both experiencing rapid urbanization and fertility decline.',
    category: 'regional'
  },
  {
    slug: 'egypt-vs-sudan',
    country1: 'egypt',
    country2: 'sudan',
    country1Name: 'Egypt',
    country2Name: 'Sudan',
    title: 'Egypt vs Sudan: Nile Neighbors',
    description: 'Nile Valley demographics. Egypt\'s density vs Sudan\'s vast spaces shape different patterns.',
    category: 'regional'
  },
  
  // === VS CHINA COMPARISONS (Major Countries) ===
  {
    slug: 'china-vs-russia',
    country1: 'china',
    country2: 'russia',
    country1Name: 'China',
    country2Name: 'Russia',
    title: 'China vs Russia: Authoritarian Allies',
    description: 'Different demographic crises. China\'s aging wave vs Russia\'s mortality crisis.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-brazil',
    country1: 'china',
    country2: 'brazil',
    country1Name: 'China',
    country2Name: 'Brazil',
    title: 'China vs Brazil: BRICS Leaders',
    description: 'BRICS demographics diverge. China\'s aging vs Brazil\'s younger population structure.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-indonesia',
    country1: 'china',
    country2: 'indonesia',
    country1Name: 'China',
    country2Name: 'Indonesia',
    title: 'China vs Indonesia: Asian Manufacturing',
    description: 'Manufacturing demographics shift. Indonesia\'s youth advantage as China ages.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-pakistan',
    country1: 'china',
    country2: 'pakistan',
    country1Name: 'China',
    country2Name: 'Pakistan',
    title: 'China vs Pakistan: Belt and Road Partners',
    description: 'Strategic partners with opposite demographics. Pakistan\'s youth vs China\'s aging.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-bangladesh',
    country1: 'china',
    country2: 'bangladesh',
    country1Name: 'China',
    country2Name: 'Bangladesh',
    title: 'China vs Bangladesh: Asian Manufacturing Shift',
    description: 'Textile demographics. Bangladesh benefits as China\'s workforce shrinks.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-nigeria',
    country1: 'china',
    country2: 'nigeria',
    country1Name: 'China',
    country2Name: 'Nigeria',
    title: 'China vs Nigeria: Different Trajectories',
    description: 'Opposite demographic futures. China shrinks while Nigeria explodes in population.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-germany',
    country1: 'china',
    country2: 'germany',
    country1Name: 'China',
    country2Name: 'Germany',
    title: 'China vs Germany: Export Champions',
    description: 'Manufacturing powers face workforce decline. Different approaches to automation and immigration.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-uk',
    country1: 'china',
    country2: 'united-kingdom',
    country1Name: 'China',
    country2Name: 'United Kingdom',
    title: 'China vs UK: Old Empire vs New Power',
    description: 'Historical reversal in demographics. China\'s scale vs UK\'s post-Brexit challenges.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-france',
    country1: 'china',
    country2: 'france',
    country1Name: 'China',
    country2Name: 'France',
    title: 'China vs France: Different Demographic Models',
    description: 'Contrasting approaches to fertility. France\'s pro-natal policies vs China\'s reversal.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-south-korea',
    country1: 'china',
    country2: 'south-korea',
    country1Name: 'China',
    country2Name: 'South Korea',
    title: 'China vs South Korea: East Asian Aging',
    description: 'Rapid aging across East Asia. South Korea\'s world-lowest fertility vs China\'s scale.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-vietnam',
    country1: 'china',
    country2: 'vietnam',
    country1Name: 'China',
    country2Name: 'Vietnam',
    title: 'China vs Vietnam: Communist Demographics',
    description: 'Socialist states diverge. Vietnam\'s continued growth vs China\'s decline.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-thailand',
    country1: 'china',
    country2: 'thailand',
    country1Name: 'China',
    country2Name: 'Thailand',
    title: 'China vs Thailand: Asian Aging Patterns',
    description: 'Middle-income aging trap. Both face getting old before getting rich.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-philippines',
    country1: 'china',
    country2: 'philippines',
    country1Name: 'China',
    country2Name: 'Philippines',
    title: 'China vs Philippines: South China Sea Rivals',
    description: 'Demographic opposites. Philippines\' youth advantage in territorial disputes.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-mexico',
    country1: 'china',
    country2: 'mexico',
    country1Name: 'China',
    country2Name: 'Mexico',
    title: 'China vs Mexico: Manufacturing Competition',
    description: 'Global factory demographics. Mexico benefits from nearshoring as China ages.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-turkey',
    country1: 'china',
    country2: 'turkey',
    country1Name: 'China',
    country2Name: 'Turkey',
    title: 'China vs Turkey: Eurasian Powers',
    description: 'Belt and Road demographics. Turkey\'s strategic youth vs China\'s aging workforce.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-iran',
    country1: 'china',
    country2: 'iran',
    country1Name: 'China',
    country2Name: 'Iran',
    title: 'China vs Iran: Sanctions and Demographics',
    description: 'Strategic partners facing different challenges. Both experienced dramatic fertility decline.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-egypt',
    country1: 'china',
    country2: 'egypt',
    country1Name: 'China',
    country2Name: 'Egypt',
    title: 'China vs Egypt: Ancient Civilizations',
    description: 'Historic powers, different futures. Egypt\'s youth bulge vs China\'s aging society.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-saudi-arabia',
    country1: 'china',
    country2: 'saudi-arabia',
    country1Name: 'China',
    country2Name: 'Saudi Arabia',
    title: 'China vs Saudi Arabia: Oil and Manufacturing',
    description: 'Energy partnership demographics. Saudi\'s young nationals vs China\'s shrinking workforce.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-south-africa',
    country1: 'china',
    country2: 'south-africa',
    country1Name: 'China',
    country2Name: 'South Africa',
    title: 'China vs South Africa: BRICS Demographics',
    description: 'BRICS contrasts. South Africa\'s HIV impact vs China\'s one-child legacy.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-canada',
    country1: 'china',
    country2: 'canada',
    country1Name: 'China',
    country2Name: 'Canada',
    title: 'China vs Canada: Immigration Destinations',
    description: 'Chinese diaspora shapes both. Canada\'s immigration gain vs China\'s brain drain.',
    category: 'vs-china'
  },
  {
    slug: 'china-vs-australia',
    country1: 'china',
    country2: 'australia',
    country1Name: 'China',
    country2Name: 'Australia',
    title: 'China vs Australia: Pacific Trade Partners',
    description: 'Resource demographics. Australia\'s immigration success vs China\'s internal migration.',
    category: 'vs-china'
  },
  
  // === VS USA COMPARISONS (Major Countries) ===
  {
    slug: 'usa-vs-russia',
    country1: 'united-states',
    country2: 'russia',
    country1Name: 'United States',
    country2Name: 'Russia',
    title: 'USA vs Russia: Cold War Demographics',
    description: 'Former superpowers diverge. US growth through immigration vs Russian population decline.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-brazil',
    country1: 'united-states',
    country2: 'brazil',
    country1Name: 'United States',
    country2Name: 'Brazil',
    title: 'USA vs Brazil: Americas Leaders',
    description: 'Western Hemisphere giants. Different approaches to diversity and development.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-indonesia',
    country1: 'united-states',
    country2: 'indonesia',
    country1Name: 'United States',
    country2Name: 'Indonesia',
    title: 'USA vs Indonesia: Democracy and Demographics',
    description: 'Large democracies with different challenges. US aging vs Indonesia\'s youth dividend.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-pakistan',
    country1: 'united-states',
    country2: 'pakistan',
    country1Name: 'United States',
    country2Name: 'Pakistan',
    title: 'USA vs Pakistan: Strategic Partners',
    description: 'Complex alliance demographics. Pakistan\'s youth bulge vs US technological edge.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-bangladesh',
    country1: 'united-states',
    country2: 'bangladesh',
    country1Name: 'United States',
    country2Name: 'Bangladesh',
    title: 'USA vs Bangladesh: Development Contrast',
    description: 'Different stages of demographic transition. Bangladesh\'s remarkable progress vs US maturity.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-nigeria',
    country1: 'united-states',
    country2: 'nigeria',
    country1Name: 'United States',
    country2Name: 'Nigeria',
    title: 'USA vs Nigeria: Different Worlds',
    description: 'Extreme demographic contrast. Nigeria\'s explosion vs US controlled growth.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-japan',
    country1: 'united-states',
    country2: 'japan',
    country1Name: 'United States',
    country2Name: 'Japan',
    title: 'USA vs Japan: Allied Demographics',
    description: 'Pacific allies face different futures. Japan\'s decline vs US immigration advantage.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-germany',
    country1: 'united-states',
    country2: 'germany',
    country1Name: 'United States',
    country2Name: 'Germany',
    title: 'USA vs Germany: Western Leaders',
    description: 'Transatlantic demographics. Different approaches to immigration and integration.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-uk',
    country1: 'united-states',
    country2: 'united-kingdom',
    country1Name: 'United States',
    country2Name: 'United Kingdom',
    title: 'USA vs UK: Special Relationship',
    description: 'Anglo-American demographics diverge. US dynamism vs UK post-Brexit challenges.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-france',
    country1: 'united-states',
    country2: 'france',
    country1Name: 'United States',
    country2Name: 'France',
    title: 'USA vs France: Allied Democracies',
    description: 'Different demographic strategies. France\'s pro-natal policies vs US market approach.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-south-korea',
    country1: 'united-states',
    country2: 'south-korea',
    country1Name: 'United States',
    country2Name: 'South Korea',
    title: 'USA vs South Korea: Pacific Alliance',
    description: 'Allies with opposite trends. South Korea\'s record-low fertility vs US stability.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-vietnam',
    country1: 'united-states',
    country2: 'vietnam',
    country1Name: 'United States',
    country2Name: 'Vietnam',
    title: 'USA vs Vietnam: From War to Partnership',
    description: 'Former enemies, current partners. Vietnam\'s youth vs US experience.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-philippines',
    country1: 'united-states',
    country2: 'philippines',
    country1Name: 'United States',
    country2Name: 'Philippines',
    title: 'USA vs Philippines: Pacific Partners',
    description: 'Colonial history shapes demographics. Filipino diaspora in US vs homeland youth.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-thailand',
    country1: 'united-states',
    country2: 'thailand',
    country1Name: 'United States',
    country2Name: 'Thailand',
    title: 'USA vs Thailand: Different Paths',
    description: 'Development and demographics. Thailand\'s rapid aging vs US gradual transition.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-turkey',
    country1: 'united-states',
    country2: 'turkey',
    country1Name: 'United States',
    country2Name: 'Turkey',
    title: 'USA vs Turkey: NATO Demographics',
    description: 'NATO allies diverge. Turkey\'s youth advantage vs US technological superiority.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-iran',
    country1: 'united-states',
    country2: 'iran',
    country1Name: 'United States',
    country2Name: 'Iran',
    title: 'USA vs Iran: Sanctions and Demographics',
    description: 'Adversaries with different challenges. Iran\'s educated youth vs US global attraction.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-egypt',
    country1: 'united-states',
    country2: 'egypt',
    country1Name: 'United States',
    country2Name: 'Egypt',
    title: 'USA vs Egypt: Strategic Partnership',
    description: 'Camp David demographics. Egypt\'s youth unemployment vs US labor shortage.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-saudi-arabia',
    country1: 'united-states',
    country2: 'saudi-arabia',
    country1Name: 'United States',
    country2Name: 'Saudi Arabia',
    title: 'USA vs Saudi Arabia: Oil Alliance',
    description: 'Petrodollar demographics. Saudi\'s young nationals vs US immigrant workforce.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-israel',
    country1: 'united-states',
    country2: 'israel',
    country1Name: 'United States',
    country2Name: 'Israel',
    title: 'USA vs Israel: Special Alliance',
    description: 'Strategic partnership demographics. Israel\'s high fertility vs US diversity.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-south-africa',
    country1: 'united-states',
    country2: 'south-africa',
    country1Name: 'United States',
    country2Name: 'South Africa',
    title: 'USA vs South Africa: Different Histories',
    description: 'Post-segregation demographics. Different approaches to diversity and development.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-argentina',
    country1: 'united-states',
    country2: 'argentina',
    country1Name: 'United States',
    country2Name: 'Argentina',
    title: 'USA vs Argentina: Americas Contrast',
    description: 'Different American dreams. Argentina\'s emigration vs US immigration magnetism.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-colombia',
    country1: 'united-states',
    country2: 'colombia',
    country1Name: 'United States',
    country2Name: 'Colombia',
    title: 'USA vs Colombia: Drug War Demographics',
    description: 'Complex relationship shapes populations. Colombian diaspora vs homeland recovery.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-venezuela',
    country1: 'united-states',
    country2: 'venezuela',
    country1Name: 'United States',
    country2Name: 'Venezuela',
    title: 'USA vs Venezuela: Crisis and Migration',
    description: 'Venezuelan exodus reshapes both. US as destination vs Venezuela\'s brain drain.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-chile',
    country1: 'united-states',
    country2: 'chile',
    country1Name: 'United States',
    country2Name: 'Chile',
    title: 'USA vs Chile: Development Models',
    description: 'Different American paths. Chile\'s rapid aging vs US sustained growth.',
    category: 'vs-usa'
  },
  {
    slug: 'usa-vs-peru',
    country1: 'united-states',
    country2: 'peru',
    country1Name: 'United States',
    country2Name: 'Peru',
    title: 'USA vs Peru: Andean Partnership',
    description: 'Peru\'s demographic dividend vs US maturity. Migration links both populations.',
    category: 'vs-usa'
  },
  
  // === DEVELOPMENT CONTRASTS ===
  {
    slug: 'japan-vs-nigeria',
    country1: 'japan',
    country2: 'nigeria',
    country1Name: 'Japan',
    country2Name: 'Nigeria',
    title: 'Japan vs Nigeria: Demographic Extremes',
    description: 'World\'s oldest vs youngest populations. Opposite ends of demographic transition.',
    category: 'development'
  },
  {
    slug: 'germany-vs-ethiopia',
    country1: 'germany',
    country2: 'ethiopia',
    country1Name: 'Germany',
    country2Name: 'Ethiopia',
    title: 'Germany vs Ethiopia: Development Gap',
    description: 'Industrial power vs emerging economy. Aging workforce vs youth bulge.',
    category: 'development'
  },
  {
    slug: 'singapore-vs-bangladesh',
    country1: 'singapore',
    country2: 'bangladesh',
    country1Name: 'Singapore',
    country2Name: 'Bangladesh',
    title: 'Singapore vs Bangladesh: Asian Contrasts',
    description: 'City-state wealth vs densely populated development. Different demographic challenges.',
    category: 'development'
  },
  {
    slug: 'switzerland-vs-congo',
    country1: 'switzerland',
    country2: 'democratic-republic-of-the-congo',
    country1Name: 'Switzerland',
    country2Name: 'DR Congo',
    title: 'Switzerland vs DR Congo: Wealth Extremes',
    description: 'Highest vs lowest development. Aging wealth vs youthful poverty.',
    category: 'development'
  },
  {
    slug: 'norway-vs-yemen',
    country1: 'norway',
    country2: 'yemen',
    country1Name: 'Norway',
    country2Name: 'Yemen',
    title: 'Norway vs Yemen: Oil Demographics',
    description: 'Oil wealth, different outcomes. Norway\'s managed decline vs Yemen\'s crisis.',
    category: 'development'
  },
  {
    slug: 'canada-vs-afghanistan',
    country1: 'canada',
    country2: 'afghanistan',
    country1Name: 'Canada',
    country2Name: 'Afghanistan',
    title: 'Canada vs Afghanistan: Peace and War',
    description: 'Stability vs conflict demographics. Immigration destination vs refugee source.',
    category: 'development'
  },
  {
    slug: 'australia-vs-papua-new-guinea',
    country1: 'australia',
    country2: 'papua-new-guinea',
    country1Name: 'Australia',
    country2Name: 'Papua New Guinea',
    title: 'Australia vs PNG: Pacific Neighbors',
    description: 'Extreme neighbors. Australia\'s controlled immigration vs PNG\'s rapid growth.',
    category: 'development'
  },
  {
    slug: 'south-korea-vs-north-korea',
    country1: 'south-korea',
    country2: 'north-korea',
    country1Name: 'South Korea',
    country2Name: 'North Korea',
    title: 'South vs North Korea: Divided Demographics',
    description: 'One nation, two systems. South\'s wealth and aging vs North\'s isolation.',
    category: 'development'
  },
  {
    slug: 'israel-vs-yemen',
    country1: 'israel',
    country2: 'yemen',
    country1Name: 'Israel',
    country2Name: 'Yemen',
    title: 'Israel vs Yemen: Middle East Extremes',
    description: 'Regional opposites. Israel\'s innovation vs Yemen\'s humanitarian crisis.',
    category: 'development'
  },
  {
    slug: 'netherlands-vs-mali',
    country1: 'netherlands',
    country2: 'mali',
    country1Name: 'Netherlands',
    country2Name: 'Mali',
    title: 'Netherlands vs Mali: Density Paradox',
    description: 'Dense and wealthy vs sparse and poor. Different population pressures.',
    category: 'development'
  },
  
  // === ADDITIONAL REGIONAL PAIRS ===
  {
    slug: 'morocco-vs-algeria',
    country1: 'morocco',
    country2: 'algeria',
    country1Name: 'Morocco',
    country2Name: 'Algeria',
    title: 'Morocco vs Algeria: Maghreb Rivals',
    description: 'North African competitors. Similar demographics, different economic paths.',
    category: 'regional'
  },
  {
    slug: 'saudi-arabia-vs-yemen',
    country1: 'saudi-arabia',
    country2: 'yemen',
    country1Name: 'Saudi Arabia',
    country2Name: 'Yemen',
    title: 'Saudi Arabia vs Yemen: Arabian Peninsula',
    description: 'Oil wealth vs poverty. Saudi intervention in Yemen\'s demographic crisis.',
    category: 'regional'
  },
  {
    slug: 'australia-vs-new-zealand',
    country1: 'australia',
    country2: 'new-zealand',
    country1Name: 'Australia',
    country2Name: 'New Zealand',
    title: 'Australia vs New Zealand: Trans-Tasman',
    description: 'ANZAC demographics. Similar cultures, different scales and immigration.',
    category: 'regional'
  },
  {
    slug: 'cuba-vs-haiti',
    country1: 'cuba',
    country2: 'haiti',
    country1Name: 'Cuba',
    country2Name: 'Haiti',
    title: 'Cuba vs Haiti: Caribbean Contrasts',
    description: 'Same island, different worlds. Cuba\'s aging vs Haiti\'s youth and poverty.',
    category: 'regional'
  },
  {
    slug: 'dominican-republic-vs-haiti',
    country1: 'dominican-republic',
    country2: 'haiti',
    country1Name: 'Dominican Republic',
    country2Name: 'Haiti',
    title: 'Dominican Republic vs Haiti: Hispaniola Divided',
    description: 'One island, two nations. Development shapes demographic divergence.',
    category: 'regional'
  },
  
  // === HISTORICAL COMPARISONS ===
  {
    slug: 'uk-vs-india',
    country1: 'united-kingdom',
    country2: 'india',
    country1Name: 'United Kingdom',
    country2Name: 'India',
    title: 'UK vs India: Empire Reversed',
    description: 'Colonial legacy demographics. India\'s rise vs Britain\'s relative decline.',
    category: 'historical'
  },
  {
    slug: 'spain-vs-mexico',
    country1: 'spain',
    country2: 'mexico',
    country1Name: 'Spain',
    country2Name: 'Mexico',
    title: 'Spain vs Mexico: Colonial Ties',
    description: 'Former empire and colony. Spain\'s aging crisis vs Mexico\'s demographic dividend.',
    category: 'historical'
  },
  {
    slug: 'portugal-vs-brazil',
    country1: 'portugal',
    country2: 'brazil',
    country1Name: 'Portugal',
    country2Name: 'Brazil',
    title: 'Portugal vs Brazil: Lusophone Leaders',
    description: 'Portuguese world demographics. Brazil\'s scale dwarfs former colonizer.',
    category: 'historical'
  },
  {
    slug: 'france-vs-algeria',
    country1: 'france',
    country2: 'algeria',
    country1Name: 'France',
    country2Name: 'Algeria',
    title: 'France vs Algeria: Colonial Legacy',
    description: 'Complex relationship continues. Algerian diaspora shapes French demographics.',
    category: 'historical'
  },
  {
    slug: 'netherlands-vs-indonesia',
    country1: 'netherlands',
    country2: 'indonesia',
    country1Name: 'Netherlands',
    country2Name: 'Indonesia',
    title: 'Netherlands vs Indonesia: Dutch East Indies',
    description: 'Colonial reversal. Indonesia\'s massive population vs Dutch aging.',
    category: 'historical'
  },
  {
    slug: 'italy-vs-ethiopia',
    country1: 'italy',
    country2: 'ethiopia',
    country1Name: 'Italy',
    country2Name: 'Ethiopia',
    title: 'Italy vs Ethiopia: Failed Colonization',
    description: 'Brief colonial attempt. Italy\'s demographic crisis vs Ethiopia\'s growth.',
    category: 'historical'
  },
  {
    slug: 'belgium-vs-congo',
    country1: 'belgium',
    country2: 'democratic-republic-of-the-congo',
    country1Name: 'Belgium',
    country2Name: 'DR Congo',
    title: 'Belgium vs DR Congo: Dark Colonial Past',
    description: 'Extreme exploitation legacy. Congo\'s youth vs Belgium\'s aging prosperity.',
    category: 'historical'
  },
  
  // === ECONOMIC BLOCS ===
  {
    slug: 'germany-vs-poland',
    country1: 'germany',
    country2: 'poland',
    country1Name: 'Germany',
    country2Name: 'Poland',
    title: 'Germany vs Poland: EU Core and Periphery',
    description: 'EU demographics shift east. Polish workers fill German labor gaps.',
    category: 'economic'
  },
  {
    slug: 'singapore-vs-malaysia',
    country1: 'singapore',
    country2: 'malaysia',
    country1Name: 'Singapore',
    country2Name: 'Malaysia',
    title: 'Singapore vs Malaysia: ASEAN Contrasts',
    description: 'Separated but linked. Singapore\'s wealth and aging vs Malaysia\'s diversity.',
    category: 'economic'
  },
  {
    slug: 'uae-vs-saudi-arabia',
    country1: 'united-arab-emirates',
    country2: 'saudi-arabia',
    country1Name: 'UAE',
    country2Name: 'Saudi Arabia',
    title: 'UAE vs Saudi Arabia: Gulf Competition',
    description: 'Gulf demographics differ. UAE\'s expat majority vs Saudi nationalization.',
    category: 'economic'
  },
  {
    slug: 'qatar-vs-kuwait',
    country1: 'qatar',
    country2: 'kuwait',
    country1Name: 'Qatar',
    country2Name: 'Kuwait',
    title: 'Qatar vs Kuwait: Small Gulf States',
    description: 'Oil wealth, different strategies. Both rely on expatriate workers.',
    category: 'economic'
  }
];

// Helper function to get all unique pairs
export function getAllComparisonSlugs(): string[] {
  return COMPARISON_PAIRS.map(pair => pair.slug);
}

// Helper function to get pair data by slug
export function getComparisonPairBySlug(slug: string): ComparisonPair | undefined {
  return COMPARISON_PAIRS.find(pair => pair.slug === slug);
}

// Helper function to get pairs by category
export function getComparisonsByCategory(category: ComparisonPair['category']): ComparisonPair[] {
  return COMPARISON_PAIRS.filter(pair => pair.category === category);
}

// Helper function to get all vs-china pairs
export function getChinaComparisons(): ComparisonPair[] {
  return COMPARISON_PAIRS.filter(pair => 
    pair.category === 'vs-china' || 
    pair.country1 === 'china' || 
    pair.country2 === 'china'
  );
}

// Helper function to get all vs-usa pairs
export function getUSAComparisons(): ComparisonPair[] {
  return COMPARISON_PAIRS.filter(pair => 
    pair.category === 'vs-usa' || 
    pair.country1 === 'united-states' || 
    pair.country2 === 'united-states'
  );
}

// Export total count
export const TOTAL_COMPARISON_PAIRS = COMPARISON_PAIRS.length;