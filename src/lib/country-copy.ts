/**
 * Answer-first title, meta description and lead paragraph for country pages
 * (T2). Shared by the page component, generateMetadata, and the verify script
 * so all three produce byte-identical copy.
 */
import { popShort, popWords, popExact, ordinal, formatShare, rankShort } from './country-format';
import { sentenceStart, titleName } from './country-names';
import { worldPopulation } from './world-population';

export interface CountryStats {
  slug: string;
  /** site display name */
  name: string;
  year: number;
  population: number;
  rank: number | null;
  sharePct: number | null;
  /** % under 15 (youth) */
  u15: number | null;
  /** % 65 and over (elderly) */
  o65: number | null;
  /** males per 100 females */
  sexRatio: number | null;
}

const TITLE_MAX = 62;
const DESC_MAX = 160;
const WPP_HREF = 'https://population.un.org/wpp/';

/** Vatican City has no WPP series — fixed, non-WPP copy (T2 Step 8). */
export const VATICAN = {
  slug: 'vatican-city',
  title: 'Vatican City Population Pyramid: 882 Residents, 673 Citizens',
  description:
    'Vatican City had 882 residents and 673 citizens on 31 December 2024 (Vatican statistics); 458 citizens live inside the walls, including 120 Swiss Guards.',
  h1: 'Vatican City Population Pyramid',
  sourceHref:
    'https://www.vaticanstate.va/en/state-and-government/general-informations/population.html',
  answerText:
    "Vatican City is the world's smallest country by both area (0.44 km²) and population. Official Vatican statistics count 882 residents and 673 citizens as of 31 December 2024; 458 of the citizens live inside the walls, including 120 members of the Pontifical Swiss Guard. The age-and-sex chart on this page is a model estimate, not an official count.",
};

/** First title variant that fits within 62 characters. */
export function countryTitle(
  slug: string,
  year: number,
  population: number
): { title: string; variant: number } {
  const tn = titleName(slug);
  const p = popShort(population);
  const variants = [
    `${tn} Population Pyramid ${year}: ${p} People by Age & Sex`,
    `${tn} Population Pyramid ${year}: ${p} People by Age`,
    `${tn} Population Pyramid ${year}: ${p} People`,
    `${tn} Population Pyramid ${year}`,
  ];
  for (let i = 0; i < variants.length; i++) {
    if (variants[i].length <= TITLE_MAX) return { title: variants[i], variant: i + 1 };
  }
  return { title: variants[variants.length - 1], variant: variants.length };
}

/** Meta description ≤160 chars; drops the sex-ratio clause if needed; flags missing data. */
export function countryDescription(s: CountryStats): { description: string; missing: boolean } {
  const hasCore = s.rank != null && s.u15 != null && s.o65 != null;
  if (!hasCore) {
    return {
      description: `${sentenceStart(s.name)} population pyramid for ${s.year}: age and sex structure from UN World Population Prospects 2024.`,
      missing: true,
    };
  }
  const rs = rankShort(s.rank as number);
  const u15 = (s.u15 as number).toFixed(1);
  const o65 = (s.o65 as number).toFixed(1);
  const lead = `${sentenceStart(s.name)} has ${popWords(s.population)} people in ${s.year} (UN WPP 2024), ${rs}.`;
  if (s.sexRatio != null) {
    const withSex = `${lead} ${u15}% are under 15, ${o65}% are 65+, with ${s.sexRatio.toFixed(1)} males per 100 females.`;
    if (withSex.length <= DESC_MAX) return { description: withSex, missing: false };
  }
  return { description: `${lead} ${u15}% are under 15 and ${o65}% are 65+.`, missing: false };
}

export interface AnswerParts {
  /** text before the linked WPP phrase */
  head: string;
  linkText: string;
  linkHref: string;
  /** text after the linked WPP phrase */
  tail: string;
}

/**
 * Structured lead paragraph. `head` + `linkText` + `tail` is the plain text;
 * the page renders `linkText` as an <a href={linkHref}>. Any clause whose value
 * is missing is dropped; never emits undefined/NaN/0.00%.
 */
export function countryAnswer(s: CountryStats): AnswerParts | null {
  if (!s.population || !Number.isFinite(s.population)) return null;
  const verb = s.year <= 2023 ? 'estimate' : 'projection';
  const head = `${sentenceStart(s.name)} has a population of ${popExact(s.population)} in ${s.year}, according to the `;
  let tail = ` (${verb} for 1 July).`;
  if (s.rank != null) {
    const nth = s.rank === 1 ? 'largest' : `${ordinal(s.rank)}-largest`;
    let s2 = ` That is the ${nth} population in the world`;
    const world = worldPopulation(s.year);
    if (s.sharePct != null && world != null) {
      s2 += ` and ${formatShare(s.sharePct)} of the global total of ${popWords(world)}`;
    }
    tail += `${s2}.`;
  }
  if (s.u15 != null && s.o65 != null) {
    let s3 = ` Children under 15 make up ${s.u15.toFixed(1)}% of the population and people aged 65 and over ${s.o65.toFixed(1)}%`;
    if (s.sexRatio != null) s3 += `, with ${s.sexRatio.toFixed(1)} males for every 100 females`;
    tail += `${s3}.`;
  }
  return { head, linkText: 'UN World Population Prospects 2024', linkHref: WPP_HREF, tail };
}

/** Plain-text lead paragraph (link rendered inline as its text). */
export function countryAnswerText(s: CountryStats): string {
  const p = countryAnswer(s);
  return p ? `${p.head}${p.linkText}${p.tail}` : '';
}
