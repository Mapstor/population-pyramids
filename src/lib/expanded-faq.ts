import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

interface FAQ {
  question: string;
  answer: string;
  category: 'population' | 'age' | 'fertility' | 'migration' | 'comparison' | 'trends' | 'social' | 'economic';
}

// Global population rankings (simplified - top 20 countries)
const globalRankings: Record<string, number> = {
  'china': 1, 'india': 2, 'united-states': 3, 'indonesia': 4, 'pakistan': 5,
  'brazil': 6, 'nigeria': 7, 'bangladesh': 8, 'russia': 9, 'mexico': 10,
  'japan': 11, 'ethiopia': 12, 'philippines': 13, 'egypt': 14, 'vietnam': 15,
  'turkey': 16, 'iran': 17, 'germany': 18, 'thailand': 19, 'united-kingdom': 20
};

export function generateExpandedFAQ(
  countryName: string,
  countrySlug: string,
  yearData: YearData,
  metrics: DemographicMetrics,
  countryData: CountryPopulationData,
  currentYear: number
): FAQ[] {
  const faqs: FAQ[] = [];
  
  // Calculate additional metrics
  const populationInMillions = yearData.totalPopulation / 1000000;
  const data1970 = countryData.years['1970'];
  const data2000 = countryData.years['2000'];
  // Estimate daily births based on youth percentage (fertility proxy)
  const estimatedBirthRate = metrics.youthPercentage > 35 ? 0.04 : metrics.youthPercentage > 25 ? 0.025 : 0.015;
  const dailyBirths = Math.round((yearData.totalPopulation * estimatedBirthRate) / 365);
  
  // 1. Population ranking question
  const globalRank = globalRankings[countrySlug];
  faqs.push({
    question: `How does ${countryName} rank globally by population?`,
    answer: globalRank ? 
      `${countryName} ranks ${globalRank}${getOrdinalSuffix(globalRank)} globally by population with ${populationInMillions.toFixed(1)} million people as of ${currentYear}. This places ${countryName} among the world's ${globalRank <= 10 ? 'most populous nations' : 'larger countries'}, representing approximately ${((yearData.totalPopulation / 8000000000) * 100).toFixed(2)}% of the global population. ${globalRank <= 5 ? 'As one of the population giants, demographic changes in ' + countryName + ' significantly impact global trends.' : 'While not among the population superpowers, ' + countryName + "'s demographic patterns reflect important regional and global development trends."} The country's population size influences its economic potential, political weight, and resource requirements on the international stage.` :
      `${countryName} has a population of ${populationInMillions.toFixed(1)} million people as of ${currentYear}, representing approximately ${((yearData.totalPopulation / 8000000000) * 100).toFixed(2)}% of the global population. While not among the world's most populous nations, ${countryName}'s demographic characteristics are significant for regional development patterns. The country's population size positions it as ${populationInMillions > 50 ? 'a medium-sized nation' : populationInMillions > 10 ? 'a smaller but notable country' : 'a smaller nation'} in global demographic terms. Understanding ${countryName}'s population dynamics provides insights into broader trends affecting similar-sized countries worldwide, particularly regarding development challenges and opportunities.`,
    category: 'comparison'
  });

  // 2. Population boom/decline question
  if (data1970) {
    const growthFactor = yearData.totalPopulation / data1970.totalPopulation;
    const causedBy = growthFactor > 2 ? 'boom' : growthFactor < 0.95 ? 'decline' : 'change';
    
    faqs.push({
      question: `What caused ${countryName}'s population ${causedBy}?`,
      answer: growthFactor > 2 ? 
        `${countryName}'s population boom resulted from a combination of declining mortality rates, sustained high fertility, and improved living conditions. Since 1970, the population has ${growthFactor >= 3 ? 'tripled' : 'more than doubled'} from ${(data1970.totalPopulation / 1000000).toFixed(1)} million to ${populationInMillions.toFixed(1)} million. Key factors include: improved healthcare reducing infant and maternal mortality, better nutrition and sanitation, economic development supporting larger families, and ${metrics.youthPercentage > 30 ? 'cultural preferences for large families' : 'demographic momentum from previous generations'}. ${data2000 ? 'Recent growth has ' + (((yearData.totalPopulation / data2000.totalPopulation - 1) * 100 > 30) ? 'continued rapidly' : 'begun to moderate') + ' as fertility rates adjust to modern economic conditions.' : ''} This demographic expansion presents both opportunities for economic growth and challenges for infrastructure, education, and employment provision.` :
        growthFactor < 0.95 ?
          `${countryName}'s population decline stems from ultra-low fertility rates, aging demographics, and emigration pressures. The population has decreased by ${((1 - growthFactor) * 100).toFixed(1)}% since 1970, reflecting advanced demographic transition challenges. Primary causes include: fertility rates well below replacement level (estimated ${metrics.youthPercentage > 35 ? '5.0+' : metrics.youthPercentage > 25 ? '3.2' : metrics.youthPercentage > 20 ? '2.1' : '1.4'} children per woman), rapid population aging with ${metrics.elderlyPercentage.toFixed(1)}% over 65, economic factors delaying family formation, and emigration of young adults seeking opportunities abroad. This demographic contraction creates labor shortages, pension sustainability issues, and economic growth challenges. Government policies increasingly focus on family support, immigration, and productivity enhancement to address demographic sustainability concerns.` :
          `${countryName}'s population has grown moderately by ${((growthFactor - 1) * 100).toFixed(1)}% since 1970, reflecting balanced demographic transition. This measured growth resulted from declining fertility rates as the country developed economically, while mortality improvements extended lifespans. The demographic transition shows ${metrics.medianAge < 30 ? 'ongoing youth advantages' : 'emerging aging challenges'} with current fertility at estimated ${metrics.youthPercentage > 35 ? '5.0+' : metrics.youthPercentage > 25 ? '3.2' : metrics.youthPercentage > 20 ? '2.1' : '1.8'} children per woman. Urbanization, education expansion, and women's workforce participation contributed to smaller family sizes, while healthcare improvements reduced death rates. This demographic balance provides ${countryName} with manageable dependency ratios and sustainable population growth patterns typical of middle-income developing nations.`,
      category: 'trends'
    });
  }

  // 3. Life expectancy question
  const estimatedLifeExpectancy = metrics.elderlyPercentage > 15 ? 78 : metrics.elderlyPercentage > 10 ? 73 : metrics.elderlyPercentage > 5 ? 68 : 63;
  faqs.push({
    question: `What is the life expectancy in ${countryName}?`,
    answer: `Life expectancy in ${countryName} is approximately ${estimatedLifeExpectancy} years as of ${currentYear}, reflecting the country's ${estimatedLifeExpectancy > 75 ? 'advanced healthcare system and high living standards' : estimatedLifeExpectancy > 70 ? 'improving healthcare infrastructure and moderate development levels' : 'developing healthcare capacity and ongoing public health challenges'}. This figure represents significant progress from historical levels, with improvements driven by better medical care, vaccination programs, improved nutrition, and sanitation infrastructure. ${metrics.elderlyPercentage > 15 ? 'The high proportion of elderly citizens (' + metrics.elderlyPercentage.toFixed(1) + '%) indicates successful longevity achievements.' : 'The current age structure with ' + metrics.elderlyPercentage.toFixed(1) + '% elderly suggests ongoing mortality transition.'} Life expectancy varies by gender, with women typically living ${estimatedLifeExpectancy > 70 ? '4-6' : '3-5'} years longer than men. Regional differences exist, with urban areas generally showing higher life expectancy due to better healthcare access and living conditions compared to rural regions.`,
    category: 'social'
  });

  // 4. Daily births question
  faqs.push({
    question: `How many people are born in ${countryName} each day?`,
    answer: `Approximately ${dailyBirths.toLocaleString()} babies are born in ${countryName} each day, based on estimated fertility rates and population size. This translates to roughly ${Math.round(dailyBirths / 24)} births per hour, reflecting the country's ${metrics.youthPercentage > 30 ? 'high fertility and young population structure' : metrics.youthPercentage > 20 ? 'moderate fertility rates and demographic transition' : 'low fertility typical of developed nations'}. Annual births total approximately ${(dailyBirths * 365).toLocaleString()}, representing ${((dailyBirths * 365 / yearData.totalPopulation) * 100).toFixed(1)}% of the current population. These birth rates ${metrics.youthPercentage > 25 ? 'likely ensure continued population growth' : metrics.youthPercentage > 20 ? 'suggest near-replacement fertility levels' : 'indicate below-replacement fertility'}. Each day's births represent the future workforce, taxpayers, and society members who will shape ${countryName}'s development over the coming decades.`,
    category: 'population'
  });

  // 5. Urbanization rate question
  const estimatedUrbanization = metrics.medianAge > 35 ? 75 : metrics.medianAge > 25 ? 65 : metrics.medianAge > 20 ? 55 : 35;
  faqs.push({
    question: `What is the urbanization rate in ${countryName}?`,
    answer: `${countryName}'s urbanization rate is approximately ${estimatedUrbanization}% as of ${currentYear}, meaning ${(yearData.totalPopulation * estimatedUrbanization / 100 / 1000000).toFixed(1)} million people live in cities and urban areas. This level of urbanization reflects ${estimatedUrbanization > 70 ? 'advanced economic development with most people in urban environments' : estimatedUrbanization > 50 ? 'ongoing urban transition as the economy modernizes' : 'predominantly rural society with emerging urban centers'}. Urban population growth occurs through rural-urban migration, natural increase in cities, and expansion of urban boundaries. ${estimatedUrbanization > 60 ? 'High urbanization creates challenges including housing shortages, infrastructure strain, and service delivery pressures.' : 'Lower urbanization suggests significant rural populations dependent on agriculture and traditional livelihoods.'} Urban areas typically show different demographic patterns than rural regions, with lower fertility rates, higher education levels, and different age structures due to migration patterns and lifestyle changes associated with city living.`,
    category: 'social'
  });

  // 6. Fertility comparison question
  const globalAverageTFR = 2.4;
  const estimatedTFR = (metrics.youthPercentage > 35 ? 5.0 : metrics.youthPercentage > 25 ? 3.2 : metrics.youthPercentage > 20 ? 2.1 : 1.6);
  faqs.push({
    question: `How does ${countryName}'s fertility rate compare globally?`,
    answer: `${countryName}'s total fertility rate of approximately ${estimatedTFR.toFixed(1)} children per woman ${estimatedTFR > globalAverageTFR + 1 ? 'significantly exceeds' : estimatedTFR > globalAverageTFR ? 'moderately exceeds' : estimatedTFR > 2.1 ? 'aligns with' : estimatedTFR > 1.5 ? 'falls below' : 'is substantially below'} the global average of ${globalAverageTFR} children per woman. This places ${countryName} among countries with ${estimatedTFR > 4 ? 'very high fertility typical of early demographic transition' : estimatedTFR > 3 ? 'high fertility characteristic of developing nations' : estimatedTFR > 2.1 ? 'replacement-level fertility ensuring population stability' : estimatedTFR > 1.5 ? 'below-replacement fertility common in developed countries' : 'ultra-low fertility seen in advanced economies'}. Fertility trends reflect socioeconomic factors including education levels, women's workforce participation, urbanization, healthcare access, and cultural preferences for family size. ${estimatedTFR > 3 ? 'High fertility supports population growth but challenges resource allocation for education, healthcare, and employment.' : 'Lower fertility enables per-capita investment but raises concerns about aging and labor force sustainability.'} Regional and urban-rural differences in fertility rates exist within ${countryName}, with urban areas typically showing lower fertility than rural regions.`,
    category: 'fertility'
  });

  // 7. Population density question
  const estimatedArea = populationInMillions > 100 ? 9000000 : populationInMillions > 50 ? 3000000 : populationInMillions > 10 ? 800000 : 200000; // Rough estimates
  const density = Math.round(yearData.totalPopulation / estimatedArea);
  faqs.push({
    question: `What is the population density in ${countryName}?`,
    answer: `${countryName} has an estimated population density of approximately ${density} people per square kilometer, which is considered ${density > 500 ? 'very high density typical of small nations or city-states' : density > 200 ? 'high density characteristic of developed countries with limited land' : density > 100 ? 'moderate density common in many countries' : density > 50 ? 'relatively low density with significant open space' : 'very low density with vast unpopulated areas'}. This density reflects the relationship between ${countryName}'s population of ${populationInMillions.toFixed(1)} million and its geographic area. Population distribution is typically uneven, with higher concentrations in urban centers, fertile agricultural regions, and coastal areas, while mountainous, desert, or other challenging terrain remains sparsely populated. ${density > 200 ? 'High population density creates challenges for housing, transportation, and environmental management.' : 'Lower density can provide advantages for resource availability but challenges for infrastructure development and service delivery.'} Density significantly impacts quality of life, economic development patterns, and environmental pressures within ${countryName}.`,
    category: 'population'
  });

  // 8. Migration question
  faqs.push({
    question: `How has migration affected ${countryName}?`,
    answer: `Migration has ${populationInMillions > 50 ? 'significantly shaped' : 'notably influenced'} ${countryName}'s demographic composition through both internal rural-urban movement and international migration flows. ${estimatedUrbanization > 60 ? 'Substantial rural-urban migration has driven urbanization, with millions moving to cities for economic opportunities, education, and improved living standards.' : 'Internal migration patterns show gradual rural-urban movement as economic development creates urban employment opportunities.'} International migration includes both emigration of ${countryName} citizens seeking opportunities abroad and immigration of foreign nationals for work, study, or refuge. ${metrics.medianAge > 35 ? 'As a developed economy, ' + countryName + ' often attracts skilled workers and students from other countries.' : 'As a developing nation, ' + countryName + ' experiences both emigration of educated youth and immigration for specific labor needs.'} Migration affects age structure, as migrants are typically young adults, impacting both origin and destination regions. Remittances from emigrants abroad often provide significant economic benefits, while immigration can help address labor shortages and demographic challenges. Government policies on migration influence economic development, cultural diversity, and demographic sustainability in ${countryName}.`,
    category: 'migration'
  });

  // 9. Age structure question
  faqs.push({
    question: `What does ${countryName}'s age structure reveal about its development?`,
    answer: `${countryName}'s age structure, with ${metrics.youthPercentage.toFixed(1)}% under 15, ${metrics.workingAgePercentage.toFixed(1)}% working-age (15-64), and ${metrics.elderlyPercentage.toFixed(1)}% elderly (65+), indicates ${metrics.medianAge < 25 ? 'early demographic transition with high growth potential' : metrics.medianAge < 35 ? 'intermediate development with demographic dividend opportunities' : 'advanced transition with aging challenges'}. The median age of ${metrics.medianAge.toFixed(1)} years reflects ${metrics.medianAge < 30 ? 'a young society with significant future workforce entry' : 'a maturing population with established workforce patterns'}. This demographic structure ${metrics.dependencyRatio < 50 ? 'provides favorable conditions for economic growth through low dependency ratios' : 'presents challenges with high dependency ratios requiring substantial support systems'}. ${metrics.youthPercentage > 30 ? 'The large youth population demands massive investments in education, healthcare, and job creation over the coming decades.' : 'The smaller youth cohorts suggest approaching population stabilization and eventual aging pressures.'} Age structure directly influences economic planning, social service needs, labor market dynamics, and long-term fiscal sustainability in ${countryName}.`,
    category: 'age'
  });

  // 10. Economic implications question
  faqs.push({
    question: `What are the economic implications of ${countryName}'s demographics?`,
    answer: `${countryName}'s demographic profile creates ${metrics.dependencyRatio < 50 ? 'significant economic opportunities' : 'notable economic challenges'} through its impact on labor markets, consumption patterns, and fiscal requirements. With ${metrics.workingAgePercentage.toFixed(1)}% of the population in working ages, the country has ${metrics.workingAgePercentage > 65 ? 'abundant labor force potential supporting economic expansion' : 'moderate workforce capacity requiring productivity enhancements'}. The dependency ratio of ${metrics.dependencyRatio.toFixed(1)} means each working person supports ${(metrics.dependencyRatio / 100).toFixed(1)} dependents, ${metrics.dependencyRatio < 50 ? 'enabling high savings rates and investment capacity' : 'requiring substantial resources for dependent care'}. ${metrics.youthPercentage > 25 ? 'Large youth populations drive demand for education and job creation, requiring annual employment generation for ' + Math.round(metrics.youthPercentage * yearData.totalPopulation / 100 / 15).toLocaleString() + ' new workforce entrants.' : 'Smaller youth cohorts allow focus on education quality and skill development.'} ${metrics.elderlyPercentage > 15 ? 'Significant elderly populations increase healthcare and pension costs while reducing labor force participation.' : 'Lower elderly proportions postpone aging-related fiscal pressures.'} These demographic patterns influence economic growth potential, social spending priorities, and long-term fiscal sustainability in ${countryName}.`,
    category: 'economic'
  });

  // 11. Demographic dividend question
  faqs.push({
    question: `Is ${countryName} experiencing a demographic dividend?`,
    answer: `${countryName} is ${metrics.dependencyRatio < 50 && metrics.workingAgePercentage > 65 ? 'currently experiencing' : metrics.dependencyRatio < 60 && metrics.workingAgePercentage > 60 ? 'entering' : metrics.dependencyRatio > 70 ? 'past' : 'approaching'} a demographic dividend phase. ${metrics.dependencyRatio < 50 ? 'With low dependency ratios and a large working-age population, conditions are optimal for accelerated economic growth through increased savings, investment, and productivity.' : 'Current demographic conditions ' + (metrics.dependencyRatio > 70 ? 'have moved beyond the dividend window, requiring focus on productivity and automation' : 'suggest emerging opportunities for demographic benefits') + '.'} The demographic dividend occurs when fertility declines create a bulge in working-age population while dependency ratios remain manageable. ${countryName} ${metrics.youthPercentage > 25 ? 'still has significant youth populations that will enter the workforce over the next 15 years' : 'shows more balanced age structures typical of dividend or post-dividend phases'}. Realizing demographic dividend benefits requires strategic investments in education, healthcare, job creation, and governance to enable the working-age population to contribute productively. ${metrics.dependencyRatio < 50 ? 'This demographic window typically lasts 20-30 years, making current policy decisions crucial for maximizing economic benefits.' : 'Understanding demographic timing helps inform appropriate economic and social policies.'}`,
    category: 'economic'
  });

  // 12. Comparison with neighbors question
  faqs.push({
    question: `How does ${countryName} compare demographically to its neighbors?`,
    answer: `${countryName}'s demographic characteristics ${metrics.medianAge < 25 ? 'align with regional patterns of young populations and high growth' : metrics.medianAge > 40 ? 'reflect advanced development compared to regional averages' : 'show typical transitional patterns for its region'}. The median age of ${metrics.medianAge.toFixed(1)} years ${metrics.medianAge < 30 ? 'is characteristic of developing regions with ongoing demographic transitions' : 'indicates more advanced demographic development than many regional neighbors'}. Fertility rates of approximately ${estimatedTFR.toFixed(1)} children per woman ${estimatedTFR > 3 ? 'exceed regional trends toward smaller families' : estimatedTFR < 2 ? 'show more advanced fertility transition than neighboring countries' : 'align with regional demographic transition patterns'}. ${metrics.elderlyPercentage > 10 ? 'The elderly population proportion of ' + metrics.elderlyPercentage.toFixed(1) + '% indicates more advanced aging than typical for the region.' : 'Low elderly proportions reflect regional characteristics of young populations.'} Economic development levels, education systems, healthcare access, and urbanization rates influence these demographic differences. Regional migration patterns also create demographic connections, with labor mobility and cultural exchange affecting population structures across neighboring countries. Understanding regional demographic contexts helps interpret ${countryName}'s development trajectory and policy needs.`,
    category: 'comparison'
  });

  // 13. Future challenges question
  faqs.push({
    question: `What demographic challenges will ${countryName} face in the future?`,
    answer: `${countryName} faces ${metrics.medianAge < 25 ? 'youth-related demographic challenges' : metrics.medianAge > 40 ? 'aging-related demographic pressures' : 'transitional demographic adjustments'} over the coming decades. ${metrics.youthPercentage > 30 ? 'The large youth population (' + metrics.youthPercentage.toFixed(1) + '%) requires massive job creation, with approximately ' + Math.round(metrics.youthPercentage * yearData.totalPopulation / 100 / 1000).toFixed(0) + ',000 young people needing employment opportunities annually.' : 'Smaller youth cohorts will create eventual labor shortages and reduced economic dynamism.'} ${metrics.elderlyPercentage > 15 ? 'Rapid population aging will strain healthcare systems, pension programs, and social services while reducing workforce participation.' : 'Future aging pressures will emerge as current working-age populations retire over the next 20-30 years.'} ${estimatedTFR < 2.1 ? 'Below-replacement fertility threatens long-term population sustainability and economic growth.' : 'High fertility levels require continued investment in education, healthcare, and infrastructure to support growing populations.'} Additional challenges include ${estimatedUrbanization < 60 ? 'managing rural-urban migration and urban development pressures' : 'addressing urban overcrowding and environmental sustainability'}. Climate change, technological disruption, and global economic shifts will compound demographic pressures. Successful navigation requires proactive policies addressing education, healthcare, employment, social protection, and sustainable development to manage demographic transitions effectively.`,
    category: 'trends'
  });

  // 14. Education implications question
  faqs.push({
    question: `How do demographics affect education needs in ${countryName}?`,
    answer: `${countryName}'s demographic profile creates ${metrics.youthPercentage > 25 ? 'substantial' : metrics.youthPercentage > 15 ? 'moderate' : 'manageable'} education system demands. With ${metrics.youthPercentage.toFixed(1)}% of the population under 15, approximately ${(metrics.youthPercentage * yearData.totalPopulation / 100 / 1000000).toFixed(1)} million children need educational services. ${metrics.youthPercentage > 30 ? 'This large school-age population requires massive infrastructure investment, teacher training, and curriculum development to ensure quality education for all.' : 'Smaller youth cohorts allow focus on education quality improvements and per-student investment increases.'} Primary education enrollment should accommodate ${Math.round(metrics.youthPercentage * yearData.totalPopulation / 100 / 3).toLocaleString()} children across different age groups, while secondary education serves older youth transitioning to workforce or higher education. ${metrics.medianAge < 25 ? 'Young populations create ongoing pressure for education expansion, but also provide opportunities for human capital development that drives economic growth.' : 'Aging populations allow education system consolidation but require adult education and retraining programs.'} Education quality affects future demographic patterns through its impact on fertility rates, economic development, and social mobility. Investment in education systems directly influences ${countryName}'s ability to harness demographic dividends and manage demographic transitions successfully.`,
    category: 'social'
  });

  // 15. Healthcare system question
  faqs.push({
    question: `What healthcare challenges does ${countryName}'s age structure create?`,
    answer: `${countryName}'s age structure generates ${metrics.elderlyPercentage > 15 ? 'significant aging-related healthcare pressures' : metrics.youthPercentage > 30 ? 'youth-focused healthcare demands' : 'balanced healthcare system requirements'}. ${metrics.elderlyPercentage > 10 ? 'With ' + metrics.elderlyPercentage.toFixed(1) + '% of the population over 65, healthcare systems must address chronic diseases, long-term care, and age-related medical conditions requiring specialized services and higher per-capita costs.' : 'Lower elderly proportions currently limit aging-related healthcare costs but require preparation for future demographic shifts.'} ${metrics.youthPercentage > 25 ? 'Large youth populations demand maternal and child health services, vaccination programs, nutrition support, and pediatric care infrastructure.' : 'Smaller youth populations allow healthcare resource reallocation toward adult and elderly care needs.'} The demographic transition affects disease patterns, with ${metrics.medianAge > 35 ? 'non-communicable diseases like heart disease, diabetes, and cancer becoming predominant health challenges' : 'infectious diseases and maternal/child health remaining significant concerns alongside emerging lifestyle-related conditions'}. Healthcare workforce planning must anticipate demographic changes, training sufficient geriatricians, pediatricians, and specialized care providers. ${estimatedUrbanization > 60 ? 'Urban healthcare concentration requires rural service delivery strategies.' : 'Rural populations need accessible healthcare infrastructure and service delivery mechanisms.'} Effective healthcare systems adapt to demographic transitions while ensuring universal access and financial sustainability.`,
    category: 'social'
  });

  // 16. Gender dynamics question
  const totalMales = yearData.ageGroups.reduce((sum, ag) => sum + ag.male, 0);
  const totalFemales = yearData.ageGroups.reduce((sum, ag) => sum + ag.female, 0);
  const sexRatio = (totalMales / totalFemales * 100);
  faqs.push({
    question: `What are the gender dynamics in ${countryName}'s population?`,
    answer: `${countryName} has ${sexRatio > 105 ? 'more males than females' : sexRatio < 95 ? 'more females than males' : 'relatively balanced gender proportions'}, with approximately ${sexRatio.toFixed(0)} males per 100 females. This ${sexRatio > 110 ? 'significant male surplus' : sexRatio < 90 ? 'notable female majority' : 'balanced ratio'} ${sexRatio !== 100 ? 'affects marriage patterns, workforce participation, and social dynamics' : 'supports natural demographic balance'}. Gender ratios vary by age group, with ${sexRatio > 105 ? 'male advantages potentially reflecting cultural preferences or migration patterns' : 'female advantages possibly indicating male emigration or mortality differences'}. ${metrics.elderlyPercentage > 10 ? 'Among elderly populations, women typically outnumber men due to higher female life expectancy.' : 'Younger populations may show different gender balances due to birth preferences or migration.'} Gender dynamics influence economic development through women's workforce participation, education access, and reproductive health outcomes. ${estimatedTFR > 3 ? 'High fertility rates often correlate with traditional gender roles and limited women\'s economic participation.' : 'Lower fertility typically accompanies increased women\'s education and workforce engagement.'} Understanding gender demographics helps inform policies on education equality, healthcare access, economic empowerment, and social development in ${countryName}.`,
    category: 'social'
  });

  // 17. Environmental pressure question
  faqs.push({
    question: `How does ${countryName}'s population growth affect environmental resources?`,
    answer: `${countryName}'s ${data1970 ? 'population growth of ' + ((yearData.totalPopulation / data1970.totalPopulation - 1) * 100).toFixed(0) + '% since 1970' : 'current population of ' + populationInMillions.toFixed(1) + ' million'} creates ${density > 200 ? 'intense' : density > 100 ? 'moderate' : 'manageable'} environmental pressures on natural resources and ecosystems. ${populationInMillions > 50 ? 'Large populations demand substantial water, food, energy, and land resources while generating significant waste and emissions.' : 'Smaller populations create proportionally lower environmental demands but still require sustainable resource management.'} ${estimatedUrbanization > 60 ? 'High urbanization concentrates environmental impacts in cities, creating challenges for air quality, waste management, and water systems.' : 'Lower urbanization spreads environmental impacts across rural areas, affecting agricultural land and natural habitats.'} Population density of ${density} people per square kilometer ${density > 300 ? 'intensifies competition for land and resources' : 'allows for more sustainable resource use patterns'}. ${metrics.youthPercentage > 25 ? 'Growing young populations increase future resource demands and consumption patterns.' : 'Stable population structures enable more predictable environmental planning.'} Climate change compounds demographic pressures through environmental migration, resource scarcity, and extreme weather impacts. Sustainable development requires balancing population needs with environmental protection through efficient resource use, renewable energy adoption, and conservation strategies in ${countryName}.`,
    category: 'trends'
  });

  // 18. Cultural implications question
  faqs.push({
    question: `How do cultural factors influence ${countryName}'s demographic patterns?`,
    answer: `Cultural values, traditions, and social norms significantly shape ${countryName}'s demographic behaviors including family formation, fertility preferences, and life transitions. ${estimatedTFR > 3 ? 'High fertility rates often reflect cultural preferences for large families, traditional gender roles, and children as economic security.' : 'Lower fertility typically accompanies cultural shifts toward individual achievement, women\'s empowerment, and quality-focused child-rearing.'} Religious beliefs, ethnic traditions, and historical experiences influence marriage timing, contraceptive use, and desired family sizes across different population groups. ${estimatedUrbanization > 60 ? 'Urbanization creates cultural change as traditional rural values encounter modern urban lifestyles, affecting demographic behaviors.' : 'Predominantly rural populations often maintain traditional cultural patterns that support higher fertility and extended family structures.'} Educational expansion, particularly women's education, challenges traditional cultural norms while creating new demographic patterns. ${metrics.medianAge > 30 ? 'Aging populations may strengthen traditional cultural values while adapting to modern realities.' : 'Young populations often drive cultural change and demographic transition.'} Migration, both internal and international, creates cultural mixing and demographic diversity. Government policies on family planning, gender equality, and social welfare interact with cultural values to influence demographic outcomes. Understanding cultural contexts helps explain demographic variations within ${countryName} and predict future population trends.`,
    category: 'social'
  });

  // 19. Policy implications question
  faqs.push({
    question: `What policy priorities should ${countryName} focus on given its demographics?`,
    answer: `${countryName}'s demographic profile suggests policy priorities focused on ${metrics.youthPercentage > 30 ? 'youth development and employment creation' : metrics.elderlyPercentage > 15 ? 'aging society adaptation and elderly care' : 'balanced demographic transition management'}. ${metrics.youthPercentage > 25 ? 'Large youth populations require massive education investment, skills training, and job creation to harness demographic dividends while preventing youth unemployment and social instability.' : 'Smaller youth cohorts allow focus on education quality and preparing for future labor shortages.'} ${metrics.elderlyPercentage > 10 ? 'Growing elderly populations demand healthcare system strengthening, pension sustainability measures, and age-friendly infrastructure development.' : 'Preparing for future aging through healthcare capacity building and social protection system development remains important.'} ${metrics.dependencyRatio < 50 ? 'Favorable dependency ratios create opportunities for economic growth policies, infrastructure investment, and human capital development.' : 'High dependency ratios require social protection strengthening and productivity enhancement strategies.'} ${estimatedUrbanization < 60 ? 'Managing rural-urban migration through balanced regional development, urban planning, and rural livelihood support.' : 'Addressing urban challenges including housing, transportation, and environmental sustainability.'} Family planning policies should align with demographic goals, while migration policies can address labor market needs. Long-term demographic sustainability requires integrated approaches addressing education, healthcare, economic development, and social protection in ${countryName}.`,
    category: 'economic'
  });

  // 20. Global context question
  faqs.push({
    question: `How does ${countryName} fit into global demographic trends?`,
    answer: `${countryName} exemplifies ${metrics.medianAge < 25 ? 'global South demographic patterns with young populations and ongoing transitions' : metrics.medianAge > 40 ? 'developed world demographic characteristics including aging and low fertility' : 'middle-income country demographic transitions occurring worldwide'}. The median age of ${metrics.medianAge.toFixed(1)} years ${metrics.medianAge < 30 ? 'aligns with developing country trends toward demographic transition' : 'reflects advanced demographic development similar to industrialized nations'}. ${estimatedTFR > 3 ? 'High fertility rates place ' + countryName + ' among countries driving global population growth, particularly in regions experiencing rapid demographic expansion.' : 'Lower fertility contributes to global fertility decline and population stabilization trends.'} ${metrics.elderlyPercentage > 15 ? 'Rapid aging mirrors global demographic shifts affecting developed and middle-income countries worldwide.' : 'Current youth advantages reflect patterns common in developing regions but represent future aging challenges.'} Global migration flows connect ${countryName} to international demographic trends through emigration, immigration, and remittance patterns. Climate change, technological advancement, and economic globalization create common demographic pressures across countries. ${countryName}'s demographic experience provides insights into global population dynamics while requiring policies adapted to its specific context. Understanding global demographic trends helps ${countryName} anticipate challenges and learn from international experiences in managing demographic transitions effectively.`,
    category: 'comparison'
  });

  return faqs.slice(0, 18); // Return 18 comprehensive FAQs
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j == 1 && k != 11) return "st";
  if (j == 2 && k != 12) return "nd";
  if (j == 3 && k != 13) return "rd";
  return "th";
}