import type { Category } from '@/types';
import { useHeatmap } from '@/context/HeatmapContext';
import { poiData } from '@/data/loadPois';
import Toggle from './Toggle';
import RadiusSlider from './RadiusSlider';
import WeightControl from './WeightControl';

interface CategoryCardProps {
  category: Category;
  /** When true, renders as a sub-item inside a group (no outer margin/rounded corners) */
  indent?: boolean;
}

export default function CategoryCard({ category, indent }: CategoryCardProps) {
  const { state, dispatch } = useHeatmap();
  const layer = state.layers.find((l) => l.categoryId === category.id)!;
  const count = poiData[category.id]?.length ?? 0;

  return (
    <div
      className="transition-all duration-150"
      style={
        indent
          ? {
              background: layer.enabled ? '#252528' : '#222225',
              borderBottom: '1px solid #2E2E33',
            }
          : {
              background: layer.enabled ? '#252528' : '#222225',
              border: `1px solid ${layer.enabled ? '#3A3A40' : '#2E2E33'}`,
              borderRadius: 14,
              marginBottom: 6,
            }
      }
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        style={{ padding: '12px 14px' }}
        onClick={() => dispatch({ type: 'TOGGLE_LAYER', categoryId: category.id })}
      >
        {/* Colour dot */}
        <span
          className="shrink-0 rounded-full"
          style={{
            width: 9,
            height: 9,
            background: category.color,
          }}
        />
        {/* Category name */}
        <span
          className="flex-1 font-sans"
          style={{
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '-0.01em',
            color: '#F2F0EB',
          }}
        >
          {category.label}
        </span>
        {/* Location count */}
        <span
          className="font-mono"
          style={{
            fontSize: '10px',
            color: '#4A4A50',
          }}
        >
          {count}
        </span>
        {/* Toggle — stopPropagation to prevent double-firing from card click */}
        <div onClick={(e) => e.stopPropagation()}>
          <Toggle
            enabled={layer.enabled}
            onChange={() => dispatch({ type: 'TOGGLE_LAYER', categoryId: category.id })}
          />
        </div>
      </div>

      {/* Expanded controls — radius + weight (Phase 3/4) */}
      {layer.enabled && (
        <div
          style={{
            borderTop: '1px solid #2E2E33',
            padding: '12px 14px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <RadiusSlider
            value={layer.radius}
            color={category.color}
            onChange={(r) =>
              dispatch({ type: 'SET_RADIUS', categoryId: category.id, radius: r })
            }
          />
          <WeightControl
            value={layer.weight}
            color={category.color}
            onChange={(w) =>
              dispatch({ type: 'SET_WEIGHT', categoryId: category.id, weight: w })
            }
          />
        </div>
      )}
    </div>
  );
}
