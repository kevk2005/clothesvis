// ─── Body & Avatar ────────────────────────────────────────────────────────────

export type ScanState =
  | 'no_body'       // "Step into frame"
  | 'too_close'     // "Move back"
  | 'too_far'       // "Move closer"
  | 'not_centered'  // "Move left / right"
  | 'partial_body'  // "Make sure full body is visible"
  | 'ready'         // "Hold still…" → countdown
  | 'capturing'     // flash + snapshot
  | 'turn_side'     // "Slowly turn to your right"
  | 'complete'      // "Scan complete"

export interface Keypoint {
  x: number           // normalized 0–1
  y: number           // normalized 0–1
  z: number
  visibility: number  // 0–1
}

export interface BodyScan {
  id: string
  userId: string
  createdAt: Date

  // Raw captures
  frontFrame: string        // data URL or remote URL
  sideFrame?: string

  // Pose data
  poseKeypoints: {
    front: Keypoint[]
    side?: Keypoint[]
  }

  // Derived measurements
  measurements: {
    height: number        // cm — user confirmed
    weight?: number       // kg — optional
    chest: number         // cm — computed
    waist: number         // cm — computed
    hips: number          // cm — computed
    inseam: number        // cm — computed
    shoulderWidth: number // cm — computed
    armLength: number     // cm — computed
  }

  measurementConfidence: number  // 0–1

  // For try-on rendering
  bodyMask?: string       // segmented silhouette PNG
  bodyMesh?: string       // GLB/OBJ if a real 3D mesh is available
  avatarConfig: AvatarConfig
}

export interface AvatarConfig {
  skinTone: string
  bodyShape: 'rectangle' | 'hourglass' | 'pear' | 'apple' | 'inverted-triangle'
  proportions: Record<string, number>  // normalized 0–1 scale for rendering
}

// ─── Clothing ─────────────────────────────────────────────────────────────────

export interface ClothingItem {
  id: string
  name: string
  brand: string
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories'
  tags: string[]
  price: number
  colors: ClothingColor[]
  sizes: Size[]
  images: {
    flat: string          // product photo on white bg
    model?: string        // on a reference model
    overlayMask: string   // PNG with transparency for body overlay
    depthMap?: string     // for 3D draping
  }
  fitData: {
    sizeChart: Record<string, Measurements>
    fitType: 'slim' | 'regular' | 'oversized'
    stretch: boolean
  }
}

export interface ClothingColor {
  name: string
  hex: string
  textureUrl?: string     // fabric texture for rendering
}

export interface Size {
  label: string           // "S", "M", "L", "XL", "32x30", etc.
  measurements: Measurements
  inStock: boolean
}

export interface Measurements {
  chest?: number
  waist?: number
  hips?: number
  length?: number
  inseam?: number
}

// ─── Outfit ───────────────────────────────────────────────────────────────────

export interface Outfit {
  id: string
  userId: string
  name: string
  items: { itemId: string; colorId: string; sizeLabel: string }[]
  createdAt: Date
  thumbnail?: string      // rendered preview snapshot
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  activeScan: BodyScan | null
  activeOutfit: Outfit | null
  selectedItems: Map<ClothingItem['category'], { item: ClothingItem; colorId: string; sizeLabel: string }>
}
