# UI Brief: Wandsworth Heatmap

## Design Intent

Tech-product aesthetic. Dark sidebar, light map. The map is the hero — the sidebar is a precision instrument that frames it. Every element should feel considered, not decorative. Rounded, breathing, confident.

Reference: medical/fitness dashboard UIs — dense with controls but never cluttered. Information hierarchy is everything.

---

## Layout

```
┌──────────────────────┬─────────────────────────────────────────────┐
│                      │                                             │
│   SIDEBAR            │   MAP (full bleed, fills remaining space)  │
│   340px fixed        │                                             │
│   dark #161618       │   MapLibre GL — MapTiler Streets            │
│   full height        │                                             │
│   flex column        │                                             │
│                      │                                             │
└──────────────────────┴─────────────────────────────────────────────┘
```

- No top navbar. No bottom bar. Two columns, full viewport height.
- Map fills 100% of remaining width and height. No padding around it.
- Sidebar has a subtle right border only. No shadow.
- Desktop-first. Minimum viewport: 1280px wide.

---

## Colour Palette

```css
:root {
  /* Sidebar & UI */
  --bg-sidebar:      #161618;   /* Main sidebar background */
  --bg-card:         #222225;   /* Category card background */
  --bg-card-hover:   #2A2A2E;   /* Card hover state */
  --bg-card-active:  #252528;   /* Card when toggled on */

  /* Accent — single, used sparingly */
  --accent:          #D4F53C;   /* Yellow-lime. Active toggles, CTAs, sliders */
  --accent-dim:      rgba(212, 245, 60, 0.12);
  --accent-glow:     rgba(212, 245, 60, 0.25);

  /* Text */
  --text-primary:    #F2F0EB;   /* Main labels, card names */
  --text-secondary:  #6E6E75;   /* Sub-labels, counts, addresses */
  --text-tertiary:   #4A4A50;   /* Section headers, placeholder text */

  /* Borders */
  --border:          #2E2E33;   /* Default dividers and card borders */
  --border-light:    #3A3A40;   /* Slightly brighter for active elements */

  /* CTA */
  --cta-bg:          #F2F0EB;   /* "Show Index Only" button background */
  --cta-text:        #111111;   /* Button text */

  /* Category colours — for pins, buffer fills, slider tracks, dots */
  --c-gails:         #F59E0B;   /* Amber */
  --c-grocery:       #22C55E;   /* Green */
  --c-gyms:          #60A5FA;   /* Blue */
  --c-stations:      #818CF8;   /* Indigo */
  --c-parks:         #A3E635;   /* Lime */
  --c-coffee:        #C2855A;   /* Warm brown */
  --c-pubs:          #FB7185;   /* Rose */

  /* Map composite score colour ramp (low → high) */
  --score-low:       #BFDBFE;   /* Cool blue */
  --score-mid:       #FDE68A;   /* Warm yellow */
  --score-high:      #F97316;   /* Orange */
  --score-top:       #EF4444;   /* Red */
}
```

---

## Typography

**Font:** `DM Sans` (Google Fonts) — geometric, clean, slightly warmer than Inter.
**Mono accent:** `DM Mono` — used for numeric values only (slider values, score %).

```
App title          DM Sans  700   15px   letter-spacing: -0.02em
Section label      DM Sans  700    9.5px  UPPERCASE, letter-spacing: 0.12em  color: --text-tertiary
Category name      DM Sans  600   13px   letter-spacing: -0.01em
Control label      DM Sans  600   10px   UPPERCASE, letter-spacing: 0.06em   color: --text-tertiary
Value badge        DM Mono  500   11px
Threshold %        DM Mono  500   18px
Sub / count text   DM Sans  400   11px   color: --text-secondary
Button text        DM Sans  700   13px   letter-spacing: -0.01em
```

---

## Sidebar Structure (top → bottom)

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
│  App title + status dot                 │
│  Session selector + Save button         │
├─────────────────────────────────────────┤
│  ACTIVE LAYERS                          │
│  Section label                          │
│  Row of coloured pills (live)           │
├─────────────────────────────────────────┤
│  AMENITY LAYERS                         │
│  Section label                          │
│                                         │
│  [Category Card] × 7     ← scrollable  │
│  [Category Card]                        │
│  [Category Card]                        │
│  ...                                    │
├─────────────────────────────────────────┤
│  SCORE CONTROLS                         │
│  Threshold slider                       │
│  Borough coverage stat                  │
│  [Show Index Only] button               │
└─────────────────────────────────────────┘
```

---

## Component Specs

### Sidebar Header

```
padding: 20px 20px 16px
border-bottom: 1px solid var(--border)

App title row:
  h1: "Wandsworth Heatmap"  font: DM Sans 700 15px
  Status dot: 8px circle, var(--accent), glow shadow

Session row (below title):
  Session dropdown: bg-card, border, border-radius 10px, 12px DM Sans 500
  Save button: ghost (transparent bg, border, no fill), border-radius 10px
    hover → border: var(--accent), text: var(--accent)
```

### Active Layer Pills

```
Section label: "Active Layers"
Pill row below, wraps if needed

Each pill:
  bg: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 20px (full pill)
  padding: 3px 8px 3px 5px
  font: DM Sans 500 10px  color: var(--text-secondary)
  6px coloured dot on left

Empty state: "No layers active" in --text-tertiary
Pills animate in: opacity + scale from 0.8 → 1
```

### Category Card — Collapsed

```
background: var(--bg-card)
border: 1px solid var(--border)
border-radius: 14px
margin-bottom: 6px

Header row (12px 14px padding):
  Left:  9px coloured dot (category colour)
  Mid:   Category name  DM Sans 600 13px
  Right: Location count  DM Mono 10px  --text-tertiary
         Toggle switch
```

### Category Card — Active (toggled on)

```
background: var(--bg-card-active)
border: 1px solid var(--border-light)

Controls section below header:
  border-top: 1px solid var(--border)
  padding: 12px 14px 14px
  display: flex, flex-direction: column, gap: 12px

  [Radius control]
  [Weight control]
```

### Toggle Switch

```
width: 36px  height: 20px  border-radius: 10px

OFF:
  background: var(--border-light)
  thumb: 14px circle, --text-tertiary, left: 3px

ON:
  background: var(--accent-dim)
  border: 1px solid rgba(212, 245, 60, 0.3)
  thumb: 14px circle, var(--accent), translateX(16px)
  thumb box-shadow: 0 0 6px var(--accent-glow)

Transition: 0.2s on all properties
```

### Radius Slider

```
Label row:
  Left:  "WALKING RADIUS"  DM Sans 600 10px uppercase  --text-tertiary
  Right: Value badge  e.g. "600m"  DM Mono 500 11px
         bg: var(--border)  border-radius: 6px  padding: 2px 8px

Slider track:
  height: 3px  border-radius: 2px
  Fill colour: category colour (left of thumb)
  Unfilled: var(--border-light)
  Update fill via JS background gradient on input event

Thumb:
  14px circle
  background: var(--accent)
  box-shadow: 0 0 8px var(--accent-glow)
  hover: scale(1.25)

Range: 100m – 2000m  step: 50
```

### Weight Control

```
Label row:
  Left:  "SIGNIFICANCE"  DM Sans 600 10px uppercase  --text-tertiary
  Right: 10 dots (6px circles, 4px gap)
         Filled: var(--accent)
         Unfilled: var(--border-light)
         Updates live as slider moves

Slider: same style as radius slider (category colour fill)
Range: 1 – 10  step: 1
```

### Score Threshold (bottom panel)

```
Section separated by border-top: 1px solid var(--border)
padding: 16px 12px

Header row:
  Left:  "SCORE THRESHOLD"  DM Sans 700 9.5px uppercase  --text-tertiary
  Right: Current % value  DM Mono 500 18px  var(--accent)
         e.g. "62%"

Slider:
  Same style — accent yellow fill, var(--accent) thumb
  Range: 0 – 100  step: 1

Subtext below:
  "X% of borough above threshold"  DM Sans 400 11px  --text-tertiary
  Updates reactively
```

### Show Index Only Button

```
Full width of bottom panel
padding: 13px
background: var(--cta-bg)  (#F2F0EB)
color: var(--cta-text)
border: none
border-radius: 12px
font: DM Sans 700 13px  letter-spacing: -0.01em
cursor: pointer

Default state: light bg, dark text
  label: "Show Index Only"

Active state (index mode on):
  background: var(--accent)
  box-shadow: 0 4px 20px var(--accent-glow)
  label: "Show All Layers"

Hover:
  background: var(--accent)
  transform: translateY(-1px)
  box-shadow: 0 4px 20px var(--accent-glow)

Transition: all 0.2s
```

---

## Map UI Elements

### Borough Boundary Layer (MapLibre)

```
Source: ONS GeoJSON polygon
Layer type: line
Paint:
  line-color: rgba(242, 240, 235, 0.15)
  line-width: 1.5
  line-dasharray: [6, 4]
No fill layer. Boundary is orientation only, not a hard frame.
```

### POI Pin Layer (MapLibre circle layer)

```
circle-radius: 6
circle-color: [category colour]
circle-stroke-width: 1.5
circle-stroke-color: #000000
circle-stroke-opacity: 0.4

Hover popup:
  background: rgba(22, 22, 24, 0.95)
  border: 1px solid var(--border-light)
  border-radius: 10px
  padding: 8px 12px
  Name: DM Sans 600 11px  --text-primary
  Address: DM Sans 400 10px  --text-tertiary
  Appears above pin, slight translateY animation
```

### Buffer Overlay Layer (MapLibre fill layer, Turf circles)

```
fill-color: [category colour]
fill-opacity: 0.12
No stroke on buffers — streets must read through at all times
One fill layer per active category
Z-order: buffers below pins
```

### Composite Hex Score Layer (MapLibre fill layer, H3)

```
fill-color: interpolate expression
  0.0  →  #BFDBFE  (cool blue)
  0.4  →  #FDE68A  (warm yellow)
  0.7  →  #F97316  (orange)
  1.0  →  #EF4444  (red)

fill-opacity: 0.55
  In "Index Only" mode: 0.70

Z-order: above all buffer and pin layers

Threshold filter:
  Only render hexes where score >= threshold / 100
  MapLibre filter expression — no re-computation needed
```

### Borough Label (map overlay, HTML element)

```
Position: absolute, top: 20px, left: 24px (map-relative)
background: rgba(22, 22, 24, 0.85)
backdrop-filter: blur(8px)
border: 1px solid var(--border)
border-radius: 10px
padding: 8px 14px

Content:
  8px accent dot (with glow)
  "Wandsworth Borough"  DM Sans 600 12px
  "LB Wandsworth"  DM Sans 400 10px  --text-tertiary
```

### Score Toast (map overlay, top-right)

```
Position: absolute, top: 20px, right: 24px (map-relative)
Only visible when ≥1 layer is active

background: rgba(22, 22, 24, 0.92)
backdrop-filter: blur(8px)
border: 1px solid rgba(212, 245, 60, 0.2)
border-radius: 12px
padding: 10px 16px
text-align: right

Content:
  Large %  DM Mono 500 22px  var(--accent)  "32%"
  Label    DM Sans 400 10px  --text-tertiary  "areas above threshold"

Animates in: opacity + translateY(-4px → 0) on appearance
```

### Map Legend (bottom-right)

```
Position: absolute, bottom: 24px, right: 24px

background: rgba(22, 22, 24, 0.92)
backdrop-filter: blur(8px)
border: 1px solid var(--border)
border-radius: 12px
padding: 12px 14px

Content:
  "LIVEABILITY SCORE"  label  9px uppercase --text-tertiary
  120px colour ramp bar  6px height  border-radius: 3px
  background: linear-gradient(to right, #BFDBFE, #FDE68A, #F97316, #EF4444)
  "Low" / "High" labels  DM Mono 9px  --text-tertiary
```

---

## Interaction States

| Element | Default | Hover | Active/On |
|---|---|---|---|
| Category card | bg-card, dim border | bg-card-hover | bg-card-active, brighter border |
| Toggle | grey track, grey thumb | — | accent-dim track, accent thumb + glow |
| Slider thumb | accent colour | scale 1.25× | — |
| Save button | ghost, --text-secondary | accent border + text | — |
| Index button | light bg, dark text | accent bg, lift | accent bg, glow shadow |
| POI dot | category colour | popup appears | — |

---

## Animation Principles

- **No gratuitous animation.** Micro-interactions only.
- Category cards fade + slide in on initial load (staggered, 50ms between each)
- Toggle state: 0.2s ease on all properties
- Layer pills: scale(0.8) → scale(1) + opacity 0 → 1 on appear
- Score toast: translateY(-4px) → 0 + opacity on mount
- Slider thumb: scale on hover only
- Index button: translateY(-1px) on hover
- No skeleton loaders, no spinners. App loads fast — static data.

---

## What NOT to do

- No shadows on the sidebar itself — only the map has depth
- No gradient backgrounds on the sidebar
- No icons unless absolutely necessary — text labels and coloured dots carry the UI
- No modals — session saving uses inline UI only
- No tooltips on sliders — values are always visible as badges
- No animation on slider value changes — instant update
- Do not use Inter, Roboto, or system fonts — DM Sans only
- Do not use purple anywhere in the palette
- Do not add a top navigation bar
- Do not make the sidebar collapsible in v1
