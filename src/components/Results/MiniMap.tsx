import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MiniMapProps {
  lat: number;
  lng: number;
  className?: string;
}

/**
 * A tiny non-interactive MapLibre map that renders a snapshot of a location.
 * Centered on lat/lng, zoomed to ~200m radius view, then frozen as a static image.
 */
export default function MiniMap({ lat, lng, className = '' }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center: [lng, lat],
      zoom: 14.5, // ~350m radius visible
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true, // needed for toDataURL
    } as maplibregl.MapOptions);

    mapRef.current = map;

    // Once the map renders, capture it as a static image and remove the GL context
    map.on('idle', () => {
      try {
        const canvas = map.getCanvas();
        const dataUrl = canvas.toDataURL('image/png');
        setImageUrl(dataUrl);
        // Clean up the GL map after capture to save memory
        setTimeout(() => {
          map.remove();
          mapRef.current = null;
        }, 100);
      } catch {
        // If capture fails, just leave the live map
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Show captured image once available, otherwise show live map */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Map snapshot"
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          ref={containerRef}
          className="w-full h-full"
        />
      )}
      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
        }}
      />
      {/* Centre pin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center -mt-4">
          <div className="w-3 h-3 rounded-full bg-accent border-2 border-white shadow-lg" />
          <div className="w-0.5 h-2 bg-white/60" />
        </div>
      </div>
    </div>
  );
}
