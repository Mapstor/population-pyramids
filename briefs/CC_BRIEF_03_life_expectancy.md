# CC BRIEF #03: Life Expectancy by Country — Rankings, Gender Gap & Global Data
# URL: /life-expectancy
# Combined target: ~1.6M monthly searches (general + by country + by gender clusters)
# Priority: HIGHEST IMPACT — single biggest traffic opportunity on the site

---

## ⚠️ SAFETY RULES (live site — read first)

1. Do NOT modify any existing pages, components, routes, data files, or config.
2. Create this as a NEW page only. New files only.
3. Match the existing site's design system exactly. Study existing pages first.
4. Test that existing pages still work after adding this page.
5. If unsure about anything, ask before changing.

---

## WHY THIS PAGE MATTERS

This is a hub page targeting the ENTIRE life expectancy keyword universe (excluding calculator, which becomes a separate page later). It combines:
- "average life expectancy" (22.2K/mo × many variants = ~720K total)
- "life expectancy by country" (14.8K × many variants = ~168K total)
- "average age of death for men/women" (14.8K + 5.4K × variants = ~324K total)
- "expected life span" / "expected age of death" (74K each)

Nobody has a single page that answers ALL of these queries with real data, interactive tools, and comprehensive content. This page does.

---

## STEP 1: DATA VERIFICATION (do this first, report back)

You need life expectancy at birth (e0) data from UN WPP. This is a core WPP indicator. Find:

1. **Life expectancy at birth — BOTH SEXES** — for all 195 countries, latest year (2024 or 2025)
2. **Life expectancy at birth — MALE** — same countries, same year
3. **Life expectancy at birth — FEMALE** — same countries, same year
4. **Historical life expectancy** — same indicator going back to 1950 (5-year periods is fine)
5. **Projected life expectancy** — medium variant projections to 2050 or 2100 if available
6. **World/regional averages** — global, Africa, Americas, Asia, Europe, Oceania

This data is in UN WPP files typically named something like:
- WPP2024_MORT_F01_1_LIFE_EXPECTANCY_AT_BIRTH_BOTH_SEXES.xlsx
- Or in a combined CSV/JSON the site already processes

Check what format the site uses. Report back before building.

---

## STEP 2: THE INTERACTIVE TOOL (above the fold)

### Life Expectancy Lookup Tool

**Layout**: Clean, compact. One row with inputs, results appear below.

**Inputs** (all in one row):
- Country dropdown (with flags, default: 🌍 World) 
- Gender toggle: Both / Male / Female (pill-style buttons)

**Results** (appear instantly on selection):

Card layout showing:
1. **Life expectancy**: Large number with "years" label (e.g., "73.2 years")
2. **Global rank**: "Ranked #X of 195 countries" (only when a specific country is selected, not for World)
3. **Male life expectancy**: X years
4. **Female life expectancy**: X years
5. **Gender gap**: X years (female - male, always positive typically)
6. **Change since 1950**: "+X years" (difference from 1950 value to current)
7. **Visual**: Small sparkline or mini line chart showing this country's life expectancy trend 1950→present

**Compare mode**: 
- "Compare with:" second country dropdown appears
- Shows both countries side by side

**URL parameter support**:
- /life-expectancy?country=japan → auto-selects Japan
- /life-expectancy?compare=japan,nigeria → comparison view
- /life-expectancy?gender=male → pre-selects male tab

---

## STEP 3: CHOROPLETH MAP

World map colored by life expectancy. Place it right below the lookup tool.

- Color scale: red (low, ~50 years) → yellow (~65) → green (high, ~85)
- Toggle: Both Sexes / Male / Female (same gender toggle as tool above — synced)
- Hover: country name + life expectancy value
- Click country: selects it in the lookup tool above (scroll up)
- Match any existing map styling on the site, or create clean new style

---

## STEP 4: RANKED DATA TABLE

Full sortable table below the map:

| Rank | Country (flag) | Life Expectancy (Both) | Male | Female | Gender Gap | Change Since 1950 | Region |
|------|----------------|------------------------|------|--------|------------|-------------------|--------|

- Sortable by every column
- Searchable by country name
- Filterable by region (Africa, Americas, Asia, Europe, Oceania)
- Color-coded life expectancy cells (red→green gradient)
- Click any row → selects country in the lookup tool
- ALL data from real UN WPP dataset

---

## STEP 5: WRITTEN CONTENT

### Writing Rules (same as all briefs)
- **3 sentences max per paragraph.** No exceptions.
- **Real data in every section.** Every claim uses actual numbers from dataset.
- **Internal links**: 15+ links to country pages.
- **External links**: 5-8 to UN, WHO, World Bank, CDC.
- **Front-load answers** — first sentence = direct, citable fact.

### Content Sections

**H1: "Life Expectancy by Country 2026: Global Rankings & Gender Data"**

**H2: "Average Life Expectancy Worldwide"**
- First sentence: "The average global life expectancy in [year] is [X] years — [Y] years for males and [Z] years for females, based on UN World Population Prospects 2024 data." ← This is what Google/AI will extract. Make it perfect.
- How this has changed: global LE was ~47 years in 1950, now it's ~73 (use real numbers from data)
- Regional differences in one sentence: "Life expectancy ranges from [lowest region avg] in [region] to [highest region avg] in [region]"
- 2-3 paragraphs max

**H2: "Countries with Highest Life Expectancy"**
- Top 10 countries by life expectancy with actual numbers from data
- Brief insight for each: what drives their longevity (healthcare, diet, etc.)
- Table or formatted list with real numbers
- Internal links to each country page
- Likely includes: Japan, Switzerland, South Korea, Singapore, Italy, Australia, Spain, Iceland, Israel, Sweden (but USE ACTUAL DATA — don't guess the order)

**H2: "Countries with Lowest Life Expectancy"**
- Bottom 10 countries with actual numbers
- Brief context for each (conflict, disease burden, poverty)
- Internal links to each country page
- Likely includes: Chad, Nigeria, Sierra Leone, Central African Republic, Lesotho (USE ACTUAL DATA)

**H2: "Life Expectancy for Men vs Women: The Gender Gap"**
(This section targets the huge 324K/mo gender keyword cluster)
- First sentence: "Women live longer than men in virtually every country. The global average life expectancy is [X] years for females and [Y] years for males — a gap of [Z] years." ← AI-citable.
- Why the gap exists: biological factors, behavioral differences, occupational hazards
- Countries with LARGEST gender gap (use real data — likely Russia, Belarus, Lithuania where male LE is much lower due to alcohol/lifestyle)
- Countries with SMALLEST gender gap (use real data)
- Has the gap been growing or shrinking over time?
- 3-4 paragraphs, all with real numbers

**H2: "Average Age of Death for Men"**
(Directly targets "average age of death for men" — 14.8K/mo and many variants)
- First sentence: "The average age of death for men worldwide is approximately [X] years, based on male life expectancy at birth data." 
- Top 10 countries for male life expectancy (from data)
- Bottom 10 countries for male life expectancy
- US male life expectancy specifically (targets "average life expectancy american male" — 14.8K)
- Internal links

**H2: "Average Age of Death for Women"**
(Targets "average age of death for women" — 5.4K/mo and variants)
- Same structure as men's section
- Top/bottom countries
- US female life expectancy
- Why women outlive men everywhere

**H2: "Life Expectancy in the United States"**
(Targets "average american lifespan" — 40.5K/mo × 5 variants = ~200K)
- Current US life expectancy (both, male, female) from UN WPP data
- How US compares to other developed nations (rank it)
- US life expectancy trend over time (mention recent decline if visible in data)
- Note: a deeper US page with state-level data will come later. This is the overview.
- Internal link to /united-states country page

**H2: "How Life Expectancy Has Changed Over Time"**
- Global trend: 1950 (~47 years) → 1980 → 2000 → 2025 (use real data points)
- Which regions improved most dramatically
- Which countries had the biggest gains
- Any countries where LE declined (HIV crisis in Sub-Saharan Africa in 1990s-2000s, if visible in data)
- Reference the historical trend chart in the tool above

**H2: "5 Detailed Examples: Life Expectancy Analysis"**
Five comprehensive examples using REAL data from dataset:

**Example 1: Japan — World's Highest Life Expectancy**
"Japan has a life expectancy of [X] years ([Y] for males, [Z] for females). In 1950, Japanese life expectancy was just [A] years — an increase of [B] years in 75 years. Japan's gender gap of [C] years is [above/below] the global average. With [D]% of its population aged 65+, Japan's longevity creates the world's most aged society."
→ Link to /japan

**Example 2: Sierra Leone or Chad — Lowest Life Expectancy**
Same depth with real numbers. What drives low LE.
→ Link to country page

**Example 3: Russia — The Male Life Expectancy Crisis**  
Russia likely has one of the biggest gender gaps in LE. Show real numbers for male vs female. Historical context.
→ Link to /russia

**Example 4: South Korea — Fastest Rising Life Expectancy**
If data shows dramatic improvement from 1950 to present, highlight it with real numbers.
→ Link to /south-korea  

**Example 5: United States — A Developed Country Anomaly**
US life expectancy relative to other wealthy nations. Why it's lower despite high healthcare spending.
→ Link to /united-states

ALL numbers from actual data. Calculate everything from the dataset.

**H2: "Life Expectancy by Region"**
- Africa average: [X] years
- Americas average: [X] years
- Asia average: [X] years
- Europe average: [X] years
- Oceania average: [X] years
- Calculate these from the data (population-weighted averages or simple averages — specify which you use)

**H2: "What Affects Life Expectancy?"**
- Healthcare access
- GDP and economic development
- Diet and lifestyle
- Conflict and political stability
- Disease burden (HIV, malaria in low-LE countries)
- Keep it factual, reference the data patterns visible in the rankings
- External links to WHO, World Bank

**H2: "Frequently Asked Questions"**
12 FAQ items. Each answer: 2-3 sentences, real data, self-contained.

1. "What is the average life expectancy?" (22.2K/mo cluster)
   "The average global life expectancy is [X] years as of [year]. Women live an average of [Y] years while men live [Z] years. Life expectancy varies dramatically by country, from [lowest] in [country] to [highest] in [country]."

2. "What is the average life expectancy by country?" (14.8K/mo)
   "[Country] has the highest life expectancy at [X] years, while [Country] has the lowest at [Y] years. See the full ranked table above for all 195 countries."

3. "What is the expected age of death?" (74K/mo!)
   "The expected age of death — measured as life expectancy at birth — averages [X] years globally. This figure represents the average number of years a newborn would live under current mortality conditions."

4. "What is the expected life span?" (74K/mo!)
   "The expected human lifespan globally is [X] years. This has nearly doubled since 1950 when the global average was approximately [Y] years."

5. "What is the average age of death for men?" (14.8K/mo)
   "The average age of death for men globally is [X] years. The highest male life expectancy is in [country] at [Y] years, while the lowest is in [country] at [Z] years."

6. "What is the average age of death for women?" (5.4K/mo)
   "The average age of death for women globally is [X] years — approximately [gap] years longer than men."

7. "What is the average American lifespan?" (40.5K/mo!)
   "The average American lifespan is [X] years — [Y] for males and [Z] for females. This ranks the United States [#rank] globally, below many other developed nations."

8. "Which country has the highest life expectancy?" (6.6K/mo)
   Answer with real data.

9. "Which country has the lowest life expectancy?" (2.4K/mo)
   Answer with real data.

10. "Why do women live longer than men?" 
    Brief answer citing biological and behavioral factors + the global gap number.

11. "Has life expectancy been increasing or decreasing?"
    Global trend answer with 1950 vs now numbers.

12. "What is the life expectancy gender gap?"
    Definition + global number + countries with biggest/smallest gap.

---

## STEP 6: SEO & TECHNICAL

### JSON-LD Structured Data
1. **FAQPage schema** — all 12 FAQ items
2. **WebApplication schema** — for the lookup/comparison tool  
3. **Dataset schema** — UN WPP source
4. **BreadcrumbList schema** — Home > Life Expectancy

### Meta Tags
```
title: "Life Expectancy by Country 2026: Men vs Women Rankings"
description: "Average life expectancy for 195 countries with male vs female data. Global average is [X] years. See rankings, gender gap analysis, and historical trends from UN data."
```
(Fill in [X] with actual number after data verification)

### H2s — Keyword Priority
Every H2 should start with or contain a target keyword phrase:
- "Average Life Expectancy Worldwide" → average life expectancy (22.2K)
- "Countries with Highest Life Expectancy" → highest life expectancy (6.6K)
- "Countries with Lowest Life Expectancy" → lowest life expectancy (2.4K)
- "Life Expectancy for Men vs Women: The Gender Gap" → men life expectancy / women life expectancy
- "Average Age of Death for Men" → average age of death for men (14.8K)
- "Average Age of Death for Women" → average age of death for women (5.4K)
- "Life Expectancy in the United States" → average american lifespan (40.5K)

### Internal Linking FROM This Page
Link to at least these pages naturally in content:
- / (homepage)
- /japan (highest LE)
- /switzerland, /south-korea, /singapore, /italy, /australia, /spain, /iceland (top LE countries — verify from data)
- /chad, /nigeria, /sierra-leone, /central-african-republic, /lesotho (low LE — verify from data)
- /russia (gender gap case study)
- /united-states (US section)
- /china, /india (major population countries)
- /germany (aging society)
- /south-africa (HIV impact on LE)
- /generation-age-ranges-calculator (generation page)
- /dependency-ratio-calculator (dependency page)
- /compare (compare tool)

### Open Graph & Canonical
- og:title, og:description, og:url
- Canonical: https://populationpyramids.org/life-expectancy

### URL Parameter Support
- /life-expectancy?country=japan
- /life-expectancy?compare=japan,nigeria
- /life-expectancy?gender=male

---

## TARGET KEYWORDS

### Primary (H1, meta title, first paragraph):
- life expectancy by country (14.8K)
- average life expectancy (22.2K)

### Mega-Volume (must appear prominently — these are the money keywords):
- expected life span (74K)
- expected age of death (74K)  
- average age for death (74K)
- average american lifespan (40.5K)
- average american life expectancy (40.5K)
- average age of death for men (14.8K)
- men life expectancy (14.8K)

### Secondary (H2s and body text):
- countries with highest life expectancy (6.6K)
- world life expectancy (2.9K)
- global life expectancy (2.9K)
- countries with lowest life expectancy (2.4K)
- average age of death for women (5.4K)
- women life expectancy (9.9K)
- average human life expectancy (8.1K)
- average life span by country (14.8K)

### Long-tail (FAQ and examples):
- life expectancy gender gap
- why do women live longer than men
- life expectancy over time
- life expectancy by region
- healthy life expectancy by country (210)
- male life expectancy by country (40)
- female life expectancy by country (10)

---

## COMPETITIVE ADVANTAGE

Current top SERP results for "life expectancy by country":
- Wikipedia (text table, no interactivity)
- Worldometer (basic table)
- World Bank (data download, terrible UX)
- Our World in Data (good charts but not focused)

None have: interactive lookup + choropleth map + gender comparison + historical trends + per-country deep links + 195 country pyramids as context. Your site uniquely connects life expectancy to population structure (pyramids). That's the moat.

---

## QUALITY CHECKLIST

- [ ] Lookup tool works for all 195 countries + World
- [ ] Gender toggle (Both/Male/Female) works correctly
- [ ] Compare mode works
- [ ] All life expectancy values come from actual UN WPP data — zero hardcoded
- [ ] Map renders correctly with proper color scale
- [ ] Table is sortable, searchable, filterable by region
- [ ] All 5 examples use REAL calculated numbers from data
- [ ] All 12 FAQ answers contain real data and are self-contained
- [ ] 15+ internal links to country pages
- [ ] 5+ external links to authoritative sources
- [ ] FAQ schema, WebApplication schema, BreadcrumbList schema valid
- [ ] URL params work: ?country=japan, ?compare=japan,nigeria, ?gender=male
- [ ] Page fully responsive
- [ ] Matches existing site design
- [ ] No existing pages broken
- [ ] Meta title under 60 chars
- [ ] No paragraph exceeds 3 sentences
- [ ] The "average American lifespan" query is clearly answered (40.5K/mo keyword)
- [ ] The "expected age of death" / "expected life span" queries are answered in first paragraph (74K each!)
