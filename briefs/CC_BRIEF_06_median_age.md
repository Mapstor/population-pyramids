# CC BRIEF #06: Median Age by Country — Interactive Map, Rankings & Age Calculator
# URL: /median-age-by-country
# Target: ~7K/mo direct keywords + broader aging/youth population queries
# Priority: FAST WIN — median age already displayed on homepage, data guaranteed

---

## ⚠️ SAFETY RULES (live site — read first)

1. Do NOT modify any existing pages, components, routes, data files, or config.
2. Create this as a NEW page only. New files only.
3. Match the existing site's design system exactly. Study existing pages first.
4. Test that existing pages still work after adding this page.
5. If unsure about anything, ask before changing.

---

## STEP 1: DATA VERIFICATION (do this first, report back)

Your homepage already displays median age for all 195 countries. This page uses the exact same data.

Verify:
1. Find where median age values come from. Either pre-calculated in a data file, OR calculated from age group distributions (the median of the population distribution).
2. Confirm you have median age (or can calculate it from age groups) for all 195 countries.
3. Check if you have historical median age data (1950-2025 — would power the trend charts).
4. Check if you have projection data (median age in 2050/2100).
5. You also have age group populations (0-14, 15-64, 65+) which power the youth %, elderly %, and dependency data already on the homepage.
6. Report back before building.

---

## STEP 2: THE INTERACTIVE TOOL (above the fold)

### "How Old Is Your Country?" — Median Age Explorer

This tool answers "how old is the population of [country]?" — a question people have but don't always phrase as "median age."

**Inputs** (one compact row):
- Country dropdown (with flags, default: 🌍 World)

**Results** (instant on selection):

Main stat card:
1. **Median age**: LARGE number (e.g., "38.5 years")
2. **Global rank**: "#X of 195" with label "oldest" or "youngest" depending on direction
3. **Context line**: "Older than X% of countries" or "Younger than X% of countries"

Population age breakdown card (horizontal stacked bar):
4. **Youth (0-14)**: [X]% — [absolute number]
5. **Working age (15-64)**: [X]% — [absolute number]
6. **Elderly (65+)**: [X]% — [absolute number]

Quick insights:
7. **Change since 1950**: "Median age was [X] in 1950 → [Y] today (+[Z] years)" (if historical data available)
8. **Category badge**: 
   - "Very Young" (median age < 20) 
   - "Young" (20-29) 
   - "Middle-Aged" (30-39)
   - "Aging" (40-49) 
   - "Aged" (50+)
9. **Comparison**: "Similar to: [2-3 countries with similar median age]"

**Compare mode**:
- "Compare with:" second country dropdown
- Side-by-side age breakdown bars
- Delta highlighted: "[Country A] is [X] years older/younger than [Country B]"

**"What if?" slider** (this is the unique tool element):
- A year slider: 1950 → present (→ 2100 if projection data exists)
- As user drags, the median age and age breakdown update in real time
- Shows how the country has aged (or gotten younger) over time
- This is essentially animating the demographic transition for a single country
- If no historical median age data, calculate it from age group distributions per year

### URL Parameter Support
- /median-age-by-country?country=japan → auto-selects Japan
- /median-age-by-country?compare=japan,niger → comparison
- /median-age-by-country?year=1980 → sets the slider to 1980

---

## STEP 3: CHOROPLETH MAP

World map colored by median age.

- Color scale: vibrant green (very young, median <20) → yellow (~30) → orange (~40) → dark red (aged, >48)
- Hover: country name + median age + youth%/elderly%
- Click: selects country in tool above
- Toggle: "Current" / "1950" / "2050 Projected" (if data available — shows how dramatically the map changes)

---

## STEP 4: RANKED DATA TABLE

| Rank | Country (flag) | Median Age | Youth % (0-14) | Working % (15-64) | Elderly % (65+) | Category | Change Since 1950 |
|------|----------------|------------|-----------------|---------------------|------------------|----------|-------------------|

- Default sort: median age descending (oldest first)
- Sortable by every column
- Searchable, filterable by region
- Filterable by category: Very Young / Young / Middle-Aged / Aging / Aged
- Color-coded median age cells matching the map scale
- Click row → selects in tool
- ALL from real data

---

## STEP 5: WRITTEN CONTENT

### Writing Rules
- **3 sentences max per paragraph.**
- **Real data in every section.**
- **Internal links**: 15+ to country pages.
- **External links**: 5-8 to UN, WHO, World Bank.
- **Front-load answers.**

### Content Sections

**H1: "Median Age by Country 2026: World's Oldest & Youngest Populations"**

**H2: "What Is Median Age?"**
- First sentence: "Median age is the age that divides a population into two equal halves — 50% are younger and 50% are older. The world's median age is [X] years as of [year], meaning half of all people on Earth are younger than [X] and half are older."
- Why it matters: single best number to understand if a country is "young" or "old"
- How it relates to population pyramids: wide base = low median age (expansive), narrow base = high median age (constrictive)
- Link to homepage pyramids
- 2 paragraphs max

**H2: "Median Age in the United States"**
(Targets "median age united states" — 3.6K/mo, the highest volume keyword in this cluster)
- First sentence: "The median age in the United States is [X] years, ranking it #[Y] globally."
- How this compares to other developed nations
- US median age trend: was [A] in 1950, now [X] (if historical data available)
- Youth vs elderly percentage breakdown
- Link to /united-states

**H2: "Countries with the Highest Median Age (Oldest Populations)"**
- Top 15 countries by median age from data
- For top 5, add 1-2 sentences of context:
  - Japan (likely #1): "Japan's median age of [X] is the world's highest, reflecting decades of declining births and the world's longest life expectancy."
  - Italy, Germany, Portugal, etc.
- What high median age means: pension pressure, healthcare costs, shrinking workforce
- Internal links to each country

**H2: "Countries with the Lowest Median Age (Youngest Populations)"**
- Bottom 15 countries by median age (youngest) from data
- For bottom 5, add context:
  - Niger (likely lowest): "Niger's median age of just [X] years means half its population is younger than [X] — a population dominated by children and teenagers."
  - Chad, Mali, Uganda, etc.
- What low median age means: youth bulge, education demands, job creation challenges, but also demographic dividend potential
- Internal links

**H2: "Median Age by US State"**
(Targets "median age by state" — 260/mo + related state queries)
- If you have US state data (from the /states section of the site), include a state ranking
- If not, note that state-level demographics are available at /states
- Oldest states (likely Maine, New Hampshire, Vermont)
- Youngest states (likely Utah, Texas, Alaska)
- Link to /states

**H2: "How Median Age Has Changed Since 1950"**
(Only include if historical data available)
- World median age was ~24 in 1950, now ~30 (verify from data)
- Countries that aged the fastest (South Korea likely — dramatic demographic transition)
- Countries that stayed young (Sub-Saharan Africa)
- What this trajectory means for the future
- Reference the "What if?" slider in the tool

**H2: "5 Median Age Case Studies"**

ALL numbers from actual data:

**Example 1: Japan — The World's Oldest Country**
"Japan has a median age of [X] years — the highest of any country. [Y]% of Japan's population is aged 65 or older, while only [Z]% is under 15. In 1950, Japan's median age was approximately [A] years, meaning the country has aged by [B] years in seven decades."
→ Link to /japan

**Example 2: Niger — The World's Youngest Country**
"Niger's median age of [X] years makes it the world's youngest country. A staggering [Y]% of Niger's population is under 15, while just [Z]% is 65 or older. This extreme youth creates enormous demand for education, healthcare, and job creation."
→ Link to /niger

**Example 3: United States — Middle of the Pack**
"The United States has a median age of [X], placing it [above/below] the global average of [Y]. [Z]% of Americans are under 15 and [W]% are over 65. Compared to most European countries, the US has a relatively younger population."
→ Link to /united-states

**Example 4: South Korea — Fastest Aging Country**
"South Korea's median age has risen from approximately [A] in 1950 to [X] today — one of the most dramatic demographic shifts in history. Combined with the world's lowest fertility rate, South Korea's population is aging faster than any other major country. By 2050, South Korea's median age is projected to be among the highest globally."
→ Link to /south-korea

**Example 5: Nigeria — Africa's Youth Giant**
"Nigeria's median age of [X] reflects a population where [Y]% of its [Z] million people are under 15. This youth bulge will make Nigeria one of the world's most populous countries by 2050. Whether this becomes a demographic dividend or a burden depends on education and employment policies."
→ Link to /nigeria

**H2: "Youth Population vs Elderly Population: The Global Divide"**
- Show the contrast: African nations have 40-50% under 15 while Japan/Italy have 25-30% over 65
- Which countries have more elderly than children (demographic crossover — likely Japan, Italy, Germany, etc.)
- Which countries have 5x more children than elderly
- This is where population pyramids connect perfectly — link back to the visual tool

**H2: "What Median Age Tells You About a Country"**
- Median age < 20: Expansive pyramid, rapid growth, youth-dominated economy, high dependency from children
- Median age 20-35: Demographic dividend window, large workforce, economic growth potential
- Median age 35-45: Transitioning economy, aging beginning, balanced dependency
- Median age > 45: Constrictive pyramid, shrinking workforce, pension/healthcare strain, population decline likely
- Connect each category to real country examples from data

**H2: "Frequently Asked Questions"**
10 FAQ items with real data:

1. "What is the median age?" (480/mo)
   "Median age is the age that divides a population into two numerically equal groups — half are younger, half are older. It is the single best indicator of whether a population is young or old. The world's median age is currently [X] years."

2. "What is the median age in the United States?" (3.6K/mo)
   "The median age in the United States is [X] years, ranking #[Y] of 195 countries. Approximately [Z]% of Americans are under 15 and [W]% are over 65."

3. "Which country has the highest median age?" (20/mo but featured snippet opportunity)
   "[Country] has the world's highest median age at [X] years. The top 5 oldest countries by median age are: [list from data with ages]."

4. "Which country has the youngest population?" (170/mo)
   "[Country] has the world's lowest median age at [X] years. [Y]% of its population is under 15 years old."

5. "What is the median age of the world?" (390/mo)
   "The global median age is [X] years. This has increased from approximately [Y] years in 1950 as populations worldwide age due to declining fertility and increasing life expectancy."

6. "What is the median age by state?" (260/mo)
   "US median ages range from [lowest state] at [X] years to [highest state] at [Y] years. States in the Northeast tend to be older while Southern and Western states tend to be younger." (Use data if available, or reference /states)

7. "What does a rising median age mean?"
   "A rising median age means a population is aging — fewer children are being born relative to the existing population, and/or people are living longer. Countries with rapidly rising median ages face growing pressure on pension systems and healthcare."

8. "What is a youth bulge?"
   "A youth bulge is when a country has an unusually large proportion of young people, typically with over 35% of the population under age 15. Countries like [example from data] and [example] currently have youth bulges, which can drive economic growth or create instability depending on job availability."

9. "What is the elderly population percentage by country?"
   "Japan has the highest elderly percentage at [X]% of population over 65, followed by [countries from data]. In contrast, countries like [example] have less than [Y]% over 65."

10. "How does median age relate to population pyramids?"
    "A low median age produces an expansive (triangle-shaped) population pyramid with a wide base of young people. A high median age produces a constrictive (inverted) pyramid with a narrow base. Explore population pyramids for all 195 countries on our homepage."

---

## STEP 6: SEO & TECHNICAL

### JSON-LD Structured Data
1. **FAQPage schema** — all 10 FAQ items
2. **WebApplication schema** — for the explorer tool
3. **Dataset schema** — UN WPP source
4. **BreadcrumbList schema** — Home > Median Age by Country

### Meta Tags
```
title: "Median Age by Country 2026: Oldest & Youngest Populations"
description: "See median age for all 195 countries ranked. US median age is X years (#Y globally). Japan is oldest at Z years, Niger youngest at W. Interactive map and data from UN."
```
(Fill in real numbers after data verification.)

### Internal Linking FROM This Page
- / (homepage — median age column)
- /japan (oldest)
- /niger or /chad (youngest)
- /italy, /germany, /portugal (aging Europe)
- /south-korea (fastest aging)
- /nigeria, /uganda, /democratic-republic-of-the-congo (youth bulge)
- /united-states (US section)
- /india (young large country)
- /china (aging rapidly)
- /russia (aging + population decline)
- /states (US state demographics)
- /generation-age-ranges-calculator (generations connect to median age)
- /dependency-ratio-calculator (dependency and median age are related)
- /population-growth-rate-calculator (growth slows as median age rises)
- /male-to-female-ratio (gender ratio shifts with age)
- /compare

### Canonical URL
https://populationpyramids.org/median-age-by-country

---

## TARGET KEYWORDS

### Primary (H1, meta title, first paragraph):
- median age by country (720)
- median age (general intent)

### High-Value Secondary:
- median age united states (3.6K — biggest keyword, gets its own H2)
- what is median age (480)
- median age world (390)
- average age of american population (390)
- median age by state (260)
- countries with youngest population (170)

### Secondary:
- median age of population (140)
- median age calculator (40)
- countries with highest median age (20)
- elderly population by state (20)
- aging population by state (20)
- youth bulge countries (10)

### Long-tail (FAQ and body):
- oldest country by median age
- youngest country in the world
- what does rising median age mean
- percentage of population over 65 by country
- youth bulge definition
- aging society

---

## COMPETITIVE ADVANTAGE

Current SERP for "median age by country":
- Wikipedia (static table)
- Worldometer (basic sortable table)
- World Bank (data portal)
- CIA World Factbook (basic list)

None have:
1. Interactive "How Old Is Your Country?" tool with instant visual breakdown
2. Time slider showing how a country aged from 1950 to present
3. Category badges (Very Young → Aged)
4. "Similar countries" comparison
5. Age breakdown bars (youth/working/elderly) with real numbers
6. Connection to population pyramids (your unique asset)
7. Country comparison tool
8. Combined median age + youth% + elderly% + historical trend on one page

The time slider is the killer feature — watching Japan's median age climb from ~22 in 1950 to ~50 today is powerful and shareable.

---

## QUALITY CHECKLIST

- [ ] Median ages match homepage table values exactly (same data source)
- [ ] Country dropdown has correct flags for all 195 countries
- [ ] Age breakdown (youth/working/elderly) percentages add to 100%
- [ ] Time slider works (if historical data available) — shows real data per year
- [ ] Category badges assign correctly based on median age thresholds
- [ ] "Similar countries" shows 2-3 countries with closest median age values
- [ ] Compare mode works
- [ ] URL params: ?country=japan, ?compare=japan,niger, ?year=1980
- [ ] Map renders with correct color scale
- [ ] Table is sortable, searchable, filterable
- [ ] All 5 examples use REAL numbers from data
- [ ] All 10 FAQ answers contain real data
- [ ] "Median age united states" query thoroughly answered (3.6K keyword)
- [ ] 15+ internal links to country pages
- [ ] 5+ external links
- [ ] All JSON-LD schemas valid
- [ ] Page fully responsive
- [ ] Matches existing site design
- [ ] No existing pages broken
- [ ] No paragraph exceeds 3 sentences
