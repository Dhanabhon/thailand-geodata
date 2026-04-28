# Thailand Geodata Map

An interactive choropleth map of Thailand's 77 provinces. Click any province to see its districts, sub-districts, and the full list of postal codes — all driven by the JSON data in this repository.

## Live Demo

`https://[username].github.io/thailand-geodata/examples/web-map/`

## What it does

- **Choropleth map** colored by district count per province
- **Hover** any province for a tooltip with name + district count
- **Click** to drill down: stats (districts, sub-districts, postal codes), full district list, and unique postal codes for that province
- **Language toggle** between Thai and English (province + district names, tooltips)
- **Reset view** to fit Thailand again

## Stack

- **Leaflet 1.9** — open-source map library (loaded via unpkg CDN)
- **CARTO Positron** tiles — clean, light basemap
- **Province boundaries** — [`apisit/thailand.json`](https://github.com/apisit/thailand.json) (loaded from GitHub raw)
- **Geodata** — `json/provinces.json`, `json/districts.json`, `json/sub_districts.json` from this repository
- **Vanilla JavaScript** — no build step, no framework

## Local development

```bash
cd examples/web-map

# Pick any static server
python -m http.server 8000
# or
npx serve .

# Open
open http://localhost:8000
```

The page detects `localhost` / `127.0.0.1` and loads the JSON files from the repo via relative path. On GitHub Pages it falls back to the raw GitHub URL.

## How province matching works

The `apisit/thailand.json` GeoJSON uses English province names in `properties.name`. The app normalizes those names (lowercase, strip "Changwat" prefix, collapse spaces) and joins them to `provinces.json` by `PROVINCE_ENGLISH`. A small alias table handles edge cases like:

- `Bangkok Metropolis` → `Bangkok`
- `Phra Nakhon Si Ayutthaya` → `Ayutthaya`
- `Buri Ram` → `Buriram`

Any features that fail to match are logged via `console.warn` and rendered in neutral gray so they don't break the map.

## File structure

```
web-map/
├── index.html   # Page shell + Leaflet/FontAwesome imports
├── app.js       # Map setup, GeoJSON matching, click handler, info panel
├── styles.css   # Layout, choropleth legend, info panel, responsive rules
└── README.md
```

## Customization

### Color scale

Edit `CHOROPLETH_STOPS` at the top of `app.js`:

```js
const CHOROPLETH_STOPS = [
    { max: 5,  color: '#ede7f6' },
    { max: 10, color: '#d1c4e9' },
    // ...
];
```

The metric is *district count per province*. Swap it for sub-district count or postal-code count by changing the value passed to `colorFor()` in `styleFor()`.

### Basemap

Swap the `L.tileLayer` URL in `initMap()` for any OSM-compatible tile provider (OpenStreetMap, Stadia, Mapbox, etc.). Make sure to comply with each provider's attribution and usage limits.

### Bundling the GeoJSON

For fully offline use, download `thailand.json` once and replace the `GEOJSON_URL` constant with a relative path (e.g. `./thailand.json`). This also avoids the runtime dependency on raw.githubusercontent.com.

## Browser support

Modern browsers with ES6 classes, `fetch`, and CSS Grid: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+.

## Related

- [`../web-app/`](../web-app/) — grid-based explorer with postal-code lookup. Use this when you want a searchable list view rather than a map.
