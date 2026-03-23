import { useHeatmap } from '@/context/HeatmapContext';
import Slider from './Slider';

interface ThresholdPanelProps {
  coveragePct: number;
}

export default function ThresholdPanel({ coveragePct }: ThresholdPanelProps) {
  const { state, dispatch } = useHeatmap();
  const hasActiveLayers = state.layers.some((l) => l.enabled);
  const isIndexMode = state.viewMode === 'index';

  return (
    <div
      className="shrink-0"
      style={{
        borderTop: '1px solid #2E2E33',
        padding: '16px 12px',
      }}
    >
      {/* Threshold header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-sans font-bold uppercase"
          style={{
            fontSize: '9.5px',
            letterSpacing: '0.12em',
            color: '#4A4A50',
          }}
        >
          Score Threshold
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: '#D4F53C',
          }}
        >
          {state.threshold}%
        </span>
      </div>

      {/* Threshold slider */}
      <Slider
        min={0}
        max={100}
        step={1}
        value={state.threshold}
        color="#D4F53C"
        onChange={(v) => dispatch({ type: 'SET_THRESHOLD', threshold: v })}
      />

      {/* Coverage stat */}
      <p
        className="font-sans mt-2 mb-4"
        style={{ fontSize: '11px', fontWeight: 400, color: '#4A4A50' }}
      >
        {hasActiveLayers
          ? `${coveragePct}% of borough above threshold`
          : 'Enable layers to see scoring'}
      </p>

      {/* Show Index Only button */}
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: 'SET_VIEW_MODE',
            viewMode: isIndexMode ? 'overlays' : 'index',
          })
        }
        className="w-full cursor-pointer font-sans transition-all duration-200"
        style={{
          padding: '13px',
          borderRadius: 12,
          border: 'none',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '-0.01em',
          background: isIndexMode ? '#D4F53C' : '#F2F0EB',
          color: '#111111',
          boxShadow: isIndexMode ? '0 4px 20px rgba(212, 245, 60, 0.25)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#D4F53C';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 245, 60, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isIndexMode ? '#D4F53C' : '#F2F0EB';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isIndexMode
            ? '0 4px 20px rgba(212, 245, 60, 0.25)'
            : 'none';
        }}
      >
        {isIndexMode ? 'Show All Layers' : 'Show Index Only'}
      </button>
    </div>
  );
}
