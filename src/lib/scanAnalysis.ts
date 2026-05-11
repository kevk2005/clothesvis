import type { Keypoint, ScanState } from '@/models/types'

// MediaPipe landmark indices
export const LM = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const

export const SCAN_MESSAGES: Record<ScanState, string> = {
  no_body:      'Step into frame',
  too_close:    'Move back a little',
  too_far:      'Move closer',
  not_centered: 'Center yourself',
  partial_body: 'Make sure your full body is visible',
  ready:        'Hold still…',
  capturing:    'Capturing…',
  turn_side:    'Slowly turn to your right',
  complete:     'Scan complete ✓',
}

/** Derive a ScanState from live MediaPipe landmarks */
export function evaluateScanState(landmarks: Keypoint[] | undefined): ScanState {
  if (!landmarks || landmarks.length < 29) return 'no_body'

  const visible = (idx: number) => landmarks[idx]?.visibility > 0.65

  const headOk   = visible(LM.NOSE)
  const anklesOk = visible(LM.LEFT_ANKLE) && visible(LM.RIGHT_ANKLE)

  if (!headOk || !anklesOk) {
    if (!landmarks[LM.NOSE]) return 'no_body'
    return 'partial_body'
  }

  const bodyHeight = landmarks[LM.LEFT_ANKLE].y - landmarks[LM.NOSE].y
  if (bodyHeight < 0.55) return 'too_far'
  if (bodyHeight > 0.87) return 'too_close'

  const centerX = (landmarks[LM.LEFT_SHOULDER].x + landmarks[LM.RIGHT_SHOULDER].x) / 2
  if (centerX < 0.38 || centerX > 0.62) return 'not_centered'

  return 'ready'
}

/** Derive measurements (cm) from front-view landmarks + known height */
export function extractMeasurements(
  frontLandmarks: Keypoint[],
  _sideLandmarks: Keypoint[] | undefined,
  knownHeightCm: number,
  imageWidth: number,
) {
  const lm = frontLandmarks

  // Pixel-space height of person
  const headY   = lm[LM.NOSE].y
  const ankleY  = (lm[LM.LEFT_ANKLE].y + lm[LM.RIGHT_ANKLE].y) / 2
  const pixelHeight = ankleY - headY
  const scale = knownHeightCm / pixelHeight  // cm per normalised unit

  // Shoulder width
  const shoulderPx = Math.abs(lm[LM.RIGHT_SHOULDER].x - lm[LM.LEFT_SHOULDER].x)
  const shoulderWidth = shoulderPx * scale * imageWidth

  // Hip width
  const hipPx = Math.abs(lm[LM.RIGHT_HIP].x - lm[LM.LEFT_HIP].x)
  const hipWidth = hipPx * scale * imageWidth

  // Inseam: knee → ankle
  const kneeMidY  = (lm[LM.LEFT_KNEE].y  + lm[LM.RIGHT_KNEE].y)  / 2
  const ankleMidY = (lm[LM.LEFT_ANKLE].y + lm[LM.RIGHT_ANKLE].y) / 2
  const inseam = (ankleMidY - kneeMidY) * scale * imageWidth

  // Arm length: shoulder → ankle rough proxy (shoulder → wrist missing in many cases)
  const armLength = shoulderWidth * 1.35  // heuristic until wrist is reliably visible

  // Circumference estimates using front + side depth (ellipse approximation)
  // Without depth we use a standard front/depth aspect ratio (≈0.65 for torso)
  const depthRatio = 0.65
  const hipCircumference   = ellipseCircumference(hipWidth / 2, (hipWidth * depthRatio) / 2)
  const waistCircumference = hipCircumference * 0.82   // heuristic
  const chestCircumference = hipCircumference * 0.95

  return {
    height:       knownHeightCm,
    chest:        round(chestCircumference),
    waist:        round(waistCircumference),
    hips:         round(hipCircumference),
    inseam:       round(inseam),
    shoulderWidth: round(shoulderWidth),
    armLength:    round(armLength),
  }
}

/** Confidence score 0–1 based on landmark visibility */
export function computeConfidence(landmarks: Keypoint[]): number {
  const keyIndices: number[] = Object.values(LM)
  const avg = keyIndices.reduce((sum, i) => sum + (landmarks[i]?.visibility ?? 0), 0) / keyIndices.length
  return Math.round(avg * 100) / 100
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ellipseCircumference(a: number, b: number): number {
  // Ramanujan approximation
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))
}

function round(n: number, decimals = 1) {
  return Math.round(n * 10 ** decimals) / 10 ** decimals
}
