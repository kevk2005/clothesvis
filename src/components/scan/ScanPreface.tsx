import styles from './ScanPreface.module.css'

interface ScanPrefaceProps {
  onStart: () => void
  onCancel: () => void
}

const STEPS = [
  {
    icon: '📏',
    title: 'Stand 6 feet away',
    body: 'Position yourself so your full body fits in frame — head to toe.',
  },
  {
    icon: '🧍',
    title: 'Neutral pose',
    body: 'Stand straight, arms slightly away from your sides, feet shoulder-width apart.',
  },
  {
    icon: '💡',
    title: 'Good lighting',
    body: 'Face a light source. Avoid strong backlighting or dark rooms.',
  },
  {
    icon: '👕',
    title: 'Fitted clothing',
    body: 'Wear form-fitting clothes for the most accurate measurements — loose layers add noise.',
  },
]

export function ScanPreface({ onStart, onCancel }: ScanPrefaceProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.icon}>📷</span>
          <h1 className={styles.title}>Body Scan</h1>
          <p className={styles.subtitle}>
            We'll use your camera to take two quick photos — front and side — to
            estimate your measurements. Everything stays on your device.
          </p>
        </div>

        {/* Steps */}
        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li key={i} className={styles.step}>
              <span className={styles.stepIcon}>{step.icon}</span>
              <div>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* What to expect */}
        <div className={styles.note}>
          <strong>What happens next:</strong> the scan takes about 30 seconds.
          You'll hold still for a front photo, then slowly turn for a side photo.
          After that you can review and adjust all measurements before continuing.
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Maybe later
          </button>
          <button className={styles.startBtn} onClick={onStart}>
            I'm ready — Start Scan →
          </button>
        </div>
      </div>
    </div>
  )
}
