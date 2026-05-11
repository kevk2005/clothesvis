import { useState } from 'react'
import type { BodyScan } from '@/models/types'
import styles from './MeasurementConfirmation.module.css'

interface Props {
  scan: BodyScan
  onConfirm: (scan: BodyScan) => void
  onRetake: () => void
}

type MeasurementKey = keyof BodyScan['measurements']

const LABELS: Record<MeasurementKey, string> = {
  height:       'Height (cm)',
  weight:       'Weight (kg)',
  chest:        'Chest (cm)',
  waist:        'Waist (cm)',
  hips:         'Hips (cm)',
  inseam:       'Inseam (cm)',
  shoulderWidth:'Shoulder width (cm)',
  armLength:    'Arm length (cm)',
}

export function MeasurementConfirmation({ scan, onConfirm, onRetake }: Props) {
  const [measurements, setMeasurements] = useState({ ...scan.measurements })

  function update(key: MeasurementKey, value: number) {
    setMeasurements((prev) => ({ ...prev, [key]: value }))
  }

  function handleConfirm() {
    onConfirm({ ...scan, measurements })
  }

  const confidence = Math.round(scan.measurementConfidence * 100)
  const confidenceColor = confidence >= 80 ? '#27ae60' : confidence >= 60 ? '#f39c12' : '#e74c3c'

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Confirm Your Measurements</h2>

        <div className={styles.confidence}>
          <span>Detection confidence:</span>
          <strong style={{ color: confidenceColor }}>{confidence}%</strong>
        </div>

        {/* Preview frames */}
        <div className={styles.frames}>
          <div className={styles.frame}>
            <img src={scan.frontFrame} alt="Front scan" />
            <span>Front</span>
          </div>
          {scan.sideFrame && (
            <div className={styles.frame}>
              <img src={scan.sideFrame} alt="Side scan" />
              <span>Side</span>
            </div>
          )}
        </div>

        {/* Editable measurements */}
        <div className={styles.grid}>
          {(Object.keys(LABELS) as MeasurementKey[]).map((key) => {
            const val = measurements[key]
            if (val === undefined) return null
            return (
              <label key={key} className={styles.field}>
                <span>{LABELS[key]}</span>
                <input
                  type="number"
                  value={val}
                  step={0.5}
                  onChange={(e) => update(key, parseFloat(e.target.value))}
                  className={styles.input}
                />
              </label>
            )
          })}
        </div>

        <div className={styles.actions}>
          <button className={styles.retakeBtn} onClick={onRetake}>↩ Retake Scan</button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>Confirm & Continue →</button>
        </div>
      </div>
    </div>
  )
}
