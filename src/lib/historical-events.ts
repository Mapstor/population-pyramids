interface HistoricalEvent {
  title: string;
  period: string;
  description: string;
  demographicImpact: string;
}

interface CountryEvents {
  events: HistoricalEvent[];
  summary: string;
}

// Comprehensive database of major demographic events by country
export const countryHistoricalEvents: Record<string, CountryEvents> = {
  'china': {
    events: [
      {
        title: 'One-Child Policy Implementation',
        period: '1979-2015',
        description: 'China enforced strict family planning policies limiting most families to one child.',
        demographicImpact: 'Prevented an estimated 400 million births, dramatically reduced fertility rates from 2.9 to 1.6, and created severe gender imbalances with 118 boys born for every 100 girls by 2010.'
      },
      {
        title: 'Great Leap Forward Famine',
        period: '1958-1962',
        description: 'Economic policies led to widespread famine and demographic crisis.',
        demographicImpact: 'Caused 15-45 million excess deaths, created birth deficits, and left lasting impacts on cohort sizes visible in today\'s age structure as smaller population groups now in their 60s.'
      },
      {
        title: 'Economic Reform and Rural-Urban Migration',
        period: '1978-present',
        description: 'Market reforms triggered the largest internal migration in human history.',
        demographicImpact: 'Over 280 million rural migrants moved to cities, transforming China from 20% urban in 1980 to 64% urban by 2020, fundamentally altering family structures and birth patterns.'
      }
    ],
    summary: 'China\'s dramatic demographic transformation reflects state-directed population policies, economic upheavals, and massive urbanization that reshaped family formation patterns and population distribution across the world\'s most populous nation.'
  },

  'japan': {
    events: [
      {
        title: 'Post-War Baby Boom',
        period: '1947-1949',
        description: 'Returning soldiers and economic recovery sparked a significant fertility surge.',
        demographicImpact: 'Birth rates peaked at 34.3 per 1,000 in 1947, creating the largest generation in Japanese history. This cohort, now elderly, forms the basis of Japan\'s current aging challenge.'
      },
      {
        title: 'Economic Miracle and Fertility Decline',
        period: '1950s-1970s',
        description: 'Rapid economic growth and urbanization transformed family patterns.',
        demographicImpact: 'Total fertility rates plummeted from 4.5 in 1947 to 2.1 by 1957, as education, women\'s workforce participation, and urban living reduced desired family sizes.'
      },
      {
        title: 'Lost Decades and Ultra-Low Fertility',
        period: '1990s-present',
        description: 'Economic stagnation coincided with marriage and birth postponement.',
        demographicImpact: 'Fertility rates fell to 1.26 by 2005, marriage rates declined by 40%, and population began shrinking in 2008, creating the world\'s most rapidly aging society.'
      }
    ],
    summary: 'Japan\'s demographic evolution from post-war boom to ultra-low fertility exemplifies the demographic transition\'s final stages, with economic prosperity paradoxically leading to population decline and unprecedented aging challenges.'
  },

  'rwanda': {
    events: [
      {
        title: '1994 Genocide',
        period: 'April-July 1994',
        description: 'Systematic extermination campaign killed approximately 800,000 people in 100 days.',
        demographicImpact: 'Eliminated 10-15% of the population, created 2 million refugees, left 95,000 children orphaned, and resulted in severe gender imbalances with women comprising 70% of survivors.'
      },
      {
        title: 'Post-Genocide Reconstruction',
        period: '1994-2010',
        description: 'Massive repatriation and reconciliation efforts rebuilt the population.',
        demographicImpact: 'Return of 2 million refugees, high fertility rates (6+ children per woman) for population replacement, and rapid population growth from 5.2 million in 1991 to 10.7 million by 2012.'
      },
      {
        title: 'Modern Family Planning Initiatives',
        period: '2005-present',
        description: 'Government-led programs promoting smaller families and maternal health.',
        demographicImpact: 'Fertility rates declined from 6.1 in 2005 to 4.1 by 2020, contraceptive use increased from 10% to 53%, and infant mortality fell from 107 to 33 per 1,000 births.'
      }
    ],
    summary: 'Rwanda\'s demographics reflect a tragic disruption followed by remarkable recovery, transitioning from genocide-induced population collapse through rapid natural increase toward planned demographic transition and development.'
  },

  'united-arab-emirates': {
    events: [
      {
        title: 'Oil Discovery and Boom',
        period: '1958-1980s',
        description: 'Massive oil revenues transformed a small desert society into a modern state.',
        demographicImpact: 'Population exploded from 86,000 in 1961 to 1.9 million by 2005, with expatriate workers comprising 85% of residents and Emiratis becoming a minority in their own country.'
      },
      {
        title: 'Economic Diversification and Immigration',
        period: '1990s-present',
        description: 'Dubai and Abu Dhabi emerged as global business and tourism hubs.',
        demographicImpact: 'Population reached 9.9 million by 2020, with 88% foreign-born residents from 190+ nationalities, creating unique demographics where nationals represent only 12% of the population.'
      },
      {
        title: 'Emiratization Policies',
        period: '2000s-present',
        description: 'Government initiatives to increase Emirati participation in the workforce.',
        demographicImpact: 'Despite policies favoring nationals, demographic structure remains dominated by temporary male workers (sex ratio: 228 males per 100 females), creating long-term sustainability challenges.'
      }
    ],
    summary: 'The UAE\'s extraordinary demographic transformation from Bedouin society to international metropolis represents one of history\'s most rapid population changes, driven entirely by oil wealth and massive immigration rather than natural increase.'
  },

  'india': {
    events: [
      {
        title: 'Independence and Partition',
        period: '1947',
        description: 'Independence from Britain triggered massive population displacement.',
        demographicImpact: 'Displaced 14 million people across new borders, created refugee populations, and established separate demographic trajectories for India and Pakistan that persist today.'
      },
      {
        title: 'Green Revolution',
        period: '1960s-1970s',
        description: 'Agricultural modernization dramatically improved food security.',
        demographicImpact: 'Reduced famine mortality, supported population growth from 439 million in 1960 to 683 million by 1981, and enabled demographic transition by improving survival rates and living standards.'
      },
      {
        title: 'Emergency Period Family Planning',
        period: '1975-1977',
        description: 'Forced sterilization campaigns under Indira Gandhi\'s emergency rule.',
        demographicImpact: 'Sterilized 6.2 million men through coercive programs, created lasting public distrust of family planning, and politicized population policies for decades, slowing fertility decline.'
      }
    ],
    summary: 'India\'s demographic journey reflects the complex interplay of political upheaval, agricultural transformation, and controversial population policies that shaped the world\'s most populous democracy\'s transition toward demographic stability.'
  },

  'germany': {
    events: [
      {
        title: 'World War II and Aftermath',
        period: '1939-1950',
        description: 'War losses, displacement, and division fundamentally altered population structure.',
        demographicImpact: 'Lost 5.3 million military and civilian lives, created millions of refugees and displaced persons, and left lasting gender imbalances and birth deficits visible in current elderly populations.'
      },
      {
        title: 'Guest Worker Program',
        period: '1955-1973',
        description: 'Labor shortages led to recruitment of foreign workers, initially from Turkey.',
        demographicImpact: 'Brought 14 million guest workers, of whom 3 million stayed permanently, creating multicultural demographics and higher fertility rates among immigrant communities that partially offset German fertility decline.'
      },
      {
        title: 'German Reunification',
        period: '1990',
        description: 'Reunification exposed dramatic demographic differences between East and West.',
        demographicImpact: 'East German fertility crashed from 1.5 to 0.8 births per woman (1989-1994), triggered massive migration from east to west, and created persistent regional demographic disparities lasting three decades.'
      }
    ],
    summary: 'Germany\'s demographics bear the lasting imprints of war, division, and reunification, with immigration providing demographic vitality to offset persistently low fertility rates in Europe\'s largest economy.'
  },

  'brazil': {
    events: [
      {
        title: 'Rural-Urban Migration',
        period: '1940s-1980s',
        description: 'Massive internal migration from countryside to cities during industrialization.',
        demographicImpact: 'Urban population grew from 31% in 1940 to 68% by 1980, concentrated in São Paulo and Rio de Janeiro, fundamentally altering family structures and reducing fertility rates from 6.2 to 3.8 children per woman.'
      },
      {
        title: 'Telenovela Effect on Fertility',
        period: '1970s-1990s',
        description: 'Television soap operas promoted small family ideals across social classes.',
        demographicImpact: 'Fertility rates declined rapidly from 5.8 in 1970 to 2.5 by 1996, with researchers attributing 7% of fertility decline to TV exposure promoting modern family values and delayed childbearing.'
      },
      {
        title: 'Economic Stabilization and Social Programs',
        period: '1990s-2010s',
        description: 'Currency stabilization and social welfare expansion improved living standards.',
        demographicImpact: 'Bolsa Família program reached 50 million people, infant mortality fell from 50 to 13 per 1,000 births, and fertility reached replacement level (2.1) by 2006, accelerating demographic transition.'
      }
    ],
    summary: 'Brazil\'s demographic transformation from high-fertility rural society to near-replacement fertility urban nation reflects rapid modernization, unique cultural influences, and successful social policies that compressed demographic transition into just four decades.'
  },

  'nigeria': {
    events: [
      {
        title: 'Oil Boom and Urbanization',
        period: '1970s-1980s',
        description: 'Petroleum revenues drove rapid economic growth and urban expansion.',
        demographicImpact: 'Urban population doubled from 16% to 32%, Lagos grew from 1.4 to 5.7 million residents, and improved healthcare reduced infant mortality while maintaining high fertility, accelerating population growth to 3.3% annually.'
      },
      {
        title: 'Structural Adjustment and Economic Crisis',
        period: '1980s-1990s',
        description: 'Oil price collapse and economic reforms created widespread hardship.',
        demographicImpact: 'Economic stress delayed marriage ages, reduced healthcare access causing mortality increases, but fertility remained high at 6+ children per woman, creating a large youth bulge comprising 45% of the population.'
      },
      {
        title: 'Democratic Transition and Development Focus',
        period: '1999-present',
        description: 'Return to civilian rule brought renewed development efforts and international aid.',
        demographicImpact: 'Population grew from 108 million in 1999 to 206 million by 2020, fertility began gradual decline from 6.0 to 5.4, but Nigeria remains projected to become the world\'s 3rd most populous country by 2050.'
      }
    ],
    summary: 'Nigeria\'s demographic trajectory reflects Africa\'s rapid population growth patterns, driven by oil wealth, persistent high fertility, and urbanization pressures that position it as a key player in global demographic change.'
  },

  'south-korea': {
    events: [
      {
        title: 'Korean War and Recovery',
        period: '1950-1960s',
        description: 'War devastation followed by rapid reconstruction and modernization efforts.',
        demographicImpact: 'War killed 2.5 million people, created millions of refugees, but post-war baby boom saw fertility peak at 6.0 children per woman in 1960 before beginning steep decline during industrialization.'
      },
      {
        title: 'Economic Miracle and Family Planning',
        period: '1960s-1990s',
        description: 'Rapid industrialization combined with aggressive population control policies.',
        demographicImpact: 'Fertility plummeted from 6.0 to 1.6 children per woman by 1985, achieved through education, urbanization, and family planning campaigns with slogans like "Two children are enough."'
      },
      {
        title: 'Asian Financial Crisis and Ultra-Low Fertility',
        period: '1997-present',
        description: 'Economic crisis accelerated trends toward delayed marriage and childbearing.',
        demographicImpact: 'Fertility fell to world\'s lowest at 0.84 in 2020, marriage rates plummeted, and rapid aging began with 15.7% elderly population by 2020, creating acute demographic sustainability challenges.'
      }
    ],
    summary: 'South Korea exemplifies compressed demographic transition, moving from high-fertility developing nation to ultra-low fertility advanced economy in just 40 years, creating unprecedented aging challenges that now define national policy priorities.'
  },

  'afghanistan': {
    events: [
      {
        title: 'Soviet Invasion and Civil War',
        period: '1979-2001',
        description: 'Decades of conflict created massive displacement and demographic disruption.',
        demographicImpact: 'Wars killed over 1 million people, displaced 6 million as refugees (mainly to Pakistan and Iran), and maintained high fertility rates (7+ children) as families sought to replace losses and ensure survival.'
      },
      {
        title: 'Taliban Rule and Isolation',
        period: '1996-2001',
        description: 'Strict Islamic governance limited women\'s rights and development.',
        demographicImpact: 'Banned female education and healthcare access, increased maternal mortality to 1,900 per 100,000 births, and maintained traditional high-fertility patterns with minimal family planning access.'
      },
      {
        title: 'International Intervention Period',
        period: '2001-2021',
        description: 'Foreign assistance brought healthcare improvements and education expansion.',
        demographicImpact: 'Maternal mortality fell to 638 per 100,000, infant mortality declined from 165 to 104 per 1,000 births, but fertility remained high at 4.6 children per woman, sustaining rapid population growth to 38.9 million by 2020.'
      }
    ],
    summary: 'Afghanistan\'s demographics reflect persistent conflict impacts, with high fertility rates sustained by traditional values, limited women\'s rights, and survival strategies that maintain rapid population growth despite ongoing instability.'
  }
};

// Fallback for countries not in the database
const defaultEvents: CountryEvents = {
  events: [
    {
      title: 'Demographic Transition Period',
      period: '20th-21st Century',
      description: 'Gradual modernization and socioeconomic development.',
      demographicImpact: 'Typical patterns of declining mortality followed by fertility reduction, urbanization, and population aging as the country developed economically and socially.'
    },
    {
      title: 'Global Integration Era',
      period: '1990s-present',
      description: 'Increased participation in global economy and migration flows.',
      demographicImpact: 'Economic development and international connectivity influenced family formation patterns, education access, and demographic behaviors toward global convergence trends.'
    }
  ],
  summary: 'This country has experienced typical demographic transition patterns associated with economic development, modernization, and global integration over recent decades.'
};

export function getHistoricalEvents(countrySlug: string): CountryEvents {
  return countryHistoricalEvents[countrySlug] || defaultEvents;
}

export function generateHistoricalContext(countryName: string, countrySlug: string): string {
  const events = getHistoricalEvents(countrySlug);
  
  let content = `${countryName}'s current demographic profile has been profoundly shaped by specific historical events and policy decisions. `;
  
  events.events.forEach((event, index) => {
    content += `**${event.title} (${event.period})**: ${event.description} ${event.demographicImpact}`;
    if (index < events.events.length - 1) {
      content += ' ';
    }
  });
  
  content += ` ${events.summary}`;
  
  return content;
}