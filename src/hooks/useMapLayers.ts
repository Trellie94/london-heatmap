import { useEffect, useRef, type RefObject } from 'react';
import maplibregl from 'maplibre-gl';
import circle from '@turf/circle';
import { featureCollection } from '@turf/helpers';
import type { FeatureCollection } from 'geojson';
import type { MapHandle } from '@/components/Map/MapContainer';
import { useHeatmap } from '@/context/HeatmapContext';
import { CATEGORIES } from '@/data/categories';
import { poiData } from '@/data/loadPois';
import { toGeoJSON } from '@/utils/coords';
import type { POI } from '@/types';

function poisToGeoJSON(pois: POI[]) {
  return {
    type: 'FeatureCollection' as const,
    features: pois.map((poi) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: toGeoJSON(poi.lat, poi.lng),
      },
      properties: {
        id: poi.id,
        name: poi.name,
        address: poi.address,
      },
    })),
  };
}

function poisToBufferGeoJSON(pois: POI[], radiusMetres: number) {
  const features = pois.map((poi) => {
    const center = toGeoJSON(poi.lat, poi.lng);
    return circle(center, radiusMetres / 1000, {
      units: 'kilometers',
      steps: 48,
    });
  });
  return featureCollection(features);
}

const HEX_SCORE_SOURCE = 'hex-score';
const HEX_SCORE_LAYER = 'hex-score';

export function useMapLayers(
  mapRef: RefObject<MapHandle | null>,
  scoreGeoJSON: FeatureCollection | null
) {
  const { state } = useHeatmap();
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const prevLayersRef = useRef<string[]>([]);

  // Manage category pin + buffer layers
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const run = () => {
      const activeIds = state.layers
        .filter((l) => l.enabled)
        .map((l) => l.categoryId);

      const prevIds = prevLayersRef.current;
      const toRemove = prevIds.filter((id) => !activeIds.includes(id));

      for (const catId of toRemove) {
        if (map.getLayer(`${catId}-pins`)) map.removeLayer(`${catId}-pins`);
        if (map.getSource(`${catId}-pins`)) map.removeSource(`${catId}-pins`);
        if (map.getLayer(`${catId}-buffers`)) map.removeLayer(`${catId}-buffers`);
        if (map.getSource(`${catId}-buffers`)) map.removeSource(`${catId}-buffers`);
      }

      for (const layer of state.layers) {
        if (!layer.enabled) continue;
        const cat = CATEGORIES.find((c) => c.id === layer.categoryId);
        if (!cat) continue;
        const pois = poiData[cat.id];
        if (!pois || pois.length === 0) continue;

        const pinSourceId = `${cat.id}-pins`;
        const pinLayerId = `${cat.id}-pins`;
        const bufferSourceId = `${cat.id}-buffers`;
        const bufferLayerId = `${cat.id}-buffers`;

        // --- Buffer layer ---
        const bufferData = poisToBufferGeoJSON(pois, layer.radius);
        if (map.getSource(bufferSourceId)) {
          (map.getSource(bufferSourceId) as maplibregl.GeoJSONSource).setData(
            bufferData as GeoJSON.FeatureCollection
          );
        } else {
          map.addSource(bufferSourceId, {
            type: 'geojson',
            data: bufferData as GeoJSON.FeatureCollection,
          });
          map.addLayer({
            id: bufferLayerId,
            type: 'fill',
            source: bufferSourceId,
            paint: {
              'fill-color': cat.color,
              'fill-opacity': 0.12,
            },
          });
        }

        // --- Pin layer ---
        const pinData = poisToGeoJSON(pois);
        if (map.getSource(pinSourceId)) {
          (map.getSource(pinSourceId) as maplibregl.GeoJSONSource).setData(
            pinData as GeoJSON.FeatureCollection
          );
        } else {
          map.addSource(pinSourceId, {
            type: 'geojson',
            data: pinData as GeoJSON.FeatureCollection,
          });
          map.addLayer({
            id: pinLayerId,
            type: 'circle',
            source: pinSourceId,
            paint: {
              'circle-radius': 6,
              'circle-color': cat.color,
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#000000',
              'circle-stroke-opacity': 0.4,
            },
          });

          map.on('mouseenter', pinLayerId, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const feature = e.features?.[0];
            if (!feature || feature.geometry.type !== 'Point') return;
            const coords = feature.geometry.coordinates.slice() as [number, number];
            const { name, address } = feature.properties;
            const popupEl = document.createElement('div');
            const nameEl = document.createElement('div');
            nameEl.className = 'popup-name';
            nameEl.textContent = name;
            const addrEl = document.createElement('div');
            addrEl.className = 'popup-address';
            addrEl.textContent = address;
            popupEl.append(nameEl, addrEl);

            // Remove any existing popup before creating a new one
            popupRef.current?.remove();

            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 12,
            })
              .setLngLat(coords)
              .setDOMContent(popupEl)
              .addTo(map);
          });

          map.on('mouseleave', pinLayerId, () => {
            map.getCanvas().style.cursor = '';
            popupRef.current?.remove();
            popupRef.current = null;
          });
        }

        // Handle view mode visibility
        const isIndexMode = state.viewMode === 'index';
        if (map.getLayer(bufferLayerId)) {
          map.setLayoutProperty(bufferLayerId, 'visibility', isIndexMode ? 'none' : 'visible');
        }
        if (map.getLayer(pinLayerId)) {
          map.setLayoutProperty(pinLayerId, 'visibility', isIndexMode ? 'none' : 'visible');
        }
      }

      prevLayersRef.current = activeIds;
    };

    if (map.isStyleLoaded()) {
      run();
    } else {
      map.on('load', run);
    }

    return () => {
      // Clean up all pin and buffer layers/sources on unmount
      for (const catId of prevLayersRef.current) {
        if (map.getLayer(`${catId}-pins`)) map.removeLayer(`${catId}-pins`);
        if (map.getSource(`${catId}-pins`)) map.removeSource(`${catId}-pins`);
        if (map.getLayer(`${catId}-buffers`)) map.removeLayer(`${catId}-buffers`);
        if (map.getSource(`${catId}-buffers`)) map.removeSource(`${catId}-buffers`);
      }
      prevLayersRef.current = [];
    };
  }, [mapRef, state.layers, state.viewMode]);

  // Manage hex score layer — only visible in index mode
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const applyHexLayer = () => {
      const isIndexMode = state.viewMode === 'index';
      const opacity = 0.30;
      const threshold = state.threshold / 100;
      const hasData = scoreGeoJSON && scoreGeoJSON.features.length > 0;

      // Remove hex layer when not in index mode or no data
      if (!isIndexMode || !hasData) {
        if (map.getLayer(HEX_SCORE_LAYER)) map.removeLayer(HEX_SCORE_LAYER);
        if (map.getSource(HEX_SCORE_SOURCE)) map.removeSource(HEX_SCORE_SOURCE);
        return;
      }

      // Index mode with score data — add or update hex layer
      if (map.getSource(HEX_SCORE_SOURCE)) {
        (map.getSource(HEX_SCORE_SOURCE) as maplibregl.GeoJSONSource).setData(scoreGeoJSON);
        if (map.getLayer(HEX_SCORE_LAYER)) {
          map.setPaintProperty(HEX_SCORE_LAYER, 'fill-opacity', opacity);
          map.setFilter(HEX_SCORE_LAYER, ['>=', ['get', 'score'], threshold]);
        }
      } else {
        map.addSource(HEX_SCORE_SOURCE, {
          type: 'geojson',
          data: scoreGeoJSON,
        });
        map.addLayer({
          id: HEX_SCORE_LAYER,
          type: 'fill',
          source: HEX_SCORE_SOURCE,
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'score'],
              0.0, '#BFDBFE',
              0.4, '#FDE68A',
              0.7, '#F97316',
              1.0, '#EF4444',
            ],
            'fill-opacity': opacity,
          },
          filter: ['>=', ['get', 'score'], threshold],
        });
      }
    };

    // Use map.once('idle') to wait for any pending layer operations to complete
    if (map.isStyleLoaded() && !map.isMoving()) {
      applyHexLayer();
    } else {
      map.once('idle', applyHexLayer);
    }

    return () => {
      if (map.getLayer(HEX_SCORE_LAYER)) map.removeLayer(HEX_SCORE_LAYER);
      if (map.getSource(HEX_SCORE_SOURCE)) map.removeSource(HEX_SCORE_SOURCE);
    };
  }, [mapRef, scoreGeoJSON, state.viewMode, state.threshold]);
}
