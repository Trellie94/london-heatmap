import { useMemo } from 'react';
import { cellToLatLng, latLngToCell, gridDisk } from 'h3-js';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import type { LayerState, Category } from '@/types';
import { QUIZ_QUESTIONS, type QuizAnswers } from '@/data/quizQuestions';
import { CATEGORIES } from '@/data/categories';
import { NEIGHBOURHOODS } from '@/data/neighbourhoods';
import { buildSpatialIndex, scoreHex } from '@/utils/spatialIndex';
import { getBoundaryHexes, H3_RESOLUTION } from './useScoring';

export interface NeighbourhoodResult {
  name: string;
  score: number; // 0–100
  lat: number;
  lng: number;
  topAmenities: string[];
}

/**
 * Convert quiz answers into LayerState[] compatible with existing scoring.
 * Answer 0 = disabled. Answer 1–5 maps to weight 2–10.
 */
export function quizAnswersToLayers(answers: QuizAnswers): LayerState[] {
  const categoryWeights: Record<string, number> = {};
  const categoryEnabled: Record<string, boolean> = {};

  for (const q of QUIZ_QUESTIONS) {
    const answer = answers[q.id] ?? 0;
    if (answer === 0) continue;

    const weight = answer * 2;
    for (const catId of q.categoryIds) {
      categoryWeights[catId] = Math.max(categoryWeights[catId] ?? 0, weight);
      categoryEnabled[catId] = true;
    }
  }

  return CATEGORIES.map((c: Category) => ({
    categoryId: c.id,
    enabled: categoryEnabled[c.id] ?? false,
    radius: c.defaultRadius,
    weight: categoryWeights[c.id] ?? c.defaultWeight,
  }));
}

/**
 * Score every neighbourhood by averaging hex scores within ~500m of its centre.
 * Uses the shared spatial index for O(1) per-hex scoring.
 */
export function useQuizResults(
  answers: QuizAnswers | null,
  boundary: Feature<Polygon | MultiPolygon> | null
): NeighbourhoodResult[] {
  return useMemo(() => {
    if (!answers || !boundary) return [];

    const layers = quizAnswersToLayers(answers);
    const activeLayers = layers.filter((l) => l.enabled);
    if (activeLayers.length === 0) return [];

    // Build weights map
    const layerWeights = new Map<string, number>();
    let totalWeight = 0;
    for (const l of activeLayers) {
      layerWeights.set(l.categoryId, l.weight);
      totalWeight += l.weight;
    }
    if (totalWeight === 0) return [];

    // Build spatial index (shared logic)
    const index = buildSpatialIndex(
      activeLayers.map((l) => ({ categoryId: l.categoryId, radius: l.radius })),
      H3_RESOLUTION
    );

    // Get all hexes in boundary
    const hexIds = getBoundaryHexes(boundary, H3_RESOLUTION);

    // Score each hex and store with centroid + covered categories
    const hexScores = new Map<string, { score: number; lat: number; lng: number; covered: string[] }>();
    for (const hexId of hexIds) {
      const score = scoreHex(hexId, index, layerWeights, totalWeight);
      if (score > 0) {
        const [lat, lng] = cellToLatLng(hexId);
        const coveredSet = index.coverage.get(hexId);
        const covered = coveredSet
          ? [...coveredSet].filter((catId) => layerWeights.has(catId))
          : [];
        hexScores.set(hexId, { score, lat, lng, covered });
      }
    }

    // Score each neighbourhood using gridDisk (~500m at resolution 9)
    const NEIGHBOURHOOD_RING_K = 4;
    const results: NeighbourhoodResult[] = [];

    for (const hood of NEIGHBOURHOODS) {
      const centerHex = latLngToCell(hood.lat, hood.lng, H3_RESOLUTION);
      const nearbyHexes = gridDisk(centerHex, NEIGHBOURHOOD_RING_K);

      let totalScore = 0;
      let count = 0;
      const amenityCounts: Record<string, number> = {};

      for (const hexId of nearbyHexes) {
        const hex = hexScores.get(hexId);
        if (hex) {
          totalScore += hex.score;
          count++;
          for (const catId of hex.covered) {
            amenityCounts[catId] = (amenityCounts[catId] ?? 0) + 1;
          }
        }
      }

      if (count > 0) {
        const avgScore = totalScore / count;
        const topAmenities = Object.entries(amenityCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => id);

        results.push({
          name: hood.name,
          score: Math.round(avgScore * 100),
          lat: hood.lat,
          lng: hood.lng,
          topAmenities,
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 3);
  }, [answers, boundary]);
}
