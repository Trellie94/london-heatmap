/**
 * Coordinate conversion utilities.
 *
 * GeoJSON / MapLibre / Turf.js all use [lng, lat].
 * H3-js uses [lat, lng] (or separate lat, lng params).
 * POI data has separate .lat and .lng fields.
 */

/** Convert lat/lng to GeoJSON coordinate order [lng, lat] */
export const toGeoJSON = (lat: number, lng: number): [number, number] => [lng, lat];

/** Convert H3 boundary (array of [lat, lng]) to GeoJSON ring (array of [lng, lat]) */
export const h3BoundaryToGeoJSON = (
  boundary: [number, number][]
): [number, number][] => boundary.map(([lat, lng]) => [lng, lat]);

/**
 * Haversine distance in metres between two points.
 * Expects (lat1, lng1, lat2, lng2) in degrees.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
