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
