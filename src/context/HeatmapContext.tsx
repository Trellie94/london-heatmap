import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { HeatmapState, HeatmapAction, LayerState } from '@/types';
import { CATEGORIES } from '@/data/categories';

const initialLayers: LayerState[] = CATEGORIES.map((c) => ({
  categoryId: c.id,
  enabled: false,
  radius: c.defaultRadius,
  weight: c.defaultWeight,
}));

const initialState: HeatmapState = {
  layers: initialLayers,
  threshold: 0,
  viewMode: 'overlays',
};

function heatmapReducer(state: HeatmapState, action: HeatmapAction): HeatmapState {
  switch (action.type) {
    case 'TOGGLE_LAYER':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.categoryId === action.categoryId ? { ...l, enabled: !l.enabled } : l
        ),
      };
    case 'SET_RADIUS':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.categoryId === action.categoryId ? { ...l, radius: action.radius } : l
        ),
      };
    case 'SET_WEIGHT':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.categoryId === action.categoryId ? { ...l, weight: action.weight } : l
        ),
      };
    case 'SET_THRESHOLD':
      return { ...state, threshold: action.threshold };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.viewMode };
    case 'SET_LAYERS':
      return { ...state, layers: action.layers };
    default:
      return state;
  }
}

interface HeatmapContextValue {
  state: HeatmapState;
  dispatch: React.Dispatch<HeatmapAction>;
}

const HeatmapContext = createContext<HeatmapContextValue | null>(null);

export function HeatmapProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(heatmapReducer, initialState);
  return (
    <HeatmapContext.Provider value={{ state, dispatch }}>
      {children}
    </HeatmapContext.Provider>
  );
}

export function useHeatmap() {
  const ctx = useContext(HeatmapContext);
  if (!ctx) throw new Error('useHeatmap must be used within HeatmapProvider');
  return ctx;
}
