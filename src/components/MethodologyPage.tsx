import MenuButton from './MenuButton';

interface MethodologyPageProps {
  onBack: () => void;
}

export default function MethodologyPage({ onBack }: MethodologyPageProps) {
  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ background: '#161618' }}
    >
      <MenuButton onMethodology={onBack} />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1
          className="font-sans"
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#F2F0EB',
            marginBottom: 8,
          }}
        >
          Methodology
        </h1>
        <p
          className="font-sans"
          style={{ fontSize: '13px', color: '#4A4A50', marginBottom: 40 }}
        >
          How the livability heatmap is calculated
        </p>

        <Section title="1. Spatial Grid">
          The map area is tessellated into hexagonal cells using the{' '}
          <strong>H3 spatial indexing system</strong> (Uber) at{' '}
          <strong>resolution 9</strong>, where each hexagon has an average edge
          length of ~174m. The borough boundary GeoJSON is converted to a set of
          H3 cell IDs via <code>polygonToCells</code>, producing the complete
          grid of scoreable locations.
        </Section>

        <Section title="2. Points of Interest (POIs)">
          POI data is sourced per amenity category (e.g. M&S, Waitrose,
          Sainsbury's, gyms, train stations, parks). Each POI is defined by a
          precise latitude/longitude coordinate and stored as static JSON. POIs
          are grouped into categories, each independently toggleable with its
          own radius and weight parameters.
        </Section>

        <Section title="3. Spatial Index Construction">
          For each active category, every POI is expanded into the set of H3
          cells it covers. Coverage is determined by computing the number of
          concentric hex rings needed:{' '}
          <code>k = ceil(radius / (edgeLength * sqrt(3)))</code>, then calling{' '}
          <code>gridDisk(centerHex, k)</code>. The result is a spatial index
          mapping each H3 cell to the set of category IDs that cover it. This
          replaces O(H x L x P) brute-force scoring with O(1) lookups per hex.
        </Section>

        <Section title="4. Hex Scoring">
          Each hex cell receives a <strong>weighted coverage score</strong>{' '}
          between 0 and 1:
          <Formula>
            score(hex) = sum(weight_i for each covering category_i) / sum(all
            active weights)
          </Formula>
          A hex scores 1.0 if it is within the configured radius of at least one
          POI from every active category. A hex scores 0 if no active category
          covers it. The score represents the fraction of total importance that
          is satisfied at that location.
        </Section>

        <Section title="5. Heatmap Rendering">
          Scored hexes are rendered as a GeoJSON fill layer with a continuous
          colour ramp:
          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <ColorStop color="#BFDBFE" label="0.0 — Low coverage" />
            <ColorStop color="#FDE68A" label="0.4" />
            <ColorStop color="#F97316" label="0.7" />
            <ColorStop color="#EF4444" label="1.0 — Full coverage" />
          </div>
          The <strong>threshold slider</strong> filters out hexes below a
          minimum score, allowing focus on areas that meet a desired level of
          amenity coverage. Fill opacity is fixed at 30%.
        </Section>

        <Section title="6. Overlay Mode">
          In overlay mode, each category renders two MapLibre layers per
          category: circle markers at POI coordinates (6px radius, category
          colour) and filled buffer polygons generated via{' '}
          <code>@turf/circle</code> at the user-configured walking radius. This
          provides direct visual feedback of each category's spatial footprint
          before switching to the composite heatmap.
        </Section>

        <Section title="7. Quiz Scoring">
          The preference quiz maps user answers (1-5 importance scale) to
          category weights via <code>weight = answer x 2</code>. These weights
          seed the layer configuration. Neighbourhood ranking averages hex
          scores within a <code>gridDisk(center, k=4)</code> ring (~500m) around
          each neighbourhood centroid, producing a 0-100 liveability score. The
          top 3 neighbourhoods are returned.
        </Section>

        <Section title="8. Performance">
          Scoring is debounced (300ms) on layer changes to prevent redundant
          recomputation. The spatial index is rebuilt only when active layers or
          radii change. Hex grid IDs are memoised against the boundary polygon.
          All computation runs client-side with no backend dependencies.
        </Section>

        {/* Back link */}
        <button
          onClick={onBack}
          className="font-sans transition-colors"
          style={{
            marginTop: 40,
            fontSize: '13px',
            fontWeight: 500,
            color: '#6E6E75',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Back to map
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        className="font-sans"
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#F2F0EB',
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <div
        className="font-sans"
        style={{
          fontSize: '13px',
          lineHeight: '1.7',
          color: '#6E6E75',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono"
      style={{
        marginTop: 10,
        marginBottom: 10,
        padding: '10px 14px',
        background: '#1E1E21',
        border: '1px solid #2E2E33',
        borderRadius: 8,
        fontSize: '12px',
        color: '#D4F53C',
      }}
    >
      {children}
    </div>
  );
}

function ColorStop({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: color,
          display: 'inline-block',
        }}
      />
      <span className="font-mono" style={{ fontSize: '11px', color: '#6E6E75' }}>
        {label}
      </span>
    </div>
  );
}
