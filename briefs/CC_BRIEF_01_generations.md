# CC BRIEF #01: Generation Age Ranges & Calculator
# URL: /generations
# Target: 854,000 monthly searches
# Priority: BUILD FIRST (highest volume, zero external data needed)

---

## ⚠️ SAFETY RULES (live site — read first)

1. Do NOT modify any existing pages, components, routes, data files, or config.
2. Create this as a NEW page only. New files only.
3. Match the existing site's design system (fonts, colors, spacing, component patterns) exactly.
4. Study existing pages (especially country pages and /compare) to understand the tech stack, styling approach, data loading patterns, and layout before writing any code.
5. Test that existing pages still work after adding this page.
6. If you're unsure about anything, ask me before changing anything.

---

## STEP 1: DATA VERIFICATION (do this first, report back)

Before building anything, verify:

1. Find the UN WPP population data files in the project. You need **population by 5-year age group (0-4, 5-9, ... 95-99, 100+) by sex** for the world total and ideally per country for 2024 or 2025.
2. This data already powers the population pyramids on the site, so it must exist somewhere.
3. Report back: what files contain this data, what format, what years are available.
4. Do NOT proceed to building until data is confirmed.

---

## STEP 2: THE INTERACTIVE TOOL (above the fold)

### "What Generation Am I?" Calculator

**Input**: Single field — birth year (number input, range 1901-2026, with a big "Find My Generation" button)

**Output** (appears instantly below input):

1. **Generation name** — large, bold (e.g., "You are a Millennial")
2. **Birth year range** — of their generation (e.g., "Born 1981-1996")
3. **Your age in 2026** — calculated from input
4. **Your generation's global population** — calculated from UN WPP age group data (sum the relevant 5-year cohorts). This is REAL data. Use actual numbers from the dataset.
5. **% of world population** — their generation as share of total
6. **Visual highlight** — a mini horizontal bar chart or population pyramid snippet showing their generation highlighted among all generations

### Generation Definitions (hardcode these — Pew Research standard)

| Generation | Birth Years | Age in 2026 |
|---|---|---|
| Gen Alpha | 2013-2026 | 0-13 |
| Gen Z | 1997-2012 | 14-29 |
| Millennials (Gen Y) | 1981-1996 | 30-45 |
| Gen X | 1965-1980 | 46-61 |
| Baby Boomers | 1946-1964 | 62-80 |
| Silent Generation | 1928-1945 | 81-98 |
| Greatest Generation | 1901-1927 | 99+ |

### Mapping Generations to UN WPP Age Groups

To calculate each generation's population from 5-year cohort data:

- Gen Alpha (age 0-13 in 2026): cohorts 0-4, 5-9, 10-14 (note: 10-14 partially overlaps with Gen Z — use proportional split: ~3/5 of 10-14 cohort for Gen Alpha, ~2/5 for Gen Z. Document the approximation.)
- Gen Z (age 14-29): partial 10-14, full 15-19, 20-24, 25-29
- Millennials (age 30-45): cohorts 30-34, 35-39, 40-44 (and partial 45-49 — ~1/5 for Millennials)
- Gen X (age 46-61): partial 45-49, full 50-54, 55-59, partial 60-64
- Baby Boomers (age 62-80): partial 60-64, full 65-69, 70-74, 75-79, partial 80-84
- Silent Gen (age 81-98): partial 80-84, full 85-89, 90-94, 95-99
- Greatest Gen (age 99+): 100+ cohort

Use proportional allocation for partial overlaps based on age distribution within 5-year bands. This is an approximation — note it transparently in the methodology section.

### Per-Country Drill-Down

Below the global result, add a dropdown: "See generation sizes for:" → select any of the 195 countries → shows the same breakdown using that country's age data.

This is the key differentiator. Nobody else shows generation populations PER COUNTRY using real UN data.

---

## STEP 3: VISUAL — GENERATION TIMELINE CHART

Below the calculator, create an interactive visualization:

**Option A (preferred)**: Horizontal stacked bar chart or area chart showing all generations as colored bands with their population sizes. Each band is clickable to show details.

**Option B**: Interactive timeline with each generation as a colored segment on a horizontal axis (birth years), with population size shown as height or label.

Use the same chart library the site already uses (likely Chart.js based on the existing pyramid charts). Match colors and styling.

---

## STEP 4: DATA TABLE

Full sortable table below the chart:

| Generation | Birth Years | Age Range (2026) | Global Population | % of World | Largest Country |
|---|---|---|---|---|---|
| Gen Alpha | 2013-2026 | 0-13 | [from data] | [calc] | India |
| Gen Z | 1997-2012 | 14-29 | [from data] | [calc] | India |
| ... | ... | ... | ... | ... | ... |

All numbers from REAL UN WPP data. No made-up numbers.

---

## STEP 5: WRITTEN CONTENT

### Writing Rules (follow precisely)

- **3 sentences max per paragraph.** No exceptions. No walls of text.
- **Real data in every section.** Every claim must reference an actual number from the dataset.
- **Comprehensive and extensive.** Cover every angle a searcher might want.
- **Internal links**: Link to relevant country pages on the site (e.g., "Japan's aging population means Gen Z represents just X%" → link to /japan). Aim for 10-15 internal links to country pages scattered naturally throughout.
- **External links**: Link to authoritative sources — Pew Research (generation definitions), UN Population Division (data source), World Bank. Aim for 5-8 external links.
- **No filler.** Every sentence must inform or add value.
- **Use exact keyword phrases** naturally in headings and text. Don't keyword-stuff, but do use the primary terms.

### Content Sections (in this order, after the tool)

**Section 1: "Understanding Generation Age Ranges in 2026"**
- Define what generations are and why the boundaries matter
- Reference Pew Research as the authority on definitions
- State the global population (from your data) and how it's distributed across generations
- 2-3 paragraphs (3 sentences each max)

**Section 2: "Generation Breakdown: Population Sizes & Demographics"**
One subsection per generation (H2 for each), ordered youngest to oldest:

For EACH generation, write:
- Current age range in 2026
- Global population size (real number from data)
- % of world population
- Which countries have the largest share of this generation (calculate from per-country data)
- One unique demographic insight (e.g., "Gen Z is the first generation where Africa contributes more members than Europe")
- Internal link to the country with the most interesting data for that generation

Generations to cover (each gets its own H2):
1. **Gen Alpha (Born 2013-2026)** — the newest, most in developing nations
2. **Gen Z (Born 1997-2012)** — entering workforce, digital natives
3. **Millennials (Born 1981-1996)** — largest working-age generation?
4. **Generation X (Born 1965-1980)** — the "middle child" generation
5. **Baby Boomers (Born 1946-1964)** — aging wave, pension pressure
6. **Silent Generation (Born 1928-1945)** — surviving members

**Section 3: "5 Key Insights About Generations Worldwide"**
Five detailed, data-backed findings. Each one should be something surprising or highly quotable (AI visibility — LLMs love citing specific surprising facts). Examples of the KIND of insight (but use REAL numbers):
1. Which generation is the largest globally by population?
2. In which countries does Gen Z outnumber all other generations combined?
3. Where are Baby Boomers the largest share of population? (Japan, Italy, etc.)
4. How do generation sizes differ between Africa and Europe?
5. Which generation will shrink the fastest by 2050? (use projection data if available)

**Section 4: "How We Calculate Generation Populations"**
- Explain the methodology: UN WPP 5-year cohorts mapped to generation boundaries
- Note the proportional allocation for partial overlaps
- Link to UN Population Division as data source
- 2 paragraphs max

**Section 5: "Generations by Country"**
- Brief text explaining that generation sizes vary dramatically by country
- Encourage using the dropdown in the tool above
- Highlight 3-4 contrasting examples (e.g., Nigeria vs Japan vs USA)
- Internal links to each country page mentioned

**Section 6: FAQ**
Write 10 FAQ items. Each answer: 2-3 sentences max, uses real data where possible. Target these exact search queries:

1. "What are the generation age ranges in 2026?"
2. "What age is Gen Z in 2026?" (target: gen z age range — 135K/mo)
3. "What age is a millennial in 2026?" (target: millennial age range — 49.5K/mo)
4. "What age is Gen X in 2026?" (target: gen x age range — 74K/mo)
5. "What years are Gen Z?" (target: gen z years range — 14.8K/mo)
6. "What is the Gen Z cutoff year?" (target: gen z cutoff — 5.4K/mo)
7. "What generation is 1996?" / "What generation is 1997?"
8. "How many Gen Z are there in the world?"
9. "What is Gen Alpha age range?"
10. "What generation am I if I was born in [year]?" (this is what the calculator answers)

### Structured Data (JSON-LD)

Add to the page `<head>`:

1. **FAQPage schema** — for all 10 FAQ items
2. **WebApplication schema** — for the calculator tool
3. **Dataset schema** — referencing UN WPP as data source

---

## STEP 6: SEO & TECHNICAL

### Meta Tags
```
title: "Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator"
description: "What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha."
```

### Internal Linking FROM This Page
Link to at least these pages (weave naturally into content):
- /japan (aging population, boomers dominant)
- /india (youngest population, Gen Alpha/Z heavy)
- /nigeria (youth bulge)
- /united-states (generation size comparisons)
- /germany (aging)
- /china (one-child policy generation effects)
- /brazil (demographic transition)
- /south-korea (lowest fertility, Gen Alpha tiny)
- / (homepage — "explore population pyramids for all 195 countries")
- /compare (compare generation structures between countries)

### Internal Linking TO This Page (do later)
After this page is live, add links from:
- Homepage (if there's a "tools" or "explore" section)
- Country pages (where generational data is mentioned)
- Blog posts about aging/youth demographics
(Note: do this in a SEPARATE step, not in this build)

### Canonical URL
`https://populationpyramids.org/generations`

### Open Graph Tags
- og:title, og:description (same as meta)
- og:type: website
- og:url: https://populationpyramids.org/generations

---

## TARGET KEYWORDS (use naturally throughout content)

### Primary (must appear in H1, meta title, first paragraph):
- generation age ranges (volume combined ~854K/mo across variants)

### Secondary (use in H2s and body text):
- gen z age range / age range for gen z (135K)
- gen x age range (74K)
- millennial age range (49.5K)
- gen z years range / gen z year range (14.8K)
- gen z cutoff (5.4K)
- baby boomer age range (2.9K)
- gen alpha age range (2.9K)
- what generation am i (intent match — the calculator answers this)
- generation chart (1.9K)
- generation years (1.6K)
- millennial generation years range (4.4K)

### Long-tail (use in FAQ and body):
- what year does gen z start (1.3K)
- what year does gen z end (1K)
- millennial vs gen z age (880)
- generation breakdown by year (590)
- oldest millennial age (480)
- youngest boomer age (480)
- gen z age range 2026

---

## QUALITY CHECKLIST (verify before committing)

- [ ] Calculator works: enter any birth year 1901-2026, get correct generation + real population data
- [ ] All population numbers come from actual UN WPP data files in the project — zero hardcoded fake numbers
- [ ] Per-country dropdown works for all 195 countries
- [ ] All 10 FAQ items have concise, data-backed answers
- [ ] No paragraph exceeds 3 sentences
- [ ] 10+ internal links to country pages
- [ ] 5+ external links to authoritative sources
- [ ] FAQPage JSON-LD schema is valid (test at schema.org validator)
- [ ] Page is fully responsive (mobile-first)
- [ ] Page matches existing site design exactly
- [ ] No existing pages are broken
- [ ] Meta title under 60 chars, meta description under 160 chars
- [ ] Page loads fast (no unnecessary heavy libraries)
