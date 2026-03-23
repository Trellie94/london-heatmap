import { useState, useEffect } from 'react';
import type { Feature, Polygon, MultiPolygon } from 'geojson';

export function useBoundary() {
  const [boundary, setBoundary] = useState<Feature<Polygon | MultiPolygon> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/wandsworth-boundary.geojson')
      .then((res) => res.json())
      .then((data) => {
        // Handle both FeatureCollection and single Feature
        const feature =
          data.type === 'FeatureCollection' ? data.features[0] : data;
        setBoundary(feature);
      })
      .catch((err) => {
        console.error('Failed to load Wandsworth boundary:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { boundary, loading };
}
