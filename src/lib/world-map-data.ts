import { cache } from 'react';
import { feature } from 'topojson-client';
import { geoEqualEarth, geoPath, geoCentroid, geoArea } from 'd3-geo';
import topology from 'world-atlas/countries-110m.json';
import countries from '@/data/countries.json';

const NAME_ALIAS: Record<string, string> = {
  'United States of America': 'USA',
  'Dem. Rep. Congo': 'COD',
  'Dominican Rep.': 'DOM',
  'Central African Rep.': 'CAF',
  'Eq. Guinea': 'GNQ',
  'eSwatini': 'SWZ',
  'Solomon Is.': 'SLB',
  'Czechia': 'CZE',
  'Bosnia and Herz.': 'BIH',
  'Macedonia': 'MKD',
  'S. Sudan': 'SSD',
};

const nameToCode: Map<string, string> = new Map();
for (const c of countries as Array<{ name: string; code: string }>) {
  nameToCode.set(c.name, c.code);
}
for (const [name, code] of Object.entries(NAME_ALIAS)) {
  nameToCode.set(name, code);
}

export interface MapFeature {
  isoAlpha3: string | null;
  name: string;
  path: string;
  centroid: [number, number] | null; // pixel coordinates of the main-landmass centroid
}

// Manual centroid overrides for countries where the geometric centroid falls
// in an awkward spot (water, the wrong landmass, etc.). Values are in lng/lat,
// projected at render time. These are eyeballed for the top-10 cases.
const CENTROID_OVERRIDE_LNGLAT: Record<string, [number, number]> = {
  USA: [-98, 39], // continental US center (Kansas)
  RUS: [60, 60], // European Russia center (away from sparsely populated Siberia)
  IDN: [113, -2], // central Borneo/Sulawesi area
  BRA: [-52, -10], // Brazilian central plateau
  AUS: [134, -25], // central Australia
  CAN: [-95, 60], // central Canada
};

function getMainLandCentroidPx(
  feature: any,
  projection: ReturnType<typeof geoEqualEarth>,
  code: string | null
): [number, number] | null {
  if (code && CENTROID_OVERRIDE_LNGLAT[code]) {
    const proj = projection(CENTROID_OVERRIDE_LNGLAT[code]);
    return proj ? [proj[0], proj[1]] : null;
  }
  if (!feature.geometry) return null;
  try {
    if (feature.geometry.type === 'Polygon') {
      const [lng, lat] = geoCentroid(feature);
      const proj = projection([lng, lat]);
      return proj && isFinite(proj[0]) && isFinite(proj[1]) ? [proj[0], proj[1]] : null;
    }
    if (feature.geometry.type === 'MultiPolygon') {
      let maxArea = 0;
      let mainGeom: any = null;
      for (const poly of feature.geometry.coordinates) {
        const polyGeom = { type: 'Polygon' as const, coordinates: poly };
        const area = geoArea(polyGeom);
        if (area > maxArea) {
          maxArea = area;
          mainGeom = polyGeom;
        }
      }
      if (!mainGeom) return null;
      const [lng, lat] = geoCentroid(mainGeom);
      const proj = projection([lng, lat]);
      return proj && isFinite(proj[0]) && isFinite(proj[1]) ? [proj[0], proj[1]] : null;
    }
  } catch {
    return null;
  }
  return null;
}

// Manual lng/lat for countries too small to appear in 110m topology.
// Used by getExtraMarkers() to plot pin badges on the world map for
// microstates and small island nations on /smallest-countries.
const SMALL_COUNTRY_LNGLAT: Record<string, [number, number]> = {
  'vatican-city': [12.45, 41.9],
  monaco: [7.42, 43.73],
  nauru: [166.93, -0.52],
  tuvalu: [179.2, -8.52],
  'san-marino': [12.45, 43.94],
  liechtenstein: [9.55, 47.17],
  'marshall-islands': [171.18, 7.13],
  'saint-kitts-and-nevis': [-62.78, 17.36],
  maldives: [73.22, 3.2],
  malta: [14.38, 35.94],
  // additional small countries
  palau: [134.58, 7.51],
  andorra: [1.52, 42.5],
  'antigua-and-barbuda': [-61.85, 17.06],
  barbados: [-59.55, 13.18],
  seychelles: [55.45, -4.68],
  singapore: [103.85, 1.35],
  kiribati: [173, 1.42],
  micronesia: [150.55, 6.92],
  dominica: [-61.37, 15.41],
  tonga: [-175.2, -21.18],
  'sao-tome-and-principe': [6.61, 0.19],
  grenada: [-61.68, 12.12],
  'saint-vincent-and-the-grenadines': [-61.18, 13.25],
  'cabo-verde': [-23.62, 16],
  samoa: [-172.1, -13.76],
  mauritius: [57.55, -20.34],
  comoros: [43.87, -11.65],
  luxembourg: [6.13, 49.61],
  brunei: [114.73, 4.5],
  'trinidad-and-tobago': [-61.5, 10.69],
  'saint-lucia': [-60.97, 13.91],
  bahrain: [50.55, 26.07],
  'equatorial-guinea': [10.27, 1.65],
  bahamas: [-77.4, 25.03],
  qatar: [51.18, 25.35],
};

export interface ExtraMarker {
  slug: string;
  x: number;
  y: number;
}

// Approximate lng/lat bounds for the regions where microstates cluster, used
// by getRegionView() to compute a fitted viewBox preset for one-click zoom.
const REGION_BOUNDS: Record<string, [number, number, number, number]> = {
  // [lngMin, lngMax, latMin, latMax]
  europe: [-12, 32, 34, 62],
  pacific: [125, 195, -25, 18],
  caribbean: [-90, -55, 9, 26],
  indianOcean: [38, 90, -25, 14],
};

export interface RegionView {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const getRegionView = cache(
  (region: string, width = 960, height = 480): RegionView | null => {
    const b = REGION_BOUNDS[region];
    if (!b) return null;
    const projection = geoEqualEarth()
      .scale(width / 6.4)
      .translate([width / 2, height / 2 - 10]);
    // Project bounding-box corners + sample points along edges so wrapped
    // regions (e.g. Pacific crossing the 180° meridian) bound correctly.
    const samples: Array<[number, number]> = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lng = b[0] + (b[1] - b[0]) * t;
      samples.push([lng, b[2]]);
      samples.push([lng, b[3]]);
      const lat = b[2] + (b[3] - b[2]) * t;
      samples.push([b[0], lat]);
      samples.push([b[1], lat]);
    }
    const projected: Array<[number, number]> = [];
    for (const s of samples) {
      const p = projection(s);
      if (p && isFinite(p[0]) && isFinite(p[1])) projected.push([p[0], p[1]]);
    }
    if (!projected.length) return null;
    const xs = projected.map((p) => p[0]);
    const ys = projected.map((p) => p[1]);
    const x0 = Math.min(...xs);
    const y0 = Math.min(...ys);
    const x1 = Math.max(...xs);
    const y1 = Math.max(...ys);
    const padX = (x1 - x0) * 0.08;
    const padY = (y1 - y0) * 0.08;
    const x = Math.max(0, x0 - padX);
    const y = Math.max(0, y0 - padY);
    const w = Math.min(width - x, x1 - x0 + padX * 2);
    const h = Math.min(height - y, y1 - y0 + padY * 2);
    return { x, y, w, h };
  }
);

export const getExtraMarkers = cache(
  (slugs: string[], width = 960, height = 480): ExtraMarker[] => {
    const projection = geoEqualEarth()
      .scale(width / 6.4)
      .translate([width / 2, height / 2 - 10]);
    const out: ExtraMarker[] = [];
    for (const slug of slugs) {
      const coords = SMALL_COUNTRY_LNGLAT[slug];
      if (!coords) continue;
      const proj = projection(coords);
      if (!proj || !isFinite(proj[0]) || !isFinite(proj[1])) continue;
      out.push({ slug, x: proj[0], y: proj[1] });
    }
    return out;
  }
);

export const getWorldMapPaths = cache((width = 960, height = 480): MapFeature[] => {
  const projection = geoEqualEarth()
    .scale(width / 6.4)
    .translate([width / 2, height / 2 - 10]);

  const pathGen = geoPath(projection);
  const collection = feature(topology as any, (topology as any).objects.countries) as any;

  return collection.features
    .filter((f: any) => f.properties.name !== 'Antarctica')
    .map((f: any) => {
      const name = f.properties.name as string;
      const code = nameToCode.get(name) ?? null;
      return {
        isoAlpha3: code,
        name,
        path: pathGen(f) ?? '',
        centroid: getMainLandCentroidPx(f, projection, code),
      };
    });
});
