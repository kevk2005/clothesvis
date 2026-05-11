# Clothes Visualizer

A 3D clothes visualizer built with **React + TypeScript**, **Three.js**, and **React Three Fiber**.  
Upload a 3D body scan (GLB/GLTF/OBJ) or use the procedural mannequin, then browse the catalogue to try on items in real-time.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- 📤 **Upload body scans** — GLB, GLTF, OBJ, or image files
- 🧍 **Procedural mannequin** — auto-generated from measurements when no mesh is provided  
- 👕 **Clothing overlay** — transparent PNG overlays draped onto the avatar  
- 🎨 **Color & size selection** — per-item colour swatches and size picker  
- 💾 **Save outfits** — persist multi-item combinations with a name  
- 🔍 **Search & filter** — find items by name, brand, tag, or category

## Adding Your Own Clothes

1. Add overlay images to `public/textures/` (PNG with transparency)
2. Add entries to `src/data/mockCatalogue.ts` following the `ClothingItem` interface
3. Optionally add `textureUrl` per colour for fabric textures

## Adding 3D Body Scans

Drop `.glb`, `.gltf`, or `.obj` files into `public/models/`.  
At runtime, click **Upload Body Scan** and select the file — the viewer will load and display the mesh.

## Project Structure

```
src/
  components/
    viewer/         # 3D canvas, avatar, clothing overlay
    clothing/       # Catalogue selector & cards
  store/            # Zustand global state
  models/           # TypeScript interfaces
  data/             # Mock catalogue data
public/
  models/           # 3D scan assets
  textures/         # Overlay & fabric textures
```

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 5 |
| 3D | Three.js + React Three Fiber |
| Helpers | @react-three/drei |
| State | Zustand |
