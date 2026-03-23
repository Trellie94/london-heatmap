# Project Brief: Wandsworth Liveability Heatmap

## Overview

A client-side weighted geospatial amenity scoring tool for Wandsworth Borough, London.
Users select amenity categories, set walking radii and significance weights, and the app
calculates a composite liveability index score across the borough using an H3 hexagonal grid.
Output is an interactive heatmap showing scored areas, filterable by threshold.

**Audience:** Property professionals, buyers, renters assessing residential desirability.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Vite + React + TypeScript |
| Map Engine | MapLibre GL JS |
| Base Tiles | MapTiler (free tier — get API key at maptiler.com) |
| Spatial Buffers | Turf.js (client-side circle buffers) |
| Hex Scoring Grid | H3-js (Uber H3, resolution 9) |
| Styling | Tailwind CSS |
| Session Storage | localStorage |
| Deployment | Vercel |
| Repo | GitHub |

---

## Folder Structure

```
wandsworth-heatmap/
├── public/
│   └── data/
│       └── wandsworth-boundary.geojson   ← ONS borough boundary
├── src/
│   ├── components/
│   │   ├── Map.tsx                        ← MapLibre map wrapper
│   │   ├── Sidebar.tsx                    ← Control panel
│   │   ├── CategoryRow.tsx                ← Per-category controls
│   │   ├── ThresholdSlider.tsx
│   │   └── SessionManager.tsx
│   ├── data/
│   │   ├── categories.ts                  ← Category config (colour, label, file ref)
│   │   └── pois/
│   │       ├── gails.json
│   │       ├── grocery.json
│   │       ├── gyms.json
│   │       ├── stations.json
│   │       ├── parks.json
│   │       ├── coffee.json
│   │       └── gastropubs.json
│   ├── hooks/
│   │   ├── useMapLayers.ts                ← Layer add/remove logic
│   │   └── useScoring.ts                  ← H3 hex scoring engine
│   ├── store/
│   │   └── sessionStore.ts                ← localStorage save/load
│   ├── types/
│   │   └── index.ts                       ← Shared TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── BRIEF.md
├── tasks/                                  ← Claude Code plan files
├── .env.local                              ← VITE_MAPTILER_KEY=xxx
├── package.json
└── vite.config.ts
```

---

## Data Schema

### POI JSON format (all category files)

```json
[
  {
    "id": "gails-wandsworth-1",
    "name": "Gails Wandsworth Town",
    "address": "350 Old York Rd, SW18 1SS",
    "lat": 51.4558,
    "lng": -0.1935
  }
]
```

### Category config (src/data/categories.ts)

```typescript
export interface Category {
  id: string;          // e.g. "gails"
  label: string;       // e.g. "Gails Bakery"
  color: string;       // e.g. "#F59E0B" (amber)
  dataFile: string;    // e.g. "gails.json"
  defaultRadius: number;  // metres, e.g. 600
  defaultWeight: number;  // 1–10, e.g. 7
}
```

### Session state (localStorage)

```typescript
export interface SessionState {
  id: string;
  name: string;
  savedAt: string;
  layers: {
    categoryId: string;
    enabled: boolean;
    radius: number;       // metres
    weight: number;       // 1–10
  }[];
  threshold: number;      // 0–100
  viewMode: "overlays" | "index";
}
```

---

## Build Phases

Work through these phases in order. Create a plan file at the start of each phase.

---

### Phase 1 — Project Scaffold + Map Shell

**Goal:** Running Vite app with MapLibre map centred on Wandsworth. Wandsworth Borough boundary rendered as an outline polygon. Sidebar scaffold (empty).

**Prompt for Claude Code:**

> Scaffold a new Vite + React + TypeScript project called `wandsworth-heatmap`.
> Install: maplibre-gl, tailwindcss, @types/maplibre-gl.
> Set up Tailwind with a minimal config.
> 
> Create a MapLibre map component that:
> - Uses MapTiler Streets as the base tile style (key from VITE_MAPTILER_KEY env var)
> - Centres on Wandsworth Borough: [lat: 51.458, lng: -0.192], zoom 13
> - Loads `public/data/wandsworth-boundary.geojson` and renders it as a transparent fill with a visible stroke outline (colour: #1e293b, stroke width: 2px, fill opacity: 0)
> 
> Create a sidebar component on the left (320px fixed width, full height, white background, subtle right border). Sidebar is empty for now — just the shell.
> 
> Visual style: clean, minimal, light. System font. No unnecessary decoration.
> App should be full viewport height. Map fills remaining space to the right of sidebar.

**Notes:**
- Download Wandsworth boundary GeoJSON from ONS Open Geography Portal before starting: https://geoportal.statistics.gov.uk (search "London Borough Boundaries")
- MapTiler free tier: 100k tile requests/month. Sufficient for dev and moderate public use.

---

### Phase 2 — Category Config + POI Data + Pin Rendering

**Goal:** Load all 7 POI datasets. Sidebar shows list of categories with toggle switches. Toggling a category renders its POI pins on the map in the category colour.

**Prompt for Claude Code:**

> Add category and POI layer management to the Wandsworth heatmap app.
>
> 1. Create `src/data/categories.ts` with a typed Category config array. Categories are:
>    - Gails Bakery (amber #F59E0B, default radius 600m, weight 8)
>    - Grocery Stores (green #16A34A, default radius 800m, weight 7)
>    - Gyms (blue #3B82F6, default radius 700m, weight 6)
>    - Train Stations (indigo #6366F1, default radius 900m, weight 9)
>    - Parks (lime #84CC16, default radius 500m, weight 6)
>    - Independent Coffee (brown #92400E, default radius 500m, weight 5)
>    - Gastropubs (red #EF4444, default radius 600m, weight 5)
>
> 2. Load each category's POI JSON from `src/data/pois/`.
>
> 3. In the sidebar, render each category as a row with:
>    - A coloured toggle (enabled/disabled)
>    - The category label
>    - A coloured dot matching the category colour
>
> 4. When a category is enabled, render a MapLibre GeoJSON source + circle layer for its POIs:
>    - Circle radius: 6px
>    - Circle colour: category colour
>    - Circle stroke: white, 1.5px
>    - Hover state shows a popup with the POI name and address
>
> 5. When disabled, remove the layer and source from the map cleanly.
>
> Use a React context or simple state hook to manage which categories are active.

---

### Phase 3 — Radius Controls + Buffer Overlay Rendering

**Goal:** Each category row in the sidebar gains a radius slider (100m–2000m). Activating a category draws transparent circular buffer polygons around each POI using Turf.js.

**Prompt for Claude Code:**

> Add buffer overlay rendering to the Wandsworth heatmap app using Turf.js.
>
> 1. Install `@turf/turf`.
>
> 2. Add a radius slider to each category row in the sidebar:
>    - Range: 100–2000 metres, step 50
>    - Label shows current value e.g. "600m"
>    - Only visible when the category is enabled
>
> 3. When a category is enabled, use `turf.circle()` to generate a GeoJSON polygon for each POI at the configured radius.
>
> 4. Render these buffer polygons as a MapLibre fill layer:
>    - Fill colour: category colour
>    - Fill opacity: 0.15 (transparent enough to see streets beneath)
>    - No stroke on buffers
>
> 5. When radius changes, regenerate and re-render the buffer layer reactively.
>
> 6. Buffers and pins should be separate MapLibre layers so they can be toggled independently.
>
> Important: layers should be added in correct z-order — buffers below pins, pins below any future composite layer.

---

### Phase 4 — Weight Controls + H3 Scoring Engine

**Goal:** Each category row gets a weight slider (1–10). A background scoring engine divides Wandsworth into H3 hexagons (resolution 9), calculates a weighted composite score per hex based on active overlays, and renders a composite heatmap layer.

**Prompt for Claude Code:**

> Add the H3 hex scoring engine to the Wandsworth heatmap app.
>
> 1. Install `h3-js`.
>
> 2. Add a weight slider (1–10) to each enabled category row in the sidebar. Label: "Weight: 7/10".
>
> 3. Create `src/hooks/useScoring.ts`. This hook:
>    a. Takes the current list of enabled categories (each with their POIs, radius, and weight)
>    b. Gets all H3 hex indices at resolution 9 that fall within the Wandsworth boundary polygon
>    c. For each hex, for each active category:
>       - Gets the hex centroid lat/lng
>       - Checks if any POI in that category is within the configured radius of the centroid
>       - If yes: marks hex as "covered" by that category (binary coverage)
>    d. Calculates composite score per hex:
>       `score = Σ(weight of covering categories) / Σ(all active category weights)`
>       Normalised to 0.0–1.0
>    e. Returns an array of {hexId, score} objects
>
> 4. Render the scored hexes as a MapLibre fill-extrusion or fill layer:
>    - Only show hexes with score > 0
>    - Colour ramp: low score = cool blue (#BFDBFE), high score = warm red (#EF4444)
>    - Use a MapLibre interpolate expression for smooth colour transitions
>    - Opacity: 0.55
>    - This layer sits ABOVE the individual buffer layers
>
> 5. Add a small legend in the bottom-right corner of the map showing the colour ramp (low → high).
>
> 6. Scoring recalculates reactively whenever any category, radius, or weight changes.
>
> Performance note: resolution 9 hexes over Wandsworth will be ~2000–3000 hexes. 
> Computation should be near-instant client-side. If it lags, debounce recalculation by 300ms.

---

### Phase 5 — Threshold Slider + Index View Toggle

**Goal:** User sets a minimum score threshold. Hexes below threshold are hidden. A toggle button switches between "all overlays visible" mode and "index only" mode (hides individual buffers and pins, shows only composite hex layer).

**Prompt for Claude Code:**

> Add threshold filtering and view mode toggle to the Wandsworth heatmap app.
>
> 1. Add a threshold slider at the bottom of the sidebar:
>    - Label: "Show areas scoring above: 65%"
>    - Range: 0–100, default 0
>    - When set, hide all hex polygons with score below threshold/100
>    - Update the composite layer filter reactively
>
> 2. Add a "Show Index Only" toggle button at the bottom of the sidebar (prominent, full-width):
>    - When ON: hide all individual buffer fill layers and all POI pin layers. Show only the composite hex score layer (at slightly higher opacity: 0.7)
>    - When OFF: restore all active layers
>    - Button label toggles: "Show Index Only" / "Show All Layers"
>
> 3. Add a score summary panel below the threshold slider:
>    - "X% of borough above threshold"
>    - Updates reactively
>
> Style: keep the sidebar clean. Group controls logically — categories at top, scoring controls at bottom.

---

### Phase 6 — Session Save / Load

**Goal:** User can save named sessions to localStorage and restore them. Sessions persist the full app state: active categories, per-category radius and weight, threshold, and view mode.

**Prompt for Claude Code:**

> Add session save/load to the Wandsworth heatmap app using localStorage.
>
> 1. Create `src/store/sessionStore.ts` with functions:
>    - `saveSession(name, state)` — serialises and saves to localStorage under key `wheatmap_sessions`
>    - `loadSessions()` — returns array of saved sessions with name, id, savedAt
>    - `loadSession(id)` — returns full session state
>    - `deleteSession(id)` — removes from localStorage
>
> 2. Add a session bar at the top of the sidebar:
>    - "Save Session" button → prompts for a name (simple text input + confirm, no modal library needed) → saves current state
>    - A dropdown or small list of saved sessions → clicking one loads it, restoring all category states, radii, weights, threshold, and view mode
>    - Small delete icon next to each saved session
>
> 3. On app load, check if there's a last-active session and offer to restore it.
>
> 4. Session state shape (TypeScript interface `SessionState`):
> ```typescript
> {
>   id: string;
>   name: string;
>   savedAt: string;
>   layers: { categoryId: string; enabled: boolean; radius: number; weight: number }[];
>   threshold: number;
>   viewMode: "overlays" | "index";
> }
> ```
>
> Keep UI for sessions minimal — no modals, no animations, just functional.

---

## Deployment

```bash
# GitHub
git init
git remote add origin https://github.com/YOUR_ORG/wandsworth-heatmap.git

# Vercel
vercel --prod
# Add env var in Vercel dashboard: VITE_MAPTILER_KEY = your_key
```

---

## Key Gotchas for Claude Code

1. **MapLibre coordinate order** — GeoJSON uses [lng, lat], not [lat, lng]. Turf.js also uses [lng, lat]. H3 uses (lat, lng). Be explicit at every conversion.

2. **MapLibre source/layer cleanup** — always check `map.getSource(id)` before adding; always `map.removeLayer()` before `map.removeSource()`. Order matters.

3. **H3 resolution 9** — each hexagon is ~174m across (edge to edge). Good granularity for borough-level scoring. Don't go higher than 9 without performance testing.

4. **Wandsworth boundary for H3** — use `h3.polygonToCells()` with the ONS boundary polygon coordinates to get all hex indices within the borough.

5. **MapTiler key** — never commit `.env.local` to git. Add to `.gitignore` from day one.

---

## Data Notes

All POI data is in `src/data/pois/`. Files are curated static JSON — verify coordinates before launch using Google Maps. Coordinates are in decimal degrees, WGS84.

Coffee shops and gastropubs are intentionally left as stubs for manual curation by the project owner. Add locations to the JSON files directly.

---

## Future Phases (not in scope for v1)

- Supabase + auth for cloud session saving and user profiles
- Walking isochrones via OpenRouteService API (replace circle buffers)
- Additional categories: cycle infrastructure, Ofsted outstanding schools, farmers markets
- Export: download scored map as PNG or share URL with encoded state
- Mobile responsive layout
