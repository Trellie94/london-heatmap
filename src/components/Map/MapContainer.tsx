import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, Polygon, MultiPolygon } from 'geojson';

export interface MapHandle {
  getMap: () => maplibregl.Map | null;
}

interface MapContainerProps {
  boundary: Feature<Polygon | MultiPolygon> | null;
}

const MapContainer = forwardRef<MapHandle, MapContainerProps>(({ boundary }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
  }));

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=KRm0tPC1vy3ZKfJl94Ms',
      center: [-0.192, 51.458],
      zoom: 13,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-left');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add boundary layer when data loads
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !boundary) return;

    const addBoundary = () => {
      if (map.getSource('wandsworth-boundary')) return;

      map.addSource('wandsworth-boundary', {
        type: 'geojson',
        data: boundary,
      });

      map.addLayer({
        id: 'wandsworth-boundary-line',
        type: 'line',
        source: 'wandsworth-boundary',
        paint: {
          'line-color': 'rgba(242, 240, 235, 0.15)',
          'line-width': 1.5,
          'line-dasharray': [6, 4],
        },
      });
    };

    if (map.isStyleLoaded()) {
      addBoundary();
    } else {
      map.on('load', addBoundary);
    }
  }, [boundary]);

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full"
      style={{ minWidth: 0 }}
    />
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;
