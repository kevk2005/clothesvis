import { useEffect, useRef, useState, useCallback } from 'react'
import type { Keypoint } from '@/models/types'

// Lazy-loaded to avoid blocking the main bundle
async function loadPoseLandmarker() {
  const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
  )
  return PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numPoses: 1,
  })
}

export interface UsePoseDetectorReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  landmarks: Keypoint[] | undefined
  isReady: boolean
  error: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  captureFrame: () => string | null  // returns data URL
}

export function usePoseDetector(): UsePoseDetectorReturn {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const detectorRef = useRef<Awaited<ReturnType<typeof loadPoseLandmarker>> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [landmarks, setLandmarks] = useState<Keypoint[] | undefined>()
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const drawSkeleton = useCallback((lms: Keypoint[]) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw connections
    const connections = [
      [11, 12], [11, 23], [12, 24], [23, 24],   // torso
      [11, 13], [13, 15],                         // left arm
      [12, 14], [14, 16],                         // right arm
      [23, 25], [25, 27],                         // left leg
      [24, 26], [26, 28],                         // right leg
    ]

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'rgba(108, 99, 255, 0.85)'
    ctx.lineWidth = 3

    for (const [a, b] of connections) {
      const p1 = lms[a]
      const p2 = lms[b]
      if (!p1 || !p2 || p1.visibility < 0.4 || p2.visibility < 0.4) continue
      ctx.beginPath()
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height)
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height)
      ctx.stroke()
    }

    // Draw landmarks
    for (const lm of lms) {
      if (lm.visibility < 0.4) continue
      ctx.beginPath()
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fill()
    }
  }, [])

  const runDetection = useCallback(() => {
    const video = videoRef.current
    const detector = detectorRef.current
    if (!video || !detector || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runDetection)
      return
    }

    const result = detector.detectForVideo(video, performance.now())
    const lms = result.landmarks[0] as Keypoint[] | undefined
    setLandmarks(lms)
    if (lms) drawSkeleton(lms)

    rafRef.current = requestAnimationFrame(runDetection)
  }, [drawSkeleton])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      if (!detectorRef.current) {
        detectorRef.current = await loadPoseLandmarker()
      }

      setIsReady(true)
      rafRef.current = requestAnimationFrame(runDetection)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Camera access failed')
    }
  }, [runDetection])

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setIsReady(false)
    setLandmarks(undefined)
  }, [])

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current
    if (!video) return null
    const offscreen = document.createElement('canvas')
    offscreen.width = video.videoWidth
    offscreen.height = video.videoHeight
    offscreen.getContext('2d')?.drawImage(video, 0, 0)
    return offscreen.toDataURL('image/jpeg', 0.92)
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  return { videoRef, canvasRef, landmarks, isReady, error, startCamera, stopCamera, captureFrame }
}
