import { useMemo } from 'react';
import { cellToBoundary, polygonToCells } from 'h3-js';
import type { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';
import type { LayerState } from '@/types';
import { h3BoundaryToGeoJSON } from '@/utils/coords';
import { buildSpatialIndex, scoreHex } from '@/utils/spatialIndex';
import { useDebounce } from './useDebounce';

export const H3_RESOLUTION = 9;

interface ScoringInput {
  layers: LayerState[];
  boundary: Feature<Polygon | MultiPolygon> | null;
}

interface ScoringResult {
  geojson: FeatureCollection | null;
  hexCount: number;
  scoredCount: number;
}

/**
 * Get all H3 hex cell IDs within a GeoJSON boundary polygon.
 */
export function getBoundaryHexes(
  boundary: Feature<Polygon | MultiPolygon>,
  resolution: number
): string[] {
  const geom = boundary.geometry;

  if (geom.type === 'Polygon') {
    return polygonToCells(geom.coordinates as number[][][], resolution, true);
  }

  const allHexes = new Set<string>();
  for (const polygon of geom.coordinates) {
    for (const hex of polygonToCells(polygon as number[][][], resolution, true)) {
      allHexes.add(hex);
    }
  }
  return [...allHexes];
}

export function useScoring({ layers, boundary }: ScoringInput): ScoringResult {
  const debouncedLayers = useDebounce(layers, 300);

  // Compute hex grid IDs within boundary (only recomputes if boundary changes)
  const hexIds = useMemo(() => {
    if (!boundary) return [];
    return getBoundaryHexes(boundary, H3_RESOLUTION);
  }, [boundary]);

  // Build spatial index from active layers (recomputes when layers change)
  const { index, layerWeights, totalWeight, activeLayers } = useMemo(() => {
    const active = debouncedLayers.filter((l) => l.enabled);
    const weights = new Map<string, number>();
    let total = 0;
    for (const l of active) {
      weights.set(l.categoryId, l.weight);
      total += l.weight;
    }
    const idx = active.length > 0
      ? buildSpatialIndex(
          active.map((l) => ({ categoryId: l.categoryId, radius: l.radius })),
          H3_RESOLUTION
        )
      : { coverage: new Map() };
    return { index: idx, layerWeights: weights, totalWeight: total, activeLayers: active };
  }, [debouncedLayers]);

  // Score all hexes using O(1) lookups per hex
  const result = useMemo((): ScoringResult => {
    if (hexIds.length === 0) return { geojson: null, hexCount: 0, scoredCount: 0 };
    if (activeLayers.length === 0 || totalWeight === 0) {
      return { geojson: null, hexCount: hexIds.length, scoredCount: 0 };
    }

    const features: GeoJSON.Feature[] = [];

    for (const hexId of hexIds) {
      const score = scoreHex(hexId, index, layerWeights, totalWeight);
      if (score > 0) {
        const hexBoundary = cellToBoundary(hexId);
        const coords = h3BoundaryToGeoJSON(hexBoundary);
        coords.push(coords[0]); // Close the ring

        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coords],
          },
          properties: { score },
        });
      }
    }

    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    return { geojson, hexCount: hexIds.length, scoredCount: features.length };
  }, [hexIds, activeLayers, index, layerWeights, totalWeight]);

  return result;
}
