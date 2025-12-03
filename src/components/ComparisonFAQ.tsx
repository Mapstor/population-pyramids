'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ComparisonFAQProps {
  comparison?: string;
  country1Name: string;
  country2Name: string;
  country1Pop2025: number;
  country2Pop2025: number;
  country1Fertility: number;
  country2Fertility: number;
  country1MedianAge: number;
  country2MedianAge: number;
}

export default function ComparisonFAQ({
  comparison,
  country1Name,
  country2Name,
  country1Pop2025,
  country2Pop2025,
  country1Fertility,
  country2Fertility,
  country1MedianAge,
  country2MedianAge
}: ComparisonFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)} billion`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} million`;
    return num.toLocaleString();
  };

  // Different FAQs for different comparisons
  const getComparisonFAQs = (): FAQItem[] => {
    // USA vs China specific FAQs
    if (comparison === 'usa-vs-china') {
      return [
        {
          question: `Why is China's population so much larger than the United States?`,
          answer: `China's population of ${formatNumber(country2Pop2025)} is about 4 times larger than the USA's ${formatNumber(country1Pop2025)}. This difference stems from historical factors: China has been densely populated for millennia due to fertile river valleys and early agricultural development. The USA, founded in 1776, built its population through immigration and natural growth. Despite China's recent population control policies, its massive historical base means it remains far larger than the USA.`
        },
        {
          question: `How do immigration policies affect USA vs China population growth?`,
          answer: `Immigration is a crucial difference between these nations. The USA admits about 1 million legal immigrants annually, contributing 30-40% of its population growth. This helps offset its below-replacement fertility rate of ${country1Fertility.toFixed(2)}. China has minimal immigration (less than 0.1% foreign-born) and actually experiences net emigration. Without immigration, the USA's population would already be declining like China's, which began shrinking in 2022.`
        },
        {
          question: `Which country faces more severe aging challenges?`,
          answer: `China faces more severe aging challenges despite both countries having aging populations. China's median age of ${country2MedianAge.toFixed(1)} years is higher than the USA's ${country1MedianAge.toFixed(1)} years. More critically, China is aging much faster - its 65+ population will double by 2040, while the USA's will grow more gradually. China also lacks the USA's developed social security system and has a "4-2-1" family structure problem from its one-child policy.`
        },
        {
          question: `How do birth rates compare between the USA and China?`,
          answer: `Both countries have below-replacement fertility, but the USA's rate of ${country1Fertility.toFixed(2)} births per woman is significantly higher than China's ${country2Fertility.toFixed(2)}. The USA benefits from higher fertility among immigrant populations and generally more family-friendly policies. China's ultra-low fertility stems from its former one-child policy (1979-2015), high living costs, and cultural shifts. Even with recent pro-natalist policies, China struggles to boost births.`
        },
        {
          question: `Will the USA ever catch up to China in population?`,
          answer: `No, the USA will never catch up to China's population in absolute numbers. However, the gap is narrowing. Currently, China has ${formatNumber(country2Pop2025 - country1Pop2025)} more people than the USA. By 2100, UN projections show China's population falling to about 770 million while the USA maintains around 394 million, reducing the ratio from 4:1 to less than 2:1. The USA's immigration and higher fertility provide more demographic stability.`
        },
        {
          question: `How does population density compare between the USA and China?`,
          answer: `Despite having 4 times more people, China (${formatNumber(country2Pop2025)}) is only about 50% more densely populated than the USA (${formatNumber(country1Pop2025)}). China has 147 people per km² while the USA has 36 people per km². This is because both countries have similar land areas (9.6 vs 9.8 million km²). However, much of both countries' land is uninhabitable - China has deserts and mountains, while the USA has Alaska and arid regions.`
        },
        {
          question: `What are the economic implications of these demographic differences?`,
          answer: `The USA's demographic stability provides economic advantages. Its younger population (median age ${country1MedianAge.toFixed(1)} vs China's ${country2MedianAge.toFixed(1)}) and continued growth support consumption and innovation. China faces a shrinking workforce, threatening its manufacturing advantage. The USA's higher GDP per capita ($80,000 vs $13,000) combined with demographic resilience suggests sustained economic leadership, though China's total GDP remains competitive due to its larger population base.`
        },
        {
          question: `How do urbanization rates affect population dynamics?`,
          answer: `Both countries are highly urbanized, but at different stages. The USA is 83% urban with stable city populations. China, at 65% urban, still has 500 million rural residents potentially moving to cities. This ongoing urbanization in China depresses fertility (urban fertility is lower) while in the USA, suburban living patterns are more conducive to larger families. China's rapid urbanization contributes to its fertility decline.`
        },
        {
          question: `When did China become more populous than the USA?`,
          answer: `China has always been more populous than the United States throughout modern history. When the USA was founded in 1776 with about 2.5 million people, China already had over 200 million. The question is rather when China's population advantage peaked - it was largest in the 1960s-1970s when China had 6-7 times the USA's population. Today's 4:1 ratio represents a historic low in China's relative population advantage.`
        },
        {
          question: `What role does technology play in managing these populations?`,
          answer: `The USA's smaller population (${formatNumber(country1Pop2025)}) with higher productivity leverages technology for economic output equaling China's despite having far fewer workers. China uses technology for population management - from its social credit system to urban planning for 1.4 billion people. As workforces shrink, both nations are investing heavily in automation and AI, though the USA's higher capital per worker gives it an advantage in technology adoption.`
        }
      ];
    }
    
    // USA vs Russia specific FAQs
    if (comparison === 'usa-vs-russia') {
      return [
        {
          question: `Why is Russia's population declining while the USA's is growing?`,
          answer: `Russia faces a "demographic perfect storm" with fertility at just ${country2Fertility.toFixed(2)} births per woman, high mortality (especially among males), and net emigration. The USA maintains growth through immigration (1 million+ annually) and higher fertility (${country1Fertility.toFixed(2)}). Russia has lost 5 million people since 1991, while the USA has gained 80 million. By 2050, Russia may drop to 120 million while the USA reaches 375 million.`
        },
        {
          question: `How do Cold War demographics compare to today?`,
          answer: `During the Cold War peak (1989), the Soviet Union had 287 million people vs USA's 247 million - a slight Soviet advantage. Today, Russia alone has just ${formatNumber(country2Pop2025)} vs USA's ${formatNumber(country1Pop2025)} - the USA is now 2.4x larger. This dramatic reversal, combined with NATO expansion, fundamentally altered the geopolitical balance. Russia's shrinking population undermines its great power ambitions.`
        },
        {
          question: `Why do Russian men have such low life expectancy compared to Americans?`,
          answer: `Russian male life expectancy (66 years) is 10 years lower than American males (76 years). Causes include: alcoholism (Russia has world's 4th highest alcohol consumption), smoking (60% of Russian men smoke vs 15% Americans), violence, traffic accidents, and inadequate healthcare. The "Russian Cross" of the 1990s saw deaths exceed births by millions. This creates Russia's massive gender imbalance - 10.5 million more women than men.`
        },
        {
          question: `How do military demographics affect defense capabilities?`,
          answer: `The USA has approximately 120 million military-age citizens (18-45) vs Russia's 35 million. Despite Russia's conscription system, the USA has 2x more potential soldiers. Russia's demographic crisis forces reliance on conscripts and Wagner mercenaries, while the USA maintains an all-volunteer force. Russia's shrinking youth cohorts mean fewer recruits each year, affecting long-term military sustainability.`
        },
        {
          question: `What is the "Russian Cross" and could it happen in the USA?`,
          answer: `The "Russian Cross" occurred in 1992 when death rates crossed above birth rates, creating natural population decline. Russia has never recovered - deaths still exceed births by 500,000+ annually. The USA is protected from this scenario by immigration, higher fertility, better healthcare, and lower mortality. Even if USA births dropped below deaths, immigration would prevent population decline.`
        },
        {
          question: `How does brain drain affect both countries?`,
          answer: `Russia has lost 5+ million educated citizens since 1991, with 1 million leaving since 2022 alone. Tech workers, scientists, and young professionals flee to the West. The USA is the top destination, gaining Russian talent. Meanwhile, the USA attracts global talent - 40% of Nobel Prize winners since 2000 were immigrants. This brain drain accelerates Russia's decline while boosting American innovation.`
        },
        {
          question: `What are the economic implications of these population trends?`,
          answer: `Russia's shrinking workforce (losing 700,000 workers annually) constrains economic growth despite vast resources. Labor shortages affect everything from military to manufacturing. The USA's growing workforce through immigration maintains economic dynamism. Russia's GDP per capita ($12,000) is just 15% of America's ($80,000). Demographics suggest this gap will widen as Russia's working-age population collapses 30% by 2050.`
        },
        {
          question: `How do ethnic minorities affect population dynamics?`,
          answer: `The USA's diversity drives growth - minorities account for all population increase, with Hispanics at 19% and growing. Russia's ethnic Russians decline fastest while Muslim minorities (Chechens, Tatars) have higher fertility. By 2050, ethnic Russians may be <70% of population, creating internal tensions. The USA's "melting pot" model integrates immigrants; Russia's ethnic tensions contribute to instability and emigration.`
        },
        {
          question: `Can Russia reverse its demographic decline?`,
          answer: `Reversal is extremely unlikely. Putin's pro-natalist policies (maternal capital, subsidies) have failed to boost fertility above 1.5. Russia would need massive immigration (500,000+ annually) but remains unattractive to immigrants. The Ukraine war worsened the crisis through casualties and emigration. Most projections show continued decline to 120-130 million by 2050. The USA's immigration magnetism ensures continued growth regardless of fertility.`
        },
        {
          question: `What do these demographics mean for future global power?`,
          answer: `Demographics strongly favor the USA's continued dominance. Russia's population (${formatNumber(country2Pop2025)}) will soon fall below Mexico, Ethiopia, and Japan. The USA maintains the developed world's healthiest demographics through immigration. Russia's shrinking, aging population cannot sustain superpower ambitions - it lacks workers, soldiers, and taxpayers. Demographics suggest Russia will struggle to remain a regional power while the USA maintains global leadership capacity.`
        }
      ];
    }
    
    // USA vs India specific FAQs
    if (comparison === 'usa-vs-india') {
      return [
        {
          question: `How does USA's developed economy compare to India's emerging economy demographically?`,
          answer: `The USA (${formatNumber(country1Pop2025)}) represents a mature economy with high per capita income ($80,000) but aging population (median age ${country1MedianAge.toFixed(1)}). India (${formatNumber(country2Pop2025)}) is an emerging economy with low per capita income ($2,700) but a young, growing workforce (median age ${country2MedianAge.toFixed(1)}). India's demographic dividend could fuel rapid economic growth, while the USA must maintain productivity gains to offset workforce aging.`
        },
        {
          question: `Why is India's population 4 times larger than the USA despite similar land areas?`,
          answer: `India's population density (455 people/km²) vastly exceeds the USA's (36 people/km²) due to historical factors. India has been continuously inhabited for millennia with fertile river valleys supporting dense populations. The USA, founded in 1776, built its population through immigration over just 250 years. Additionally, India's historically higher fertility rates and lower emigration have contributed to its massive population base.`
        },
        {
          question: `How do Indian immigrants impact USA population dynamics?`,
          answer: `Indian immigrants significantly impact USA demographics. Indians are the second-largest immigrant group in the USA (2.7 million), contributing to high-skilled workforce, particularly in technology and medicine. Indian-Americans have higher fertility rates than native-born Americans and median household income of $120,000 (double the US average). This brain drain from India benefits USA's economy while India loses educated workers.`
        },
        {
          question: `Which country has better demographic prospects for economic growth?`,
          answer: `India has better demographic prospects for growth over the next 30 years. With ${formatNumber(country2Pop2025)} people and median age ${country2MedianAge.toFixed(1)}, India will add 250 million working-age people by 2050. The USA's mature economy with median age ${country1MedianAge.toFixed(1)} faces workforce shrinkage without immigration. However, India must create 10 million jobs annually and improve education to capitalize, while the USA's higher productivity ($68/hour vs India's $3/hour) maintains its economic advantage.`
        },
        {
          question: `How do education levels compare between USA and India populations?`,
          answer: `The USA has near-universal literacy (99%) and average 13.7 years of schooling. India's literacy is 77% with average 6.5 years of schooling. However, India produces 1.5 million engineers annually (vs USA's 120,000) and has the world's largest English-speaking population after the USA. India's young population (65% under 35) is increasingly educated, while the USA faces a shortage of STEM graduates despite higher overall education levels.`
        },
        {
          question: `What are the urbanization differences between USA and India?`,
          answer: `The USA is 83% urbanized with stable city populations, while India is only 36% urban with rapid urbanization underway. India adds 10 million urban residents annually as rural populations migrate to cities seeking opportunities. USA cities are sprawling with suburban growth, while Indian cities are densely packed (Mumbai: 20,000 people/km²). This urbanization drives India's fertility decline and economic transformation.`
        },
        {
          question: `How do healthcare and life expectancy compare?`,
          answer: `Life expectancy in the USA (79.1 years) exceeds India's (72.0 years) by 7 years. The USA spends $12,000 per capita on healthcare vs India's $63. However, India's life expectancy has improved by 20 years since 1970, while USA's has stagnated recently. India faces a double burden of infectious and lifestyle diseases, while the USA grapples with obesity (36% vs India's 3%) and opioid crisis.`
        },
        {
          question: `Will India's population overtake USA's GDP despite being 4 times larger?`,
          answer: `India's GDP ($3.9 trillion) is only 15% of USA's ($26 trillion) despite having 4.2x more people. At current growth rates (India 6-7%, USA 2-3%), India's economy could match the USA's by 2075. However, India needs sustained 8%+ growth and massive productivity improvements. The USA's per capita income advantage ($80,000 vs $2,700) means Americans remain 30 times wealthier individually.`
        },
        {
          question: `How do gender ratios and women's workforce participation compare?`,
          answer: `Both countries have slightly more males than females at birth, but the USA has better gender balance overall. Women's workforce participation differs dramatically: USA at 57% vs India at 23%. Cultural factors, safety concerns, and lack of opportunities limit Indian women's employment. This represents huge untapped potential - if India matched USA's female participation rate, it would add 200 million workers to its economy.`
        },
        {
          question: `What are the climate change implications of these populations?`,
          answer: `The USA with ${formatNumber(country1Pop2025)} people emits 14.9 tons CO₂ per capita annually, while India with ${formatNumber(country2Pop2025)} people emits only 1.9 tons per capita. Despite India's larger population, USA's total emissions are nearly double India's. As India develops and its population grows, its emissions could surge. However, India is investing heavily in renewable energy while the USA has higher historical emissions responsibility.`
        }
      ];
    }
    
    // USA vs Brazil specific FAQs
    if (comparison === 'usa-vs-brazil') {
      return [
        {
          question: `How do the two largest economies in the Americas compare demographically?`,
          answer: `The USA (${formatNumber(country1Pop2025)}) and Brazil (${formatNumber(country2Pop2025)}) showcase contrasting demographic patterns. Brazil's younger population (median age ${country2MedianAge.toFixed(1)}) offers a significant demographic dividend with more working-age people entering the labor force. The USA's older median age (${country1MedianAge.toFixed(1)}) reflects economic maturity but also indicates slower natural population growth, compensated by immigration.`
        },
        {
          question: `Why does Brazil have a younger population than the USA?`,
          answer: `Brazil's fertility rate (${country2Fertility.toFixed(2)} births per woman) has declined rapidly but remains higher than the USA's (${country1Fertility.toFixed(2)}). Additionally, Brazil experienced later demographic transition - high fertility persisted longer, creating a younger age structure. The USA began its fertility decline earlier (1960s-70s) and has maintained lower fertility for decades, resulting in an older population despite immigration.`
        },
        {
          question: `How do urbanization patterns compare between USA and Brazil?`,
          answer: `Both are highly urbanized: USA at 83% urban and Brazil at 88% urban. However, their urbanization histories differ dramatically. The USA urbanized gradually over 200+ years, building infrastructure systematically. Brazil underwent rapid urbanization in just 50 years, creating megacities like São Paulo (22M) and Rio (13M). This rapid shift created infrastructure challenges but also economic opportunities through urban density.`
        },
        {
          question: `What economic implications do these demographic differences have?`,
          answer: `Brazil's younger workforce (median age ${country2MedianAge.toFixed(1)}) provides massive economic potential if properly educated and employed. The USA's demographic stability through immigration maintains innovation capacity and consumer demand. Brazil faces the challenge of creating jobs for its young population, while the USA must manage an aging workforce. GDP per capita differences ($80k USA vs $11k Brazil) largely reflect this demographic and development gap.`
        },
        {
          question: `How do these populations impact regional and global influence?`,
          answer: `The USA's larger population (${formatNumber(country1Pop2025)} vs ${formatNumber(country2Pop2025)}) and economic development maintain its global superpower status. Brazil's demographic dividend positions it as a rising regional power in Latin America. Brazil's young workforce could drive economic growth that challenges USA dominance in the Americas within 30-50 years, especially if Brazil addresses education and infrastructure gaps.`
        }
      ];
    }
    
    // USA vs Indonesia specific FAQs
    if (comparison === 'usa-vs-indonesia') {
      return [
        {
          question: `How do these Pacific Rim powerhouses compare demographically?`,
          answer: `The USA (${formatNumber(country1Pop2025)}) and Indonesia (${formatNumber(country2Pop2025)}) represent different stages of development. Indonesia's much younger population (median age ${country2MedianAge.toFixed(1)}) offers a massive demographic dividend, with 24% of the population under 15. The USA's older population (median age ${country1MedianAge.toFixed(1)}) reflects economic maturity but faces workforce challenges without immigration.`
        },
        {
          question: `Why is Indonesia's population so much younger than America's?`,
          answer: `Indonesia is experiencing a later demographic transition. While the USA began fertility decline in the 1960s-70s, Indonesia's fertility (${country2Fertility.toFixed(2)} births per woman) has only recently approached replacement levels. This creates a pyramid-shaped age structure with many young people entering the workforce. Additionally, Indonesia's development timeline is decades behind the USA's, maintaining higher birth rates longer.`
        },
        {
          question: `How do archipelago geography and island distribution affect Indonesia's demographics?`,
          answer: `Indonesia's 17,500+ islands create unique demographic challenges. Java island alone holds 56% of Indonesia's population (150+ million people) in just 7% of the landmass - making it one of the world's most densely populated areas. Remote islands have different fertility patterns, urbanization rates, and age structures. This geographic fragmentation complicates infrastructure development and economic integration compared to the USA's continental geography.`
        },
        {
          question: `What economic implications do these demographic differences have?`,
          answer: `Indonesia's young workforce represents enormous economic potential - if properly educated and employed, it could drive decades of economic growth. The USA's demographic stability through immigration maintains innovation and consumer demand. Indonesia faces the challenge of creating 3+ million jobs annually for new workers, while the USA struggles with labor shortages in some sectors. GDP per capita differences ($80k USA vs $5k Indonesia) largely reflect this developmental gap.`
        },
        {
          question: `How will these demographics shape future US-Indonesia relations?`,
          answer: `Indonesia's growing economic importance (already G20 member) combined with its strategic Pacific location makes it crucial for US interests. By 2050, Indonesia could have the world's 4th largest economy. The USA needs Indonesia as a democratic partner to balance China's influence in Southeast Asia. Indonesia's young, educated population increasingly speaks English and engages with American technology and culture, strengthening long-term ties.`
        }
      ];
    }
    
    // India vs Indonesia specific FAQs
    if (comparison === 'india-vs-indonesia') {
      return [
        {
          question: `How do the world's largest and fourth largest countries compare demographically?`,
          answer: `India (${formatNumber(country1Pop2025)}) and Indonesia (${formatNumber(country2Pop2025)}) are both demographic powerhouses with youthful populations. India's massive scale - 5 times larger than Indonesia - creates unique challenges. Both have similar median ages (India ${country1MedianAge.toFixed(1)}, Indonesia ${country2MedianAge.toFixed(1)}) and are experiencing the demographic dividend with large working-age populations entering their economies annually.`
        },
        {
          question: `Why are both countries' populations growing while China's is declining?`,
          answer: `Both India (${country1Fertility.toFixed(2)} births per woman) and Indonesia (${country2Fertility.toFixed(2)} births per woman) maintain fertility rates closer to replacement level compared to China's drastically low 1.0. Additionally, both countries have younger age structures that haven't yet transitioned to the aging phase that China is experiencing. India and Indonesia are roughly 10-15 years behind China in their demographic transitions.`
        },
        {
          question: `How do geography and urbanization patterns differ between these nations?`,
          answer: `India's continental landmass allows for more integrated development, with 36% urbanization across diverse states. Indonesia's 17,500+ islands create unique challenges - Java alone holds 56% of the population despite being just 7% of land area. Indonesia is more urbanized (57%) but faces infrastructure challenges connecting remote islands. Both countries struggle with megacity growth: Delhi, Mumbai vs Jakarta, Surabaya.`
        },
        {
          question: `What are the economic implications of these demographic patterns?`,
          answer: `Both countries benefit from demographic dividends but face job creation pressure. India must create 10+ million jobs annually for new workers; Indonesia needs 3+ million. Indonesia has higher GDP per capita ($5,000 vs India's $2,700) but India's scale offers larger absolute market potential. Both are transitioning from agriculture to manufacturing and services, competing for similar foreign investment and export markets.`
        },
        {
          question: `How do these populations impact regional and global influence?`,
          answer: `Together, India and Indonesia represent 22% of global population and rising economic influence. India's path to becoming the world's 3rd largest economy by 2030 complements Indonesia's goal of 4th largest by 2050. Both are key to Indo-Pacific strategy, ASEAN dynamics, and South-South cooperation. Their demographic success or failure will significantly impact global migration patterns, climate goals, and economic stability.`
        }
      ];
    }
    
    // India vs Brazil specific FAQs
    if (comparison === 'india-vs-brazil') {
      return [
        {
          question: `How do these BRICS founding members compare demographically?`,
          answer: `India (${formatNumber(country1Pop2025)}) and Brazil (${formatNumber(country2Pop2025)}) showcase different scales of the Global South demographic advantage. India's massive population (6.8x Brazil's size) offers enormous market potential, while Brazil's smaller but still substantial population provides more manageable development challenges. Both have similar median ages (India ${country1MedianAge.toFixed(1)}, Brazil ${country2MedianAge.toFixed(1)}) and young, growing workforces driving economic expansion.`
        },
        {
          question: `Why do both countries have younger populations than developed nations?`,
          answer: `Both India and Brazil are experiencing demographic transitions later than Western countries. India's fertility (${country1Fertility.toFixed(2)} births per woman) and Brazil's (${country2Fertility.toFixed(2)} births per woman) have declined from much higher levels in recent decades, creating large youth cohorts. Unlike Europe or East Asia, both countries maintained higher fertility rates into the 2000s, resulting in age structures heavily weighted toward working-age populations.`
        },
        {
          question: `How do their urbanization patterns and development strategies differ?`,
          answer: `Brazil is more urbanized (88%) than India (36%), reflecting different development timelines. Brazil underwent rapid urbanization in the 20th century, creating megacities like São Paulo and Rio. India is currently experiencing this transition, with massive internal migration to cities like Mumbai and Delhi. Brazil's challenge is managing established urban infrastructure; India's is creating new urban capacity for 400+ million future urban migrants.`
        },
        {
          question: `What are the economic implications of their demographic differences?`,
          answer: `Brazil's higher GDP per capita ($11,000 vs India's $2,700) reflects earlier economic development but India's scale offers larger absolute market potential. India must create 10+ million jobs annually vs Brazil's 2+ million. Brazil benefits from commodity exports and established manufacturing; India leverages services and digital technology. Both face the challenge of transitioning from labor-intensive to knowledge-intensive economies.`
        },
        {
          question: `How do these demographics impact BRICS and global South leadership?`,
          answer: `Together, India and Brazil represent over 20% of global population and rising economic influence in BRICS. India's massive scale makes it a counterweight to China within BRICS, while Brazil's regional influence in Latin America complements India's South Asian leadership. Their demographic dividends position them as advocates for developing world interests in global governance, climate negotiations, and South-South cooperation initiatives.`
        }
      ];
    }
    
    // China vs Brazil specific FAQs
    if (comparison === 'china-vs-brazil') {
      return [
        {
          question: `How do these BRICS partners compare in demographic development?`,
          answer: `China (${formatNumber(country1Pop2025)}) and Brazil (${formatNumber(country2Pop2025)}) represent two distinct demographic phases within BRICS. China's massive population (6.6x Brazil's size) is rapidly aging with a median age of ${country1MedianAge.toFixed(1)} years, while Brazil maintains a younger profile at ${country2MedianAge.toFixed(1)} years. China faces demographic decline due to ultra-low fertility (${country1Fertility.toFixed(2)} births per woman) versus Brazil's ${country2Fertility.toFixed(2)}, creating vastly different economic implications for these emerging market giants.`
        },
        {
          question: `Why is China's population declining while Brazil's continues growing?`,
          answer: `China began population decline in 2022 due to decades of fertility control through the one-child policy (1979-2015), creating ultra-low fertility of ${country1Fertility.toFixed(2)} births per woman. Brazil's fertility (${country2Fertility.toFixed(2)}) remains above China's level, plus Brazil has a younger age structure with more people in reproductive years. China's aging population accelerates decline, while Brazil's demographic momentum from past higher fertility continues driving modest growth through the 2040s.`
        },
        {
          question: `How do their economic development models differ demographically?`,
          answer: `China leveraged its massive population for export-oriented manufacturing, becoming the "world's factory" through abundant, low-cost labor. Brazil focused on commodity exports and regional markets with its smaller but resource-rich geography. Now China faces workforce contraction and aging costs, while Brazil enters its demographic dividend window. Brazil's challenge is creating sufficient high-quality jobs; China's is maintaining productivity with a shrinking, aging workforce while transitioning to service and technology sectors.`
        },
        {
          question: `What are the implications for BRICS cooperation and leadership?`,
          answer: `China's demographic decline may reduce its relative influence within BRICS over time, while Brazil's younger population and continued growth enhance its position. China currently dominates BRICS economically due to scale, but Brazil's demographic advantages, natural resources, and regional leadership position it as an increasingly important partner. These different demographic trajectories will reshape power dynamics within BRICS as China focuses inward on aging challenges while Brazil expands global engagement.`
        },
        {
          question: `How do urbanization patterns affect their populations differently?`,
          answer: `China is 65% urban after massive rural-to-urban migration, while Brazil is 88% urban, reflecting earlier development. China still has 500 million rural residents potentially urbanizing, but migration is slowing as fertility declines and cities reach capacity. Brazil's high urbanization means future growth occurs mainly in existing cities. Brazil faces urban inequality challenges in established megacities; China faces the unique challenge of building urban infrastructure while population peaks and ages.`
        },
        {
          question: `Which country handles population aging better?`,
          answer: `Brazil has demographic time to prepare for aging, with only 9.6% over 65 compared to China's 13.8%. Brazil can develop social security systems, healthcare infrastructure, and pension policies while still having a growing workforce. China faces rapid aging with inadequate preparation - its 65+ population will double by 2040, straining healthcare and pensions. Brazil's advantage is time; China's challenge is scale and speed of aging combined with the "4-2-1" family structure from its former one-child policy.`
        }
      ];
    }
    
    // USA vs Mexico specific FAQs
    if (comparison === 'usa-vs-mexico') {
      return [
        {
          question: `How do migration patterns affect USA vs Mexico population dynamics?`,
          answer: `Migration is fundamental to understanding USA-Mexico demographics. Since 1965, over 16 million Mexicans have migrated to the USA, representing 28% of all US immigrants. This flow has kept Mexico's population growth lower than it would be otherwise (${formatNumber(country2Pop2025)} vs. potentially 150+ million) while contributing 12% of USA's population growth. Mexican-Americans now number 37+ million in the USA. Return migration during economic downturns also affects both countries' demographic patterns.`
        },
        {
          question: `Why is Mexico's population younger than the USA's?`,
          answer: `Mexico's younger population (median age ${country2MedianAge.toFixed(1)} vs USA's ${country1MedianAge.toFixed(1)}) reflects its position in demographic transition. Mexico's fertility declined from 7.3 (1960) to ${country2Fertility.toFixed(2)} births per woman more recently than the USA's decline. Mexico also has lower life expectancy (76 years vs USA's 79), keeping the age structure younger. The USA's immigration-sustained population and better healthcare create an older median age despite continued population growth.`
        },
        {
          question: `How does USMCA/NAFTA trade integration affect demographics?`,
          answer: `Trade integration since NAFTA (1994) has created demographic interdependence. USA manufacturing moved to Mexico, creating jobs that reduced emigration pressure from Mexico's central states. Mexico's manufacturing growth employed young workers, affecting internal migration patterns. The USA's ${formatNumber(country1Pop2025)} consumers drive demand for goods produced by Mexico's younger workforce (${formatNumber(country2Pop2025)}), while aging USA demographics increase demand for Mexican workers in agriculture and services.`
        },
        {
          question: `Which country faces more demographic challenges ahead?`,
          answer: `Both face different challenges. The USA (median age ${country1MedianAge.toFixed(1)}) must manage aging costs, Social Security sustainability, and workforce replacement, though immigration provides demographic resilience. Mexico (median age ${country2MedianAge.toFixed(1)}) must create jobs for its youth bulge, improve education quality, and manage urbanization pressures. Mexico's challenge is harnessing its demographic dividend; USA's challenge is managing demographic maturity while maintaining economic dynamism.`
        },
        {
          question: `How do border city demographics differ from national patterns?`,
          answer: `Border cities show unique demographic patterns due to cross-border integration. Cities like San Diego-Tijuana (5+ million) and El Paso-Ciudad Juárez (2+ million) have younger populations than USA averages but older than Mexican averages. These metro areas experience circular migration, binational families, and economic integration that create distinct demographic profiles. Manufacturing growth attracts young Mexican workers while USA retirees move to Mexico, creating demographic exchange.`
        },
        {
          question: `What role does remittances play in Mexico's demographic patterns?`,
          answer: `Remittances ($60+ billion annually) significantly impact Mexican demographics. Money from Mexican-Americans supports families, reducing poverty and affecting fertility decisions in sending communities. Remittances enable education investments, potentially reducing family sizes. They also reduce emigration pressure by improving local living standards. This creates feedback loops where migration affects both countries' population distributions and economic development patterns.`
        }
      ];
    }
    
    // USA vs UK specific FAQs
    if (comparison === 'usa-vs-uk') {
      return [
        {
          question: `How do immigration policies affect USA vs UK population growth?`,
          answer: `Immigration is crucial to both nations' demographic futures, but with different approaches. The USA admits 1+ million legal immigrants annually (plus family reunification), contributing about 30% of its population growth and helping maintain a younger age structure. The UK's post-Brexit immigration system emphasizes skilled workers and reduced EU migration, leading to more controlled population growth. The USA's ${formatNumber(country1Pop2025)} vs UK's ${formatNumber(country2Pop2025)} partly reflects these different immigration policies over decades.`
        },
        {
          question: `Why do both countries have similar median ages despite different growth rates?`,
          answer: `Both the USA (median age ${country1MedianAge.toFixed(1)}) and UK (median age ${country2MedianAge.toFixed(1)}) are mature developed economies with similar demographic transitions timing. Both experienced baby booms post-WWII, followed by fertility declines. The USA's continued immigration keeps it slightly younger, while the UK's lower fertility (${country2Fertility.toFixed(2)} vs USA's ${country1Fertility.toFixed(2)}) and more limited immigration create similar aging patterns despite different scales.`
        },
        {
          question: `How has Brexit affected UK demographics compared to the USA?`,
          answer: `Brexit significantly impacted UK demographics by reducing EU migration, which had been a major population driver. Pre-Brexit, net migration was 200,000+ annually; post-Brexit systems reduced this to around 100,000. This contrasts with the USA's sustained immigration levels. Brexit also triggered some reverse migration of EU citizens and British emigration to Europe, creating demographic adjustments the USA doesn't face due to its geographic isolation and dominant position.`
        },
        {
          question: `Which country faces greater challenges from population aging?`,
          answer: `Both face significant aging challenges, but with different implications. The UK's higher elderly percentage (19.0% vs USA's 18.2% over 65) and lower fertility create more immediate pressures on the NHS and pension systems. However, the USA's larger scale means more absolute numbers requiring care. The UK's smaller geography allows more efficient healthcare delivery, while the USA's immigration advantage provides more working-age population support. Both need sustained immigration to maintain economic growth.`
        },
        {
          question: `How do economic opportunities compare given their demographic differences?`,
          answer: `The USA's larger market (${formatNumber(country1Pop2025)} vs ${formatNumber(country2Pop2025)}) provides more absolute opportunities, while similar age structures mean both have educated, experienced workforces. The UK's proximity to Europe and financial sector expertise create different opportunities than the USA's tech and scale advantages. Both face labor shortages in certain sectors due to aging populations, but the USA's immigration policies provide more workforce replacement potential.`
        },
        {
          question: `What role does the "Special Relationship" play in demographic patterns?`,
          answer: `The UK-USA Special Relationship facilitates migration between the countries, though numbers are modest compared to other flows. Professional migration (finance, tech, academia) creates brain circulation. Cultural similarities enable easier integration. Military cooperation involves personnel exchanges. However, visa restrictions limit mass migration. The relationship is more about aligned policies (defense, trade) than demographic exchange, though shared language and legal systems facilitate the movement of skilled professionals.`
        }
      ];
    }
    
    // UK vs Germany specific FAQs
    if (comparison === 'uk-vs-germany') {
      return [
        {
          question: `How has Brexit affected UK demographics compared to Germany's EU integration?`,
          answer: `Brexit significantly impacted UK demographics by ending freedom of movement with EU countries, reducing EU migration that had added 100,000+ people annually. Post-Brexit, UK net migration shifted toward non-EU countries. Germany continues benefiting from EU labor mobility, receiving workers from Eastern Europe to offset its aging population. The UK's ${formatNumber(country1Pop2025)} vs Germany's ${formatNumber(country2Pop2025)} partly reflects these different integration strategies, with Germany leveraging EU-wide demographic resources while the UK pursues selective migration policies.`
        },
        {
          question: `Which country faces more severe population aging challenges?`,
          answer: `Germany faces more severe aging challenges despite both being among Europe's oldest populations. Germany's median age of ${country2MedianAge.toFixed(1)} years vs UK's ${country1MedianAge.toFixed(1)} years reflects deeper demographic decline. Germany has 22.8% elderly vs UK's 19.0%, and fertility of ${country2Fertility.toFixed(2)} vs UK's ${country1Fertility.toFixed(2)}. Germany's workforce shrinks by 400,000+ annually, while the UK's declines more slowly. Germany also faces the "demographic cliff" as baby boomers retire en masse, straining pensions and healthcare more acutely than the UK.`
        },
        {
          question: `How do their roles as European economic powerhouses compare demographically?`,
          answer: `Germany remains Europe's largest economy with ${formatNumber(country2Pop2025)} people providing substantial market size, but its aging population threatens long-term competitiveness. The UK's ${formatNumber(country1Pop2025)} people represent a smaller but younger market with better demographic sustainability. Germany's industrial strength depends increasingly on automation and skilled immigration, while the UK's service-oriented economy adapts better to smaller workforce growth. Post-Brexit, both compete for global talent, but Germany's EU integration provides broader labor access.`
        },
        {
          question: `What are the implications of their different fertility rates and family policies?`,
          answer: `Both countries have sub-replacement fertility (Germany ${country2Fertility.toFixed(2)}, UK ${country1Fertility.toFixed(2)}), but Germany's is critically low. Germany spent €12+ billion annually on family support programs (parental leave, child benefits) with limited success in raising births. The UK's approach emphasizes childcare support and tax benefits. Germany's aging infrastructure and housing costs in major cities discourage family formation more than the UK's. Cultural attitudes also differ: German focus on work-life balance vs UK's more flexible family structures.`
        },
        {
          question: `How do migration patterns differ between the two countries?`,
          answer: `Germany actively recruits skilled workers globally due to severe labor shortages, accepting 400,000+ migrants annually. The UK's post-Brexit system is more selective, prioritizing skills-based immigration while reducing overall numbers to around 250,000 annually. Germany benefits from EU freedom of movement for filling labor gaps, while the UK lost this advantage. Both attract international students, but Germany's free university education gives it an edge. Long-term, Germany needs sustained immigration to maintain population; the UK needs moderate immigration to sustain growth.`
        },
        {
          question: `Which country is better positioned for future economic competitiveness given demographic trends?`,
          answer: `The UK appears better positioned despite Germany's current economic dominance. Germany's rapid aging (median age ${country2MedianAge.toFixed(1)}) creates immediate workforce and fiscal pressures that could undermine its export-driven model. The UK's younger profile (median age ${country1MedianAge.toFixed(1)}) and immigration flexibility provide more adaptation time. However, Germany's stronger industrial base and EU integration offer advantages. Both need increased productivity and immigration, but the UK's demographic trends are more sustainable for long-term competitiveness, assuming effective post-Brexit economic policies.`
        }
      ];
    }
    
    // UK vs France specific FAQs
    if (comparison === 'uk-vs-france') {
      return [
        {
          question: `How has Brexit affected UK demographics compared to France's EU integration?`,
          answer: `Brexit ended freedom of movement between the UK and EU, reducing European migration to the UK by over 60% since 2016. The UK's ${formatNumber(country1Pop2025)} population now grows primarily through non-EU immigration and natural increase. France's ${formatNumber(country2Pop2025)} benefits from continued EU labor mobility, receiving workers from across Europe. Post-Brexit, UK immigration shifted toward Asia and Africa, while France maintains traditional European migration patterns plus its former African colonies.`
        },
        {
          question: `Why does France have higher fertility rates than the UK?`,
          answer: `France's fertility rate of ${country2Fertility.toFixed(2)} births per woman significantly exceeds the UK's ${country1Fertility.toFixed(2)}, making France Europe's demographic success story. France's generous family policies include substantial child allowances, heavily subsidized childcare, and excellent parental leave. The UK's more market-driven approach provides less support. Cultural factors also matter - French society better normalizes work-life balance for parents, while British families face higher housing costs and childcare expenses.`
        },
        {
          question: `Which country faces more severe aging challenges across the Channel?`,
          answer: `Both face similar aging pressures, but France is slightly better positioned. France's median age of ${country2MedianAge.toFixed(1)} years vs the UK's ${country1MedianAge.toFixed(1)} years reflects its superior fertility policies maintaining a younger population structure. However, both countries have robust pension systems and healthcare. France's advantage lies in its successful family policies that sustained higher birth rates, giving it more demographic breathing room than most European neighbors.`
        },
        {
          question: `How do immigration patterns differ between the UK and France?`,
          answer: `Pre-Brexit, both countries received similar immigration levels, but sources differed. The UK attracted EU workers (especially Eastern Europeans) plus Commonwealth migrants. France received EU migrants plus substantial African immigration. Post-Brexit, UK immigration shifted dramatically toward Asia (especially India) and Africa, while maintaining Commonwealth ties. France continues receiving EU migrants plus maintaining strong African connections, particularly from former French colonies.`
        },
        {
          question: `What is the historic population relationship between Britain and France?`,
          answer: `France was historically more populous than Britain until the Industrial Revolution. In 1800, France had 27 million vs Britain's 9 million. By 1900, rapid British industrialization and Irish inclusion narrowed the gap. Today's populations (UK ${formatNumber(country1Pop2025)}, France ${formatNumber(country2Pop2025)}) reflect divergent 20th-century experiences - Britain's empire-driven growth vs France's war losses and later baby boom. Both are now developed European nations with similar demographic challenges.`
        },
        {
          question: `How do economic policies support families differently in the UK vs France?`,
          answer: `France operates a much more generous family support system. French families receive substantial monthly allowances (€131+ per child), heavily subsidized daycare (€7-15/day), and excellent parental leave. The UK provides child benefit (£24/week first child) and some free childcare, but costs remain high. French tax policy favors families with quotient familial system, while the UK relies more on means-tested benefits. This explains France's higher fertility (${country2Fertility.toFixed(2)} vs ${country1Fertility.toFixed(2)}).`
        },
        {
          question: `Which country's population will be larger by 2050?`,
          answer: `The UK's ${formatNumber(country1Pop2025)} population will remain larger than France's ${formatNumber(country2Pop2025)} through 2050 and beyond. UN projections show the UK reaching about 70 million by 2050 while France reaches 68-69 million. Britain's immigration flexibility and slightly younger age structure provide modest growth advantages. However, the gap may narrow as France's superior fertility policies could eventually boost its long-term demographic trajectory compared to the UK's immigration-dependent model.`
        },
        {
          question: `How did the 2020 pandemic affect population trends in the UK vs France?`,
          answer: `COVID-19 impacted both countries' demographics, but differently. The UK saw its lowest population growth since WWI (0.1% in 2021) due to high excess deaths, reduced immigration, and falling births. France experienced similar fertility declines but maintained steadier migration patterns due to EU mobility. Both countries saw delayed marriages and births. France's stronger family support systems helped maintain somewhat better birth recovery, while the UK faces ongoing Brexit-related migration uncertainty affecting population trends.`
        },
        {
          question: `What role do overseas territories play in UK vs France population counts?`,
          answer: `France's overseas departments (Réunion, Guadeloupe, Martinique, French Guiana, Mayotte) add 2.8 million to its metropolitan population, while UK overseas territories contribute minimally. These French territories have higher fertility rates, contributing to France's demographic vitality. The UK's overseas territories (Gibraltar, Falklands, etc.) total under 300,000 people. This means France's true "extended" population is about 70.8 million vs the UK's 67.3 million, nearly eliminating Britain's metropolitan advantage.`
        },
        {
          question: `How do urban vs rural population patterns compare between the UK and France?`,
          answer: `Both countries are highly urbanized (UK 84%, France 81%), but with different patterns. The UK has extreme London dominance - Greater London holds 13% of the national population, while Paris metro holds 18% of France's. However, France maintains stronger medium-sized cities and rural vitality due to better regional policies. UK rural areas face depopulation, while French countryside benefits from government support and EU agricultural policies, maintaining more balanced national development patterns.`
        }
      ];
    }
    
    // Japan vs Germany specific FAQs
    if (comparison === 'japan-vs-germany') {
      return [
        {
          question: `Why are Japan and Germany the world's most rapidly aging societies?`,
          answer: `Japan and Germany lead global aging due to ultra-low fertility rates and excellent healthcare extending lifespans. Japan's fertility at ${country1Fertility.toFixed(2)} births per woman and Germany's at ${country2Fertility.toFixed(2)} are far below replacement level (2.1). Both countries experienced post-war baby booms followed by dramatic fertility declines. Japan's median age of ${country1MedianAge.toFixed(1)} years makes it the world's oldest society, while Germany's ${country2MedianAge.toFixed(1)} years leads Europe. Their advanced economies, excellent healthcare, and low birth rates create the perfect storm for rapid aging.`
        },
        {
          question: `Which country is aging faster - Japan or Germany?`,
          answer: `Japan is aging faster and is further advanced in demographic transition. Japan's ${formatNumber(country1Pop2025)} population has 30% over 65 years old, the highest globally, while Germany's ${formatNumber(country2Pop2025)} has about 23%. Japan began aging earlier (1970s vs 1980s) and more intensely. However, Germany's aging is accelerating rapidly - it will have the EU's oldest population by 2030. Both face workforce shrinkage, but Japan's demographic challenges are about 10-15 years ahead of Germany's trajectory.`
        },
        {
          question: `How do immigration policies affect aging in Japan vs Germany?`,
          answer: `Germany uses immigration more effectively to combat aging. Germany accepts 500,000+ immigrants annually and has EU labor mobility, helping offset demographic decline. Japan remains highly restrictive, accepting fewer than 50,000 permanent residents yearly despite severe labor shortages. Germany's foreign-born population is 15% vs Japan's 2%. However, even Germany's immigration cannot fully offset its aging trajectory. Japan's cultural homogeneity preferences limit demographic solutions through immigration, accelerating its aging crisis.`
        },
        {
          question: `Which country's economy is better positioned for demographic decline?`,
          answer: `Germany appears better positioned despite both facing similar challenges. Germany's larger economy, EU integration, and higher immigration provide more adaptation tools. Japan leads in automation and robotics (50% of world's industrial robots) but faces more severe workforce shortages. Germany benefits from EU-wide talent pools while Japan relies on domestic innovation. However, both countries are pioneering "silver economies" and age-tech industries that could offset demographic headwinds through productivity gains.`
        },
        {
          question: `How do pension and healthcare systems compare between Japan and Germany?`,
          answer: `Both operate robust but financially strained systems. Germany's pay-as-you-go pension system covers 48% of average income, supplemented by occupational pensions. Japan's system provides lower replacement rates (30%) but includes universal healthcare. Germany's healthcare consumes 11% of GDP vs Japan's 11%, both rising with aging. Japan's longer lifespans (84 years vs 81) create longer pension obligations. Both systems face insolvency without reforms - Germany by 2030, Japan slightly later due to higher savings rates.`
        },
        {
          question: `What role does technology play in managing aging populations?`,
          answer: `Japan leads global innovation in aging-tech solutions. Japan pioneered care robots, aging-in-place technology, and automated healthcare systems. German engineering excels in accessibility technology and smart home solutions for elderly. Japan's Society 5.0 initiative integrates AI/IoT for elderly care, while Germany's Industry 4.0 focuses on maintaining productivity with fewer workers. Both countries export aging-tech solutions globally, turning demographic challenges into economic opportunities through innovation.`
        },
        {
          question: `How do cultural attitudes toward aging differ between Japan and Germany?`,
          answer: `Japan traditionally reveres elderly through Confucian respect, but modern reality challenges this with family care burdens. Germany emphasizes independence and state support systems for elderly. Japan faces "kodokushi" (lonely death) problems as families fragment, while Germany develops community-based care models. Both cultures value work ethic but Japan's dedication to lifelong employment conflicts with demographic reality. German flexibility with immigration and EU integration provides more adaptive capacity than Japan's cultural insularity.`
        },
        {
          question: `Which country will have a smaller population by 2100?`,
          answer: `Japan's population will decline more dramatically. UN projections show Japan falling from ${formatNumber(country1Pop2025)} (2025) to about 75 million by 2100 - a 40% decline. Germany will drop from ${formatNumber(country2Pop2025)} to roughly 65 million - a 23% decline. Japan's steeper decline reflects earlier onset of demographic transition and lower immigration. However, both face unprecedented peacetime population contraction, fundamentally altering their global influence and economic structures.`
        },
        {
          question: `How do birth incentive policies compare between Japan and Germany?`,
          answer: `Germany's family policies are more generous and effective. Germany provides substantial child benefits (€219-250/month per child), excellent parental leave, and heavily subsidized childcare. Japan offers limited support - ¥15,000/month per child and inadequate daycare. Germany's fertility has stabilized around ${country2Fertility.toFixed(2)} while Japan's continues declining to ${country1Fertility.toFixed(2)}. German policies successfully reversed fertility decline since 2006, while Japan's efforts have shown minimal impact on birth rates.`
        },
        {
          question: `What lessons do Japan and Germany offer other aging societies?`,
          answer: `Both countries serve as demographic laboratories for the developed world. Japan demonstrates that technological innovation can partially offset workforce decline but cannot solve fundamental aging challenges without immigration. Germany shows that immigration and family-friendly policies can slow but not prevent demographic transition. Key lessons: early intervention with family support is crucial, immigration is essential for demographic stability, and technological adaptation must begin before workforce shortages become critical. Both nations' experiences guide policy for aging Europe, East Asia, and eventually the global economy.`
        }
      ];
    }
    
    // India vs Pakistan specific FAQs
    if (comparison === 'india-vs-pakistan') {
      return [
        {
          question: `How did the 1947 partition affect India and Pakistan's current population differences?`,
          answer: `The 1947 partition created dramatically different demographic trajectories for these nations. At partition, the regions that became Pakistan had about 75 million people while India retained about 330 million - roughly a 4.4:1 ratio. Today, India's ${formatNumber(country1Pop2025)} vs Pakistan's ${formatNumber(country2Pop2025)} represents a ${(country1Pop2025 / country2Pop2025).toFixed(1)}:1 ratio. Pakistan's higher fertility rates have allowed it to grow its population share, but India's absolute advantage has expanded due to its massive base population and continued growth momentum.`
        },
        {
          question: `Why does Pakistan have a much younger population than India?`,
          answer: `Pakistan maintains one of the world's youngest populations with a median age of ${country2MedianAge.toFixed(1)} years compared to India's ${country1MedianAge.toFixed(1)} years. Pakistan's fertility rate of ${country2Fertility.toFixed(2)} births per woman significantly exceeds India's ${country1Fertility.toFixed(2)}. Cultural factors, religious influences, limited access to family planning, and lower female education levels in Pakistan contribute to sustained high birth rates. India's demographic transition began earlier with better healthcare, education, and family planning programs reducing fertility rates more rapidly.`
        },
        {
          question: `Which country has better managed its population growth?`,
          answer: `India has demonstrated more effective population management despite its larger scale. India's fertility has declined from 6+ births per woman in the 1960s to ${country1Fertility.toFixed(2)} today, approaching replacement level. Pakistan's rate remains at ${country2Fertility.toFixed(2)}, indicating continued rapid growth that strains resources. India's investments in education (especially female literacy), healthcare, and economic development have naturally reduced birth rates, while Pakistan faces challenges providing adequate services for its young, rapidly growing population.`
        },
        {
          question: `How do economic opportunities compare given their different population structures?`,
          answer: `Pakistan's extremely young population (median age ${country2MedianAge.toFixed(1)}) offers greater demographic dividend potential but faces bigger challenges. With 34% under 15, Pakistan must create massive job opportunities and educational capacity. India's more balanced structure (median age ${country1MedianAge.toFixed(1)}) provides workforce stability with manageable dependency ratios. However, India's larger economy and more diversified job market better absorb workforce growth. Pakistan's demographic advantage could become a liability without sufficient economic development and job creation.`
        },
        {
          question: `What role does religion play in population patterns across India and Pakistan?`,
          answer: `Religious demographics significantly influence population trends in both countries. Pakistan's 97% Muslim population maintains traditional large family preferences and limited contraception use, contributing to fertility rates of ${country2Fertility.toFixed(2)}. India's religious diversity creates varied patterns - Muslim communities have higher fertility (2.6 births) while Hindu and other communities average closer to replacement level. However, India's secular education and family planning programs have been more effective across religious communities than Pakistan's more conservative approach to reproductive health.`
        },
        {
          question: `How do urbanization patterns differ between India and Pakistan?`,
          answer: `India is more urbanized (35%) than Pakistan (37%), but both face massive urban population pressures. India's cities like Mumbai, Delhi, and Bangalore have become global economic centers, while Pakistan's urbanization around Karachi, Lahore, and Islamabad often lacks adequate infrastructure. Pakistan's rapid rural-to-urban migration, driven by its young population seeking opportunities, creates mega-city challenges. India's broader urban network and better planning provide more distributed urban growth, though both countries struggle with urban slums and infrastructure deficits.`
        },
        {
          question: `Which country will have a larger population by 2050?`,
          answer: `India will maintain its substantial population advantage through 2050 and beyond. Projections show India reaching about 1.67 billion by 2050 while Pakistan approaches 370 million - maintaining roughly a 4.5:1 ratio. India's population will plateau and begin declining after 2060, while Pakistan will continue growing past 2050. However, India's current population of ${formatNumber(country1Pop2025)} vs Pakistan's ${formatNumber(country2Pop2025)} represents such a massive base difference that Pakistan cannot reasonably "catch up" even with higher growth rates.`
        },
        {
          question: `How do education levels affect population growth in India vs Pakistan?`,
          answer: `Education, particularly female literacy, dramatically affects fertility patterns in both countries. India's female literacy rate of 65% correlates with declining birth rates and later marriages. Pakistan's female literacy of 46% contributes to sustained high fertility rates. Educated women in both countries have significantly fewer children - Pakistani women with secondary education average 3.2 children vs 4.2 for those with no education. India's greater educational investment, especially for girls, has accelerated its demographic transition compared to Pakistan's slower progress.`
        },
        {
          question: `What are the implications of these population trends for regional stability?`,
          answer: `Population dynamics significantly influence South Asian regional stability. Pakistan's youth bulge (34% under 15) creates potential for demographic dividend but also social instability if economic opportunities fail to match population growth. India's more balanced age structure provides stability but faces its own challenges managing 1.4+ billion people. Cross-border migration pressures, resource competition (especially water), and the need for economic cooperation become more critical as both populations continue growing, affecting regional security and development prospects.`
        },
        {
          question: `How do healthcare and life expectancy compare between India and Pakistan?`,
          answer: `India has achieved better health outcomes despite comparable economic levels. Indian life expectancy (70.4 years) exceeds Pakistan's (67.3 years), reflecting better healthcare infrastructure and public health programs. India's infant mortality (28 per 1,000) is lower than Pakistan's (52 per 1,000). India's demographic transition benefits from improved healthcare reducing child mortality and extending lifespans. Pakistan's younger population structure partly reflects higher birth rates rather than just better health outcomes, while India's longevity gains contribute to its aging population trend.`
        }
      ];
    }
    
    // India vs Bangladesh specific FAQs
    if (comparison === 'india-vs-bangladesh') {
      return [
        {
          question: `How did the 1947 partition and 1971 liberation war shape India vs Bangladesh demographics?`,
          answer: `The partition of Bengal in 1947 and Bangladesh's 1971 independence from Pakistan created distinct demographic trajectories. Bangladesh started as East Pakistan with about 46 million people, while India retained 330 million. Today's populations (India ${formatNumber(country1Pop2025)}, Bangladesh ${formatNumber(country2Pop2025)}) reflect different development paths. Bangladesh's liberation war disrupted population patterns but enabled focused development policies that accelerated demographic transition faster than India's more gradual changes across its vast territory.`
        },
        {
          question: `Why is Bangladesh so much more densely populated than India?`,
          answer: `Bangladesh achieves extreme population density (1,265 people/km²) compared to India (464/km²) due to its tiny land area of 147,570 km² versus India's 3.3 million km². Bangladesh's ${formatNumber(country2Pop2025)} people are packed into an area smaller than many Indian states. The fertile Ganges-Brahmaputra delta supports intensive agriculture, enabling high population density. However, this creates unique challenges for infrastructure, urban planning, and climate vulnerability that India's larger geography helps distribute.`
        },
        {
          question: `Which country has achieved faster demographic transition - India or Bangladesh?`,
          answer: `Bangladesh has achieved remarkably faster demographic transition despite starting later. Bangladesh reduced fertility from 6.9 births per woman (1975) to ${country2Fertility.toFixed(2)} today - among history's fastest declines. India's transition from 6.0 to ${country1Fertility.toFixed(2)} occurred more gradually over a longer period. Bangladesh's focused approach through family planning, female education, and microfinance programs proved more effective than India's diverse, sometimes inconsistent state-level policies across its massive territory.`
        },
        {
          question: `How do economic opportunities compare given their different population structures?`,
          answer: `Bangladesh's younger population (median age ${country2MedianAge.toFixed(1)}) offers greater demographic dividend potential, but faces space constraints. India's larger economy and median age of ${country1MedianAge.toFixed(1)} provide more diversified opportunities. Bangladesh's textile industry leverages its young workforce effectively, while India's tech and services sectors benefit from education investments. However, Bangladesh's extreme density (1,265/km²) limits expansion opportunities that India's vast territory provides for manufacturing and agriculture.`
        },
        {
          question: `What role does climate change play in these countries' demographic futures?`,
          answer: `Climate change poses greater demographic risks to Bangladesh than India. Bangladesh's low-lying delta geography makes it extremely vulnerable to sea-level rise and flooding, potentially displacing millions. With 1,265 people/km², Bangladesh has limited internal space for climate migration. India's larger territory and higher elevation provide more adaptation options, though coastal areas remain vulnerable. Climate-induced migration from Bangladesh to India is already occurring and may increase, affecting both countries' demographic planning and regional stability.`
        },
        {
          question: `How do education levels affect population trends in India vs Bangladesh?`,
          answer: `Education, particularly female literacy, drives Bangladesh's rapid demographic transition. Bangladesh achieved 75% female literacy, contributing significantly to its fertility decline to ${country2Fertility.toFixed(2)}. India's 70% female literacy correlates with slower fertility reduction to ${country1Fertility.toFixed(2)}. Bangladesh's focused investment in girls' education and microfinance programs for women proved more effective than India's broader but sometimes inconsistent educational policies across diverse states. Both countries show strong correlation between female education and reduced birth rates.`
        },
        {
          question: `Which country will have larger population by 2050?`,
          answer: `India will remain dramatically larger through 2050 and beyond. India is projected to reach 1.67 billion by 2050 while Bangladesh approaches 192 million - maintaining roughly an 8.7:1 ratio. Bangladesh's population will peak around 2050 and then decline due to its successful fertility transition, while India continues growing until around 2061. India's current ${formatNumber(country1Pop2025)} vs Bangladesh's ${formatNumber(country2Pop2025)} represents such a massive base difference that Bangladesh cannot meaningfully close the gap despite historical growth rates.`
        },
        {
          question: `How do migration patterns affect demographics between India and Bangladesh?`,
          answer: `Migration significantly influences both countries' demographics. Historical migration from Bangladesh to India (both legal and undocumented) affects population distribution, particularly in Indian border states like West Bengal and Assam. Climate-induced migration from Bangladesh's vulnerable coastal areas to India is increasing. Economic migration also occurs, with Bangladeshis seeking opportunities in India's larger economy. This migration affects both countries' urban planning, labor markets, and political dynamics while contributing to demographic changes in border regions.`
        },
        {
          question: `What lessons does Bangladesh's rapid demographic transition offer for India?`,
          answer: `Bangladesh's success offers valuable lessons for India's demographic management. Bangladesh achieved faster fertility decline through: focused investment in female education, accessible family planning services, microfinance programs empowering women, and consistent policy implementation. Unlike India's complex federal system, Bangladesh's more centralized approach enabled rapid, uniform policy deployment. However, India's diversity requires different approaches across states. Bangladesh proves that rapid demographic transition is possible with targeted interventions, even in densely populated developing regions.`
        },
        {
          question: `How do healthcare achievements compare between India and Bangladesh?`,
          answer: `Bangladesh has achieved better health outcomes than expected given its economic level. Bangladesh's life expectancy (72.8 years) now exceeds India's (69.7 years) despite lower GDP per capita. Bangladesh's infant mortality (27 per 1,000) is slightly better than India's (28 per 1,000). Bangladesh's focused approach to maternal health, immunization, and family planning contributed to its demographic transition. India's larger healthcare system serves more people but faces greater complexity managing diverse populations across vast geography. Both countries continue improving but Bangladesh shows what focused health policies can achieve.`
        }
      ];
    }
    
    // Default FAQs for China vs India comparison
    return [
    {
      question: `When did India overtake China in population?`,
      answer: `India officially overtook China as the world's most populous country in April 2023, according to United Nations estimates. This historic shift ended China's long reign as the world's most populous nation, a position it had held for centuries. As of 2025, India has ${formatNumber(country2Pop2025)} people compared to China's ${formatNumber(country1Pop2025)}, a gap of ${formatNumber(country2Pop2025 - country1Pop2025)} people.`
    },
    {
      question: `Will China's population drop below 1 billion?`,
      answer: `Yes, according to UN projections, China's population is expected to drop below 1 billion around 2070-2080. China's population peaked in 2021 at approximately 1.41 billion and has been declining since. With a fertility rate of just ${country1Fertility.toFixed(2)} births per woman (far below the replacement level of 2.1), the decline is expected to accelerate. By 2100, China's population could fall to around 770 million.`
    },
    {
      question: `Why is India's population growing faster than China's?`,
      answer: `India's population is growing faster primarily due to its higher fertility rate of ${country2Fertility.toFixed(2)} births per woman compared to China's ${country1Fertility.toFixed(2)}. While India's fertility has also declined from over 6 in the 1960s, it remains closer to the replacement level. Additionally, India has a younger population structure with a median age of ${country2MedianAge.toFixed(1)} years versus ${country1MedianAge.toFixed(1)} years in China, meaning more people are in their reproductive years.`
    },
    {
      question: `What is the demographic dividend and which country benefits more?`,
      answer: `The demographic dividend refers to economic growth potential from having a large working-age population relative to dependents. ${country2Name} is currently in a better position to benefit, with 65% of its population under 35 years old. ${country2Name}'s demographic window will remain open for about 20 more years, while ${country1Name}'s has already begun closing. However, ${country2Name} needs to create jobs and improve education to fully capitalize on this advantage, as its workforce participation rate (especially for women at 25-35%) is much lower than ${country1Name}'s.`
    },
    {
      question: `How does population affect GDP for ${country1Name} and ${country2Name}?`,
      answer: `Population directly impacts GDP through workforce size and consumption. ${country1Name} currently has a higher GDP per capita, but its aging and shrinking workforce poses challenges. ${country2Name}'s growing, younger population provides more workers and consumers, potentially driving economic growth. Economists project that ${country2Name}'s economy could surpass ${country1Name}'s by 2075 due to demographic advantages. However, ${country2Name} must improve productivity (currently about half of ${country1Name}'s) to fully benefit from its population advantage.`
    },
    {
      question: `What was the impact of China's one-child policy?`,
      answer: `China's one-child policy (1979-2015) dramatically reduced fertility from 6.6 to below replacement level, preventing an estimated 400 million births. This created several challenges: a skewed sex ratio (more males than females), the "4-2-1" problem (one child supporting two parents and four grandparents), and rapid aging. The policy contributed to China's current fertility rate of just ${country1Fertility.toFixed(2)}, well below what's needed for population stability.`
    },
    {
      question: `Which country has more elderly people?`,
      answer: `${country1Name} has significantly more elderly people both in absolute numbers and percentage. With a median age of ${country1MedianAge.toFixed(1)} years, ${country1Name} is aging rapidly - about 13% of its population is over 65, compared to just 7% in ${country2Name}. By 2050, over one-third of ${country1Name}'s population will be 65+, creating massive pension and healthcare challenges. ${country2Name}, with a median age of ${country2MedianAge.toFixed(1)}, has more time to prepare for population aging.`
    },
    {
      question: `What are the population densities of ${country1Name} vs ${country2Name}?`,
      answer: `${country2Name} is significantly more densely populated than ${country1Name}. With ${formatNumber(country2Pop2025)} people in 3.3 million km², ${country2Name} has about 448 people per km². ${country1Name}, despite having ${formatNumber(country1Pop2025)} people, has 9.6 million km² of land, resulting in just 147 people per km². This makes ${country2Name} over 3 times as densely populated as ${country1Name}, creating different challenges for infrastructure and resource management.`
    },
    {
      question: `When will India's population peak?`,
      answer: `India's population is projected to peak around 2061 at approximately 1.7 billion people, after which it will begin a gradual decline. This gives India about 36 more years of population growth. The peak will come as fertility rates continue to fall (currently ${country2Fertility.toFixed(2)} and declining) and the population ages. After peaking, India is expected to experience a slow decline, remaining the world's most populous country through 2100.`
    },
    {
      question: `How do male-female ratios compare between ${country1Name} and ${country2Name}?`,
      answer: `Both countries have more males than females, but for different reasons. ${country1Name}'s sex ratio imbalance (about 105 males per 100 females) was exacerbated by the one-child policy and cultural preference for sons, leading to sex-selective practices. ${country2Name} also has a skewed ratio (about 108 males per 100 females), similarly influenced by cultural preferences. Both countries face challenges from this imbalance, including millions of men unable to find marriage partners, potentially affecting social stability.`
    }
    ];
  };
  
  const faqs = getComparisonFAQs();

  // Generate FAQ schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left flex items-center justify-between py-2 hover:text-blue-600 transition-colors"
            >
              <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
              <span className="flex-shrink-0 text-2xl text-gray-400">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            
            {openIndex === index && (
              <div className="mt-3 text-gray-600 leading-relaxed animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SEO Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}