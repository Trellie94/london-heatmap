import { useHeatmap } from '@/context/HeatmapContext';
import { CATEGORIES } from '@/data/categories';
import type { LayerState, Category } from '@/types';

export default function ActiveLayerPills() {
  const { state } = useHeatmap();
  const activeLayers = state.layers.filter((l: LayerState) => l.enabled);
  const activeCategories = activeLayers.map((l: LayerState) =>
    CATEGORIES.find((c: Category) => c.id === l.categoryId)!
  );

  return (
    <div className="px-5 py-3">
      <p
        className="font-sans font-bold uppercase mb-2"
        style={{
          fontSize: '9.5px',
          letterSpacing: '0.12em',
          color: '#4A4A50',
        }}
      >
        Active Layers
      </p>
      <div className="flex flex-wrap gap-1.5">
        {activeCategories.length === 0 ? (
          <span
            className="font-sans"
            style={{ fontSize: '11px', color: '#4A4A50' }}
          >
            No layers active
          </span>
        ) : (
          activeCategories.map((cat: Category) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 transition-all duration-200"
              style={{
                background: '#222225',
                border: '1px solid #2E2E33',
                borderRadius: 20,
                padding: '3px 8px 3px 5px',
                fontSize: '10px',
                fontWeight: 500,
                color: '#6E6E75',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: cat.color,
                }}
              />
              {cat.label}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
