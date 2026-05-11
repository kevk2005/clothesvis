import { useState } from 'react'
import { ViewerCanvas } from '@/components/viewer/ViewerCanvas'
import { ClothingSelector } from '@/components/clothing/ClothingSelector'
import { ScanPreface } from '@/components/scan/ScanPreface'
import { ScanSession } from '@/components/scan/ScanSession'
import { MOCK_CATALOGUE } from '@/data/mockCatalogue'
import { useVisualizerStore } from '@/store/useVisualizerStore'
import type { BodyScan } from '@/models/types'
import styles from './App.module.css'

type AppView = 'main' | 'preface' | 'scanning'

export default function App() {
  const [view, setView] = useState<AppView>('main')

  const activeScan    = useVisualizerStore((s) => s.activeScan)
  const setActiveScan = useVisualizerStore((s) => s.setActiveScan)
  const selectedItems = useVisualizerStore((s) => s.selectedItems)
  const clearItems    = useVisualizerStore((s) => s.clearItems)
  const saveOutfit    = useVisualizerStore((s) => s.saveOutfit)

  const itemCount = selectedItems.size

  function handleScanComplete(scan: BodyScan) {
    setActiveScan(scan)
    setView('main')
  }

  function handleSave() {
    const name = prompt('Name this outfit:')
    if (name) saveOutfit(name, 'local-user')
  }

  if (view === 'preface') {
    return (
      <div className={styles.app}>
        <ScanPreface
          onStart={() => setView('scanning')}
          onCancel={() => setView('main')}
        />
      </div>
    )
  }

  if (view === 'scanning') {
    return (
      <div className={styles.app}>
        <ScanSession onComplete={handleScanComplete} onCancel={() => setView('preface')} />
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>👗 Clothes Visualizer</h1>
        <div className={styles.headerActions}>
          <button
            className={`${styles.scanBtn} ${activeScan ? styles.scanBtnActive : ''}`}
            onClick={() => setView('preface')}
          >
            {activeScan ? '🔄 Re-scan' : '📷 Start Body Scan'}
          </button>

          {activeScan && (
            <div className={styles.scanBadge}>
              ✓ {activeScan.measurements.height}cm ·{' '}
              <span style={{ color: '#888', fontSize: '0.75rem' }}>
                {Math.round(activeScan.measurementConfidence * 100)}% confidence
              </span>
            </div>
          )}

          {itemCount > 0 && (
            <>
              <span className={styles.badge}>{itemCount} item{itemCount > 1 ? 's' : ''}</span>
              <button className={styles.saveBtn} onClick={handleSave}>Save Outfit</button>
              <button className={styles.clearBtn} onClick={clearItems}>Clear</button>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.viewer}>
          <ViewerCanvas />
        </section>

        <ClothingSelector catalogue={MOCK_CATALOGUE} />
      </main>
    </div>
  )
}