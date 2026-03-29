# CC BRIEF #04: Population Growth Rate Calculator & Country Rankings
# URL: /population-growth-rate-calculator
# Combined target: ~68K/mo (growth rate keywords) + ~19K/mo (projection keywords) = ~87K/mo
# Priority: HIGH — 100% buildable from existing data, zero external data needed

---

## ⚠️ SAFETY RULES (live site — read first)

1. Do NOT modify any existing pages, components, routes, data files, or config.
2. Create this as a NEW page only. New files only.
3. Match the existing site's design system exactly. Study existing pages first.
4. Test that existing pages still work after adding this page.
5. If unsure about anything, ask before changing.

---

## STEP 1: DATA VERIFICATION (do this first, report back)

This page needs total population per country over time. Your site already has this — the animated pyramid slider goes from 1950 to 2025, meaning you have annual or periodic population totals.

Verify:
1. Find the population data files. You need **total population by country by year** (or 5-year period).
2. Confirm you have data from 1950 to at least 2024/2025.
3. Check if you have **projection data** (future population to 2050 or 2100). The UN WPP includes medium-variant projections. If available, this page can also cover "world population 2050" queries (19K/mo bonus).
4. The homepage already shows "Growth Since 2000" as a percentage column. Find how that's calculated and use the same data source.
5. Report back what you found before building.

---

## STEP 2: THE INTERACTIVE TOOL (above the fold)

### Three-Tab Calculator

**Tab A: "Growth Rate Calculator" (custom input)**

Two sub-modes (toggle between them):

**Mode 1: Calculate Growth Rate**
Inputs:
- Starting population (number input)
- Ending population (number input)
- Number of years (number input)

Outputs (calculate live):
- Annual growth rate: ((P_end / P_start)^(1/years) - 1) × 100 → show as percentage
- Total change: P_end - P_start (absolute number)
- Total % change: ((P_end - P_start) / P_start) × 100
- Doubling time: 70 / growth rate (Rule of 70) → show in years
- Visual: simple line showing exponential growth at that rate

**Mode 2: Project Future Population**
Inputs:
- Current population (number input)
- Annual growth rate % (number input)
- Years into future (number input, or dropdown: 5, 10, 25, 50, 100)

Outputs:
- Projected population: P × (1 + r)^t
- Population added: projected - current
- Doubling time: 70 / rate
- Visual: projected growth curve

**Tab B: "Growth Rate by Country" (real data lookup)**

- Country dropdown (with flags, default: 🌍 World)
- On select, show:
  - Current population (latest year from data)
  - Annual growth rate (calculate from most recent two data points)
  - Growth since 2000 (% change — same as homepage)
  - Growth since 1950 (% change)
  - Population change last decade (absolute number)
  - Doubling time at current rate (or "Population shrinking" if negative)
  - Status badge: "Growing" (green) / "Stable" (yellow) / "Declining" (red)
  - **Historical population chart**: line chart 1950 → present with actual data points
  - **Projected population chart**: dashed line extending to 2050/2100 IF projection data is available
  - Comparison line: "vs World average growth rate of X%"

**Tab C: "Compare Countries"**

- Two country dropdowns side by side
- Overlay both population trend lines on one chart (normalized to index=100 at 1950, or absolute with dual axes)
- Table comparing: current pop, growth rate, growth since 2000, doubling time
- Key insight text: "[Country A] grew X% since 2000 while [Country B] grew Y%"

### URL Parameter Support
- /population-growth-rate-calculator?country=nigeria → auto-selects Nigeria in Tab B
- /population-growth-rate-calculator?compare=nigeria,japan → auto-loads Tab C
- Page should read URL params and auto-calculate on load for shareability

---

## STEP 3: RANKED DATA TABLE

Below the calculator, full sortable table:

| Rank | Country (flag) | Population | Annual Growth Rate | Growth Since 2000 | Growth Since 1950 | Doubling Time | Status |
|------|----------------|------------|-------------------|-------------------|-------------------|---------------|--------|

- Sortable by every column (default sort: growth rate descending)
- Searchable by country name
- Filterable by region (Africa, Americas, Asia, Europe, Oceania)
- Filterable by status: Growing / Stable / Declining
- Color-code growth rate: dark green (high growth) → yellow (low) → red (declining)
- Status column: 📈 Growing / ➡️ Stable / 📉 Declining
- Click any row → selects country in Tab B above
- ALL numbers calculated from real population data in the project

**Define thresholds:**
- Growing: annual growth rate > 0.5%
- Stable: -0.5% to 0.5%
- Declining: < -0.5%

---

## STEP 4: CHOROPLETH MAP

World map colored by population growth rate.

- Color scale: red (declining, < 0%) → yellow (~0-1%) → green (high growth, >2%)
- Hover: country name + growth rate + population
- Click: selects country in calculator
- Toggle: "Growth Rate" / "Growth Since 2000" / "Absolute Population Change"

---

## STEP 5: WRITTEN CONTENT

### Writing Rules
- **3 sentences max per paragraph.** No exceptions.
- **Real data in every section.** Every number from actual dataset.
- **Internal links**: 15+ links to country pages.
- **External links**: 5-8 to UN, World Bank.
- **Front-load answers** — first sentence = direct, citable fact.

### Content Sections

**H1: "Population Growth Rate by Country 2026: Calculator & Rankings"**

**H2: "World Population Growth Rate in 2026"**
- First sentence (AI-citable): "The world population growth rate in [year] is approximately [X]% per year, adding roughly [Y] million people annually to a global population of [Z] billion."
- How this has changed: peak growth rate was ~2.1% in 1968, now it's ~0.9% (verify from your data — calculate world pop growth rate from your annual totals)
- Current world population from your data
- 2-3 paragraphs max

**H2: "How to Calculate Population Growth Rate (Formula)"**
- Annual growth rate formula: ((P2/P1)^(1/t) - 1) × 100
- Explain each variable
- Doubling time formula: 70 / growth rate (Rule of 70)
- Simple example with small numbers first
- Then real example using actual country data

**H2: "5 Population Growth Examples Using Real Data"**

Calculate ALL numbers from your actual dataset:

**Example 1: Nigeria — Africa's Population Explosion**
"Nigeria's population grew from [X] in 2000 to [Y] in [latest year], an annual growth rate of [Z]%.
At this rate, Nigeria's population doubles every [D] years.
Growth rate calculation: (([Y] / [X])^(1/[years]) - 1) × 100 = [Z]%
Doubling time: 70 / [Z] = [D] years"
→ Link to /nigeria

**Example 2: Japan — Population Decline in Action**
Show real numbers. Negative growth rate. No doubling time — population shrinking.
→ Link to /japan

**Example 3: India — Surpassing China**
India vs China growth comparison with real numbers.
→ Link to /india

**Example 4: United States — Moderate Growth**
US growth rate from data + context.
→ Link to /united-states

**Example 5: United Arab Emirates — Fastest Growth Through Migration**
UAE's explosive growth from data — likely among the highest % growth since 2000.
→ Link to /united-arab-emirates

ALL NUMBERS FROM ACTUAL DATA.

**H2: "Fastest Growing Countries by Population"**
- Top 15 countries by growth rate (from data)
- Brief context for each
- Internal links to each country page

**H2: "Countries with Declining Populations"**
- All countries with negative growth rates (from data)
- Brief context: aging, emigration, low fertility
- Internal links

**H2: "Population Growth by Region"**
- Average growth rate per region calculated from data
- One paragraph per region

**H2: "Population Growth Over Time: Historical Trends"**
- World population milestones from your data
- Growth rate trend over time
- What's driving the slowdown

**H2: "World Population Projections: 2030, 2050, 2100"**
(ONLY include if projection data exists in your files. If not, skip entirely.)
- Projected world population at each milestone
- When population is projected to peak
- Which countries will be largest by 2050

**H2: "Population Doubling Time Explained"**
- Rule of 70 formula and why it works
- Real examples from data
- Historical context

**H2: "What Drives Population Growth?"**
- Natural increase vs net migration
- Fertility-driven growth (Africa)
- Migration-driven growth (Gulf states)
- Where both are declining (Eastern Europe, Japan)

**H2: "Frequently Asked Questions"**
12 FAQ items — each answer 2-3 sentences with real data:

1. "What is the population growth rate?" (2.9K) — definition + current world rate
2. "What is the population growth rate formula?" (2.9K) — formula + quick example
3. "What is the US population growth rate?" (2.9K) — real number from data
4. "What is the world population growth rate?" (1.6K) — real number + trend
5. "Which countries have the fastest growing populations?" (390) — top 3 from data
6. "Which countries have shrinking populations?" (1.3K) — list from data + count
7. "What is population doubling time?" — Rule of 70 definition + example
8. "What will the world population be in 2050?" (1.3K) — answer if data available, or cite UN estimate
9. "Is world population growth slowing down?" — yes + data showing decline from peak
10. "What is the population growth rate of China?" — real number from data
11. "What is the population growth rate of India?" — real number from data
12. "What is natural population increase?" — definition, births minus deaths

---

## STEP 6: SEO & TECHNICAL

### JSON-LD Structured Data
1. **FAQPage schema** — all 12 FAQ items
2. **WebApplication schema** — for the calculator
3. **Dataset schema** — UN WPP source
4. **BreadcrumbList schema** — Home > Population Growth Rate Calculator

### Meta Tags
```
title: "Population Growth Rate Calculator & Rankings 2026"
description: "Calculate population growth rate and doubling time for any country. See 195 countries ranked by growth rate with real UN data, historical charts, and projections."
```

### Internal Linking FROM This Page
- / (homepage — growth column)
- /nigeria, /japan, /india, /china, /united-states, /united-arab-emirates, /qatar (examples)
- /russia, /ukraine, /bulgaria, /lithuania, /latvia (declining populations)
- /ethiopia, /democratic-republic-of-the-congo, /tanzania (fast growing)
- /germany, /south-korea, /italy (aging/low growth)
- /generation-age-ranges-calculator
- /dependency-ratio-calculator
- /compare

### Canonical URL
https://populationpyramids.org/population-growth-rate-calculator

---

## TARGET KEYWORDS

### Primary (H1, meta title, first paragraph):
- population growth rate (2.9K)
- population growth rate by country (1.3K)
- population growth calculator (1K)

### High-Value Secondary:
- world population growth rate (1.6K)
- population decline countries / shrinking population countries (1.3K each)
- american population growth rate (2.9K)
- population growth rate formula / formula for population growth (2.9K each)
- world population 2050 (1.3K — only if projection data available)
- population increase calculator (1K)

### Secondary:
- fastest growing countries population (390)
- population growth chart (720)
- negative population growth (480)
- doubling time (70)

### Long-tail (FAQ and examples):
- population growth rate of india / china / US
- current world population growth rate
- annual population growth rate formula
- rule of 70 population
- population doubling time calculator (50)
- exponential population growth calculator (40)
- countries with negative population growth (170)

---

## QUALITY CHECKLIST

- [ ] All three calculator tabs work (custom, country lookup, compare)
- [ ] Growth rates match homepage "Growth Since 2000" values (same data source)
- [ ] Growth rates CALCULATED from actual population data, not hardcoded
- [ ] Country dropdown has correct flags for all 195 countries
- [ ] Historical chart shows real data points 1950-present
- [ ] Doubling time correct (70/rate) and shows "Declining" for negative rates
- [ ] URL params work: ?country=nigeria, ?compare=nigeria,japan
- [ ] All 5 examples use REAL numbers from data
- [ ] All 12 FAQ answers contain real data
- [ ] Sortable table with search, region filter, and status filter
- [ ] 15+ internal links to country pages
- [ ] 5+ external links
- [ ] All JSON-LD schemas valid
- [ ] Page fully responsive
- [ ] Matches existing site design
- [ ] No existing pages broken
- [ ] No paragraph exceeds 3 sentences
- [ ] Projection section ONLY included if real data exists
