import { latLngToCell, gridDisk, getHexagonEdgeLengthAvg } from 'h3-js';
import type { POI, Category } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { poiData } from '@/data/loadPois';

/**
 * Spatial index that maps H3 hex IDs → set of category IDs whose POIs
 * fall within range. Built once per (resolution, radius) configuration,
 * replacing the O(H×L×P) brute-force with O(1) hex lookups.
 */

/**
 * For a given POI and radius, compute which H3 cells at `resolution`
 * are within that radius, using gridDisk rings.
 */
function getPoiCoveredHexes(
  poi: POI,
  radiusMetres: number,
  resolution: number
): string[] {
  const centerHex = latLngToCell(poi.lat, poi.lng, resolution);
  // Hex edge length in metres at this resolution
  const edgeLength = getHexagonEdgeLengthAvg(resolution, 'm');
  // Approximate hex "diameter" (center-to-center distance) ≈ edge * √3
  const hexSpacing = edgeLength * Math.sqrt(3);
  // Number of rings needed to cover the radius
  const k = Math.ceil(radiusMetres / hexSpacing);
  return gridDisk(centerHex, k);
}

export interface SpatialIndex {
  /** hexId → Set of categoryIds that cover this hex */
  coverage: Map<string, Set<string>>;
}

interface LayerConfig {
  categoryId: string;
  radius: number;
}

/**
 * Build a spatial index: for each active layer, expand every POI into
 * the H3 cells it covers, then store which categories cover each hex.
 */
export function buildSpatialIndex(
  activeLayers: LayerConfig[],
  resolution: number
): SpatialIndex {
  const coverage = new Map<string, Set<string>>();

  for (const { categoryId, radius } of activeLayers) {
    const cat = CATEGORIES.find((c: Category) => c.id === categoryId);
    if (!cat) continue;
    const pois = poiData[cat.id] || [];

    for (const poi of pois) {
      const coveredHexes = getPoiCoveredHexes(poi, radius, resolution);
      for (const hexId of coveredHexes) {
        let set = coverage.get(hexId);
        if (!set) {
          set = new Set();
          coverage.set(hexId, set);
        }
        set.add(categoryId);
      }
    }
  }

  return { coverage };
}

/**
 * Score a single hex: what fraction of total weight is covered?
 * Returns 0 if no coverage.
 */
export function scoreHex(
  hexId: string,
  index: SpatialIndex,
  layerWeights: Map<string, number>,
  totalWeight: number
): number {
  const covered = index.coverage.get(hexId);
  if (!covered) return 0;

  let coveredWeight = 0;
  for (const [catId, weight] of layerWeights) {
    if (covered.has(catId)) {
      coveredWeight += weight;
    }
  }
  return coveredWeight / totalWeight;
}
