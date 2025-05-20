# 3D City Simulator

This project is a standalone HTML5 demonstration that generates a 3D city using [three.js](https://threejs.org/).  The UI lets you adjust perspective, lighting, and building parameters directly in the browser.

## Running

No build step is required.  Open `index.html` in a modern WebGL‑enabled browser.  If your browser blocks local file access, serve the repository via a small HTTP server:

```bash
python3 -m http.server 8000
```

Navigate to `http://localhost:8000/` and the simulator will load.

## Features

- Adjustable 1‑, 2‑, and 3‑point perspective
- Customizable building shapes, sizes, and colors
- Lighting presets (day, night, sunset)
- Camera navigation tools (tumble, pan, dolly)
- Optional overlays for vanishing points, grids, and reference lines

## License

This project is released under the MIT License.  See [LICENSE](LICENSE) for details.
