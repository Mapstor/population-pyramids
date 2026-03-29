# CC BRIEF #02: Dependency Ratio Calculator & Rankings by Country
# URL: /dependency-ratio-calculator
# Combined target: ~87K monthly searches (dependency ratio 12K + economically active 75K + related)
# Priority: MEDIUM volume but EASY win — data is already on the site

---

## ⚠️ SAFETY RULES (live site — read first)

1. Do NOT modify any existing pages, components, routes, data files, or config.
2. Create this as a NEW page only. New files only.
3. Match the existing site's design system exactly. Study existing pages first.
4. Test that existing pages still work after adding this page.
5. If you're unsure about anything, ask me before changing anything.

---

## STEP 1: DATA VERIFICATION (do this first, report back)

This page needs population by age group data. You ALREADY have this — it powers the pyramids and you already calculate dependency ratio on the homepage table. Verify:

1. Find the age group population data (0-4, 5-9, ... 95-99, 100+) by country, both sexes.
2. Confirm you can calculate: youth (0-14), working-age (15-64), elderly (65+) for all 195 countries.
3. Check if you have this data for MULTIPLE YEARS (1950-2025+) — needed for historical trends.
4. Check if you have UN WPP PROJECTION data (medium variant to 2050/2100) — needed for future dependency ratio projections.
5. Look at how the homepage table already calculates the "Dependency" column. Use the same data source and method.
6. Report back what you found before building.

---

## STEP 2: THE INTERACTIVE TOOL (above the fold)

### Three-Part Calculator

The tool has THREE modes. Use tabs or toggle to switch between them:

**Mode A: "Calculate Dependency Ratio" (custom input)**
User inputs:
- Population aged 0-14 (number input)
- Population aged 15-64 (number input)  
- Population aged 65+ (number input)

Outputs (calculate live as user types):
- Total Dependency Ratio = ((0-14) + (65+)) / (15-64) × 100
- Youth Dependency Ratio = (0-14) / (15-64) × 100
- Old-Age Dependency Ratio = (65+) / (15-64) × 100
- Visual: donut chart showing the three segments (youth, working-age, elderly)
- Interpretation text: "For every 100 working-age people, there are X dependents (Y children + Z elderly)"

**Mode B: "Dependency Ratio by Country" (lookup from real data)**
- Dropdown with all 195 countries (with flags — use same flag component as other pages)
- Default: World
- On select, show:
  - Total dependency ratio
  - Youth dependency ratio
  - Old-age dependency ratio  
  - Population breakdown: youth / working-age / elderly (actual numbers)
  - Donut chart visualization
  - Historical trend line chart (1950 to latest year available)
  - Projected trend to 2050/2100 (if projection data available, dashed line)
  - Comparison text: "Higher/lower than world average of X"

**Mode C: "Compare Countries"**
- Two country dropdowns side by side
- Show both countries' dependency ratios with visual comparison
- Bar chart comparing youth DR vs old-age DR for both countries
- Key difference highlighted: "Japan's old-age dependency (X) is Y times higher than Nigeria's (Z)"

### URL Parameter Support
- /dependency-ratio-calculator?country=japan → auto-selects Japan in Mode B
- /dependency-ratio-calculator?compare=japan,nigeria → auto-loads Mode C comparison
- This enables sharing and helps Google index specific country views

---

## STEP 3: RANKED DATA TABLE

Below the calculator, full sortable table:

| Rank | Country (with flag) | Total DR | Youth DR | Old-Age DR | Working-Age % | Trend (↑↓) |
|------|---------------------|----------|----------|------------|---------------|-------------|

- Sortable by every column
- Searchable by country name
- Filterable by region (same regions as homepage: Africa, Americas, Asia, Europe, Oceania)
- Color-code: high DR in red/orange, low DR in green
- Trend column shows if DR is increasing or decreasing vs 5 years ago
- Click any country row → scrolls up to Mode B calculator with that country pre-selected
- ALL data from real UN WPP age group data — calculate DR from actual population numbers

---

## STEP 4: CHOROPLETH MAP

Interactive world map colored by dependency ratio. Same style as any maps on the site (if you have map components). If no map component exists yet, use a simple choropleth with hover tooltips showing country name + DR value.

- Color scale: green (low DR ~20) → yellow (~50) → red (high DR ~100+)
- Toggle between: Total DR / Youth DR / Old-Age DR
- Click country on map → selects it in the calculator above

---

## STEP 5: WRITTEN CONTENT

### Writing Rules
- **3 sentences max per paragraph.** No exceptions.
- **Real data in every section.** Every claim uses actual numbers from the dataset.
- **Comprehensive and extensive.** Cover every angle.
- **Internal links**: 10-15 links to country pages scattered naturally.
- **External links**: 5-8 links to authoritative sources (UN, World Bank, WHO).
- **No filler.** Every sentence earns its place.
- **Front-load answers** — first sentence of each section should be a direct, citable definition or fact.

### Content Sections (in this order, after the tool + table + map)

**H2: "What Is Dependency Ratio?"**
- First sentence MUST be a clean definition an AI can cite: "The dependency ratio measures the number of dependents (people aged 0-14 and 65+) for every 100 working-age people (aged 15-64) in a population."
- Explain the three types: total, youth, old-age
- Formula shown clearly
- What the number means in plain language: "A dependency ratio of 50 means there are 50 dependents for every 100 workers"
- 2-3 paragraphs max

**H2: "How to Calculate Dependency Ratio (Formula & Examples)"**
- Show the formula: Total DR = ((Pop 0-14 + Pop 65+) / Pop 15-64) × 100
- Youth DR formula
- Old-Age DR formula
- **5 real examples using actual country data from the dataset:**

Example format:
"**Example 1: Japan (Highest Old-Age Dependency)**
Japan has [X] people aged 0-14, [Y] people aged 15-64, and [Z] people aged 65+.
Total DR = (([X] + [Z]) / [Y]) × 100 = [result].
This means for every 100 working-age Japanese, there are [result] dependents — [youth DR] children and [old-age DR] elderly."

Do 5 examples covering diverse cases:
1. Japan or Italy (highest old-age DR — aging crisis)
2. Niger or Uganda (highest youth DR — youth bulge)  
3. Qatar or UAE (lowest total DR — working-age migrants)
4. United States (balanced/moderate)
5. China (transitioning — youth DR dropping, old-age DR rising fast)

ALL NUMBERS MUST COME FROM THE ACTUAL DATASET. Calculate them, don't guess.

**H2: "Dependency Ratio by Country: Global Rankings 2026"**
- Reference the table and map above
- Highlight: highest total DR countries (top 5 with actual numbers)
- Highlight: lowest total DR countries (top 5 with actual numbers)
- Highest youth DR countries
- Highest old-age DR countries
- Regional patterns: "African nations dominate youth dependency, while European and East Asian nations lead in old-age dependency"
- Internal links to each country mentioned

**H2: "Economically Active Population & Working-Age Demographics"**
(This section targets the 74K/mo "economically active population" keyword cluster)
- Define economically active population
- Show working-age population (15-64) as % of total by country
- Countries with highest working-age share (demographic dividend window)
- Countries with lowest working-age share
- Link to concept: "Countries where working-age population exceeds 65% are in their demographic dividend window"
- Internal links to relevant country pages

**H2: "Youth Dependency Ratio: Countries with Young Populations"**
- Explain what youth dependency means
- Top 10 countries by youth DR (with actual numbers from data)
- What high youth DR means: education spending, job creation needs
- Internal links to African country pages (Nigeria, Niger, DRC, Uganda, etc.)

**H2: "Old-Age Dependency Ratio: The Aging Crisis"**
- Explain old-age dependency  
- Top 10 countries by old-age DR (with actual numbers)
- What high old-age DR means: pension pressure, healthcare costs
- How old-age DR is projected to change by 2050 (if projection data available)
- Internal links to Japan, Italy, Germany, South Korea, etc.

**H2: "How Dependency Ratio Changes Over Time"**
- Global dependency ratio trend 1950 → present
- How it's projected to change (use projection data if available)
- Countries where DR is rising fastest
- Countries where DR is falling fastest
- Explain demographic transition connection

**H2: "Dependency Ratio vs Other Demographic Indicators"**
- How DR relates to median age (link to future /median-age page, or just mention)
- How DR relates to fertility rate (link to future /fertility-rate page)
- How DR relates to population pyramids (link to homepage / country pages)
- Why DR alone doesn't tell the full story (limitations: ignores unemployment, retirement age differences, informal economy)

**H2: "Frequently Asked Questions"**
10 FAQ items targeting exact search queries:

1. "What is the dependency ratio?" (6.6K/mo)
   Answer: Direct definition + global average number from data.

2. "What is the dependency ratio formula?"
   Answer: Total DR = ((Pop 0-14 + Pop 65+) / Pop 15-64) × 100. Show youth and old-age formulas too.

3. "What is a good dependency ratio?"
   Answer: Below 50 is generally favorable. Use real examples — Qatar at [X] vs Niger at [Y].

4. "What is the youth dependency ratio?" (590/mo)
   Answer: Definition + current global youth DR from data.

5. "What is the old age dependency ratio?" (590/mo)
   Answer: Definition + highest country (Japan at [X]) from data.

6. "What is the dependency ratio of the United States?" (260/mo)
   Answer: Exact number from data + youth vs old-age split.

7. "Which country has the highest dependency ratio?"
   Answer: [Country] at [number] from actual data. Explain why.

8. "Which country has the lowest dependency ratio?"
   Answer: [Country] at [number] from actual data. Explain why (likely Gulf state with migrant workers).

9. "What is the economically active population?" (74K/mo — big keyword)
   Answer: People aged 15-64 who are available for work. Global number from data. Relate to dependency ratio.

10. "How does dependency ratio affect the economy?"
    Answer: High DR = more tax burden on workers, strain on social services. Low DR = demographic dividend opportunity.

Each FAQ answer: 2-3 sentences, real data, self-contained (an AI must be able to cite just the answer).

---

## STEP 6: SEO & TECHNICAL

### JSON-LD Structured Data (in page <head>)

1. **FAQPage schema** — all 10 FAQ items
2. **WebApplication schema** — for the calculator
3. **Dataset schema** — reference UN WPP as source
4. **BreadcrumbList schema** — Home > Dependency Ratio Calculator

### Meta Tags
```
title: "Dependency Ratio Calculator by Country 2026 | Population Pyramids"
description: "Calculate dependency ratio for any country. See youth, old-age, and total dependency ratios for 195 countries with real UN data. Free calculator with formula and examples."
```
Keep title under 60 chars if possible. That's 62 — try:
"Dependency Ratio Calculator & Rankings 2026 | PopulationPyramids"

### H2s — Keyword-Optimized (use these exact H2s)
- "What Is Dependency Ratio?" (targets: what is dependency ratio — 1.9K)
- "How to Calculate Dependency Ratio (Formula & Examples)" (targets: dependency ratio formula — 590)
- "Dependency Ratio by Country: Global Rankings 2026" (targets: dependency ratio by country — 30)
- "Economically Active Population & Working-Age Demographics" (targets: economically active population — 74K!)
- "Youth Dependency Ratio: Countries with Young Populations" (targets: youth dependency ratio — 590)
- "Old-Age Dependency Ratio: The Aging Crisis" (targets: old age dependency ratio — 590)

### Internal Linking FROM This Page
Link to at least these pages naturally in content:
- / (homepage — "explore dependency ratios in the country table")
- /japan (highest old-age dependency)
- /italy (aging population)
- /germany (aging)
- /south-korea (rapidly aging)
- /niger (highest youth dependency)
- /nigeria (youth bulge)
- /uganda (youth bulge)
- /democratic-republic-of-the-congo (high dependency)
- /qatar (lowest dependency — migrant workers)
- /united-arab-emirates (lowest dependency)
- /united-states (moderate/balanced)
- /china (transitioning)
- /india (demographic dividend)
- /brazil (demographic dividend)
- /generation-age-ranges-calculator (link to generations page — "see how generations map to dependency groups")
- /compare (compare demographics between countries)

### Open Graph Tags
- og:title, og:description, og:url, og:type: website

### Canonical URL
https://populationpyramids.org/dependency-ratio-calculator

---

## TARGET KEYWORDS (use naturally in content)

### Primary (must appear in H1, meta title, first paragraph):
- dependency ratio (6.6K)
- dependency ratio calculator (20)

### High-Value Secondary (MUST target with dedicated H2 or prominent mention):
- economically active population (74K — this is the big one, give it a full section)
- what is dependency ratio (1.9K)
- working age population (320)

### Secondary (use in H2s and body):
- youth dependency ratio (590)
- old age dependency ratio (590)
- dependency ratio formula (590)
- dependency ratio example (590)
- elderly dependency ratio (590)
- age dependency ratio (390)
- dependency ratio united states (260)

### Long-tail (use in FAQ and examples):
- dependency ratio by country (30)
- old age dependency ratio by country (10)
- dependency ratio by state (aim for this even if low volume now)
- population dependency ratio (20)
- old age dependency ratio formula (20)
- old age dependency ratio definition (20)
- working age population by country (10)
- economically active population by country (10)
- labor force participation by age (110)

---

## COMPETITIVE ADVANTAGE — What Makes This Page #1

Current SERP results are all generic text explainers (MasterClass, Wikipedia, WallStreetMojo) or bare-bones calculators (Calculator Academy). NONE of them have:

1. Real per-country data for 195 countries from UN WPP
2. Interactive map visualization
3. Country comparison tool
4. Historical trend charts
5. Projection data showing future dependency ratios
6. Youth vs old-age breakdown with actual numbers
7. Combined dependency ratio + economically active population data

Your page has ALL of this. The calculator with real data is unbeatable. The "economically active population" section alone targets a 74K/mo keyword that nobody in the dependency ratio SERP is capturing.

---

## QUALITY CHECKLIST (verify before committing)

- [ ] All three calculator modes work correctly (custom input, country lookup, compare)
- [ ] All dependency ratios match the homepage table values exactly (same data source, same calculation)
- [ ] Country dropdown has correct flags for all 195 countries
- [ ] URL params work: ?country=japan and ?compare=japan,nigeria
- [ ] Sortable table works with search and region filter
- [ ] All 5 examples use REAL numbers calculated from actual data — zero made-up numbers
- [ ] "Economically Active Population" section prominently targets the 74K keyword
- [ ] 10+ internal links to country pages
- [ ] 5+ external links to authoritative sources
- [ ] FAQPage + WebApplication + BreadcrumbList JSON-LD schemas are valid
- [ ] All FAQ answers are self-contained and citable
- [ ] Page is fully responsive (mobile-first)
- [ ] Page matches existing site design exactly
- [ ] No existing pages are broken
- [ ] Meta title under 60 chars, meta description under 160 chars
- [ ] Historical trend chart shows real data for at least 1950-2025
- [ ] No paragraph exceeds 3 sentences
