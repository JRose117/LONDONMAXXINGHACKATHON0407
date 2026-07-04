# Unlock London

A location-based heritage discovery game for the City of London. Walk the map, get within range of landmarks to unlock collectible cards, and browse your collection in a retro pixel-art UI.

No build step, no dependencies to install — just static files served over HTTP.

## Requirements

- A modern browser (Chrome, Safari, Firefox, Edge)
- Location services enabled on your device
- A local static file server (see below)

Geolocation only works on **HTTPS** or **localhost**. Opening `index.html` directly from the filesystem (`file://`) will not work.

## Setup from scratch

### 1. Get the project

```bash
git clone <repository-url>
cd london-maxxing
```

Or download and unzip the project, then `cd` into the folder.

### 2. Start a local server

Pick any option — they all work the same:

**Python 3** (usually pre-installed on macOS/Linux):

```bash
python3 -m http.server 8080
```

**Node.js** (if you have `npx`):

```bash
npx serve .
```

**PHP**:

```bash
php -S localhost:8080
```

### 3. Open the app

Visit [http://localhost:8080](http://localhost:8080) in your browser.

Allow location access when prompted. Your position appears on the map and updates as you move. Landmarks unlock automatically when you are within **100 m**.

## How to play

| Action | What it does |
|--------|----------------|
| **MAP** tab | Explore landmarks on the Leaflet map |
| **CARDS** tab | View unlocked and locked collectibles |
| Tap a landmark pin | Open details (distance shown for locked sites) |
| Walk within 100 m of a landmark | Auto-unlock and celebration animation |

Progress is saved in `localStorage` under the key `unlock-london:v1`.

## Demo mode (testing without being in London)

Useful for development or trying the app away from the landmarks.

1. Tap the **UNLOCK LONDON** title **5 times** quickly to reveal the **DBG** button (bottom-left).
2. Click **DBG** or press **D** to toggle demo mode (a **DEMO** badge appears).
3. Use **Teleport to next locked landmark** (bottom-right) to jump your position to the nearest locked site and trigger unlocks.

Turn demo mode off with **DBG** or **D** again to return to real GPS.

## Project structure

```
london-maxxing/
├── index.html      # App shell, map logic, geolocation, unlock flow
├── style.css       # All styles (pixel UI, map markers, cards)
├── landmarks.json  # Landmark data (coords, rarity, flavour text)
├── manifest.json   # PWA manifest
├── sw.js           # Service worker (offline caching)
└── README.md
```

External assets loaded at runtime:

- [Leaflet](https://leafletjs.com/) 1.9.4 (map)
- [Carto Voyager](https://carto.com/) tiles (map imagery)
- [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (pixel font)

## Adding a landmark

Edit `landmarks.json` and append an object:

```json
{
  "id": "my-landmark",
  "name": "My Landmark",
  "lat": 51.5100,
  "lng": -0.0900,
  "rarity": "common",
  "flavour": "Short description shown on the card."
}
```

| Field | Notes |
|-------|--------|
| `id` | Unique slug (used for storage and map icons) |
| `lat` / `lng` | WGS84 coordinates |
| `rarity` | One of: `common`, `rare`, `epic`, `legendary` |

Optional: add a map pin emoji in the `POI_ICONS` object in `index.html` for your new `id`.

After changing `landmarks.json`, hard-refresh the browser. If the service worker serves stale data, unregister it in DevTools → Application → Service Workers, or bump `CACHE_NAME` in `sw.js`.

## Deploying

Host the folder on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.). **HTTPS is required** for geolocation in production.

Ensure these files are served from the same origin:

- `index.html`, `style.css`, `landmarks.json`, `manifest.json`, `sw.js`

No environment variables or API keys are needed.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Location never appears | Serve over `localhost` or HTTPS; allow location in browser settings |
| "Could not load landmarks" | You must use a static server — not `file://` |
| Wrong or stuck position | Check demo mode is off; refresh and re-allow location |
| Map tiles missing | Check network access (Carto CDN) |
| Old landmarks after edit | Hard refresh or clear service worker cache |

## License

Hackathon project — add a license here if you plan to open-source it.
