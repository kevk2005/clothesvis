import { useCallback, useEffect, useRef, useState } from 'react'
import { usePoseDetector } from '@/hooks/usePoseDetector'
import { evaluateScanState, extractMeasurements, computeConfidence, SCAN_MESSAGES } from '@/lib/scanAnalysis'
import { MeasurementConfirmation } from './MeasurementConfirmation'
import type { BodyScan, ScanState, AvatarConfig } from '@/models/types'
import styles from './ScanSession.module.css'

interface ScanSessionProps {
  onComplete: (scan: BodyScan) => void
  onCancel: () => void
}

const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: '#c68642',
  bodyShape: 'rectangle',
  proportions: {},
}

const COUNTDOWN_SECONDS = 3

export function ScanSession({ onComplete, onCancel }: ScanSessionProps) {
  const { videoRef, canvasRef, landmarks, error, startCamera, stopCamera, captureFrame } =
    usePoseDetector()

  const [scanState, setScanState] = useState<ScanState>('no_body')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [heightCm, setHeightCm] = useState(170)
  const [frontFrame, setFrontFrame] = useState<string | null>(null)
  const [frontLandmarks, setFrontLandmarks] = useState<typeof landmarks>(undefined)
  const [pendingScan, setPendingScan] = useState<BodyScan | null>(null)

  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const readyTicksRef = useRef(0)   // debounce "ready" before starting countdown

  // Start camera on mount
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  // Evaluate pose every frame — also triggers countdown once pose is held long enough
  useEffect(() => {
    // Don't interfere with side capture or completion phases
    if (scanState === 'turn_side' || scanState === 'complete' || scanState === 'capturing') return

    const state = evaluateScanState(landmarks)

    if (state !== 'ready') {
      readyTicksRef.current = 0
      setCountdown(null)
      if (countdownRef.current) clearTimeout(countdownRef.current)
    } else {
      readyTicksRef.current++
      // Start countdown after ~20 frames of sustained 'ready' and only if not already counting
      if (readyTicksRef.current === 20 && !frontFrame) {
        setCountdown(COUNTDOWN_SECONDS)
      }
    }

    setScanState(state)
  }, [landmarks, frontFrame, scanState])

  // Decrement countdown
  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      handleCaptureFront()
      return
    }
    countdownRef.current = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000)
    return () => { if (countdownRef.current) clearTimeout(countdownRef.current) }
  }, [countdown]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCaptureFront = useCallback(() => {
    const frame = captureFrame()
    if (!frame || !landmarks) return
    setFrontFrame(frame)
    setFrontLandmarks(landmarks)   // save front landmarks before person turns
    setScanState('turn_side')
    setCountdown(null)
    readyTicksRef.current = 0
  }, [captureFrame, landmarks])

  const handleCaptureSide = useCallback(() => {
    const frame = captureFrame()
    if (!frame || !frontFrame || !frontLandmarks) return
    setScanState('complete')

    // Use front landmarks (not side) for measurement extraction — side view is for depth only
    const videoWidth = videoRef.current?.videoWidth ?? 1280
    const measurements = extractMeasurements(frontLandmarks, landmarks, heightCm, videoWidth)
    const confidence = computeConfidence(frontLandmarks)

    const scan: BodyScan = {
      id: crypto.randomUUID(),
      userId: 'local',
      createdAt: new Date(),
      frontFrame,
      sideFrame: frame,
      poseKeypoints: {
        front: frontLandmarks,
        side: landmarks ?? undefined,
      },
      measurements,
      measurementConfidence: confidence,
      avatarConfig: DEFAULT_AVATAR,
    }
    setPendingScan(scan)
    stopCamera()
  }, [captureFrame, landmarks, frontFrame, frontLandmarks, heightCm, videoRef, stopCamera])

  // If we have a pending scan, show the confirmation screen
  if (pendingScan) {
    return (
      <MeasurementConfirmation
        scan={pendingScan}
        onConfirm={(confirmed: BodyScan) => onComplete(confirmed)}
        onRetake={() => {
          setPendingScan(null)
          setFrontFrame(null)
          setScanState('no_body')
          startCamera()
        }}
      />
    )
  }

  const stateColor =
    scanState === 'ready' ? '#27ae60' :
    scanState === 'capturing' ? '#f39c12' : '#6c63ff'

  return (
    <div className={styles.session}>
      {/* Height input */}
      <div className={styles.heightBar}>
        <label className={styles.heightLabel}>
          Your height:
          <input
            type="number"
            min={130}
            max={220}
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className={styles.heightInput}
          />
          cm
        </label>
        <button className={styles.cancelBtn} onClick={onCancel}>✕ Cancel</button>
      </div>

      {/* Instructions */}
      <div className={styles.instructionBanner}>
        {scanState === 'turn_side' ? (
          <>
            <p className={styles.instructionMain}>Slowly turn to your right</p>
            <button className={styles.captureBtn} onClick={handleCaptureSide}>
              Capture Side View
            </button>
          </>
        ) : (
          <p className={styles.instructionMain} style={{ color: stateColor }}>
            {countdown !== null
              ? `Hold still… ${countdown}`
              : SCAN_MESSAGES[scanState]}
          </p>
        )}
      </div>

      {/* Camera view */}
      <div className={styles.cameraWrapper}>
        {/* Silhouette guide — switches between front and side view */}
        <div className={styles.silhouetteGuide}>
          {scanState === 'turn_side' ? (
            // Side profile silhouette
            <svg viewBox="0 0 200 480" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="105" cy="40" rx="22" ry="34" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" />
              <path d="M95 74 Q80 100 78 180 L128 180 Q132 100 127 74" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <path d="M78 180 Q72 230 76 280 L106 280 L104 440 L90 470" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <path d="M128 180 Q132 230 128 280 L108 280 L110 440 L118 470" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <path d="M95 74 Q68 90 55 150" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            </svg>
          ) : (
            // Front-facing silhouette
            <svg viewBox="0 0 200 480" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="40" rx="28" ry="36" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" />
              <path d="M72 76 Q60 120 58 180 L142 180 Q140 120 128 76" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <path d="M58 180 Q52 220 54 280 L96 280 L96 440 L80 470" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <path d="M142 180 Q148 220 146 280 L104 280 L104 440 L120 470" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <path d="M72 76 Q42 100 30 160" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <path d="M128 76 Q158 100 170 160" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            </svg>
          )}
        </div>

        {error ? (
          <div className={styles.errorState}>
            <p>📷 {error}</p>
            <button onClick={() => startCamera()}>Retry</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} className={styles.video} muted playsInline />
            <canvas ref={canvasRef} className={styles.skeletonCanvas} />
          </>
        )}

        {/* State indicator dot */}
        <div className={styles.stateDot} style={{ background: stateColor }} />

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className={styles.countdownOverlay}>{countdown || '📸'}</div>
        )}
      </div>

      {/* Front frame captured indicator */}
      {frontFrame && scanState !== 'turn_side' && (
        <div className={styles.capturedBadge}>✓ Front captured</div>
      )}
    </div>
  )
}
