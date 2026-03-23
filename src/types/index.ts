export interface POI {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  brand?: string;
  type?: string;
  lines?: string[];
  area_ha?: number;
  note?: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  defaultRadius: number;
  defaultWeight: number;
  /** Optional group name — categories sharing the same group render under a collapsible header */
  group?: string;
}

export interface LayerState {
  categoryId: string;
  enabled: boolean;
  radius: number;
  weight: number;
}

export type ViewMode = 'overlays' | 'index';

export interface HeatmapState {
  layers: LayerState[];
  threshold: number;
  viewMode: ViewMode;
}

export type HeatmapAction =
  | { type: 'TOGGLE_LAYER'; categoryId: string }
  | { type: 'SET_RADIUS'; categoryId: string; radius: number }
  | { type: 'SET_WEIGHT'; categoryId: string; weight: number }
  | { type: 'SET_THRESHOLD'; threshold: number }
  | { type: 'SET_VIEW_MODE'; viewMode: ViewMode }
  | { type: 'SET_LAYERS'; layers: LayerState[] };
