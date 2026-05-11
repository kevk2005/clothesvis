# public/textures

Place clothing overlay textures and fabric textures here.

Naming convention:
- `<itemId>-overlay.png`   — transparent PNG used for body overlay
- `<itemId>-<color>.jpg`   — fabric/texture image for a specific color variant
- `<itemId>-depth.png`     — optional depth map for 3D draping

These are referenced in `ClothingItem.images.overlayMask` and `ClothingColor.textureUrl`.
