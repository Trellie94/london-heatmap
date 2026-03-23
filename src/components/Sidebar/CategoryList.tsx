import { CATEGORIES } from '@/data/categories';
import { useHeatmap } from '@/context/HeatmapContext';
import type { Category, LayerState } from '@/types';
import CategoryCard from './CategoryCard';
import CategoryGroupHeader from './CategoryGroupHeader';

/**
 * Build an ordered list of render items: standalone categories
 * and grouped categories (e.g. Grocery → M&S, Waitrose, Sainsbury's).
 */
function buildRenderList() {
  const items: Array<
    | { kind: 'standalone'; catIndex: number }
    | { kind: 'group'; groupName: string; catIndices: number[] }
  > = [];
  const seen = new Set<number>();

  CATEGORIES.forEach((cat: Category, i: number) => {
    if (seen.has(i)) return;

    if (cat.group) {
      // Collect all categories in this group
      const indices: number[] = [];
      CATEGORIES.forEach((c: Category, j: number) => {
        if (c.group === cat.group) {
          indices.push(j);
          seen.add(j);
        }
      });
      items.push({ kind: 'group', groupName: cat.group, catIndices: indices });
    } else {
      seen.add(i);
      items.push({ kind: 'standalone', catIndex: i });
    }
  });

  return items;
}

const renderList = buildRenderList();

export default function CategoryList() {
  const { state, dispatch } = useHeatmap();

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3">
      <p
        className="font-sans font-bold uppercase px-2 mb-2"
        style={{
          fontSize: '9.5px',
          letterSpacing: '0.12em',
          color: '#4A4A50',
        }}
      >
        Amenity Layers
      </p>
      {renderList.map((item) => {
        if (item.kind === 'standalone') {
          const cat = CATEGORIES[item.catIndex];
          return <CategoryCard key={cat.id} category={cat} />;
        }

        const groupCats = item.catIndices.map((i) => CATEGORIES[i]);
        const groupLayers = groupCats.map(
          (c: Category) => state.layers.find((l: LayerState) => l.categoryId === c.id)!
        );
        const anyEnabled = groupLayers.some((l: LayerState) => l.enabled);

        return (
          <CategoryGroupHeader
            key={item.groupName}
            groupName={item.groupName}
            anyEnabled={anyEnabled}
            onToggleAll={() => {
              // If any are enabled, disable all. Otherwise enable all.
              for (const cat of groupCats) {
                const layer = state.layers.find((l: LayerState) => l.categoryId === cat.id)!;
                if (anyEnabled && layer.enabled) {
                  dispatch({ type: 'TOGGLE_LAYER', categoryId: cat.id });
                } else if (!anyEnabled && !layer.enabled) {
                  dispatch({ type: 'TOGGLE_LAYER', categoryId: cat.id });
                }
              }
            }}
          >
            {groupCats.map((cat) => (
              <CategoryCard key={cat.id} category={cat} indent />
            ))}
          </CategoryGroupHeader>
        );
      })}
    </div>
  );
}
