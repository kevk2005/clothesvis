import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { AvatarModel } from './AvatarModel'
import { ClothingOverlay } from './ClothingOverlay'
import { useVisualizerStore } from '@/store/useVisualizerStore'
import styles from './ViewerCanvas.module.css'

export function ViewerCanvas() {
  const activeScan = useVisualizerStore((s) => s.activeScan)
  const selectedItems = useVisualizerStore((s) => s.selectedItems)
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={canvasRef} className={styles.canvasWrapper}>
      {!activeScan ? (
        <div className={styles.placeholder}>
          <p>Upload a body scan to get started</p>
        </div>
      ) : (
        <Canvas camera={{ position: [0, 1.2, 3], fov: 45 }} shadows>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 2]} intensity={1} castShadow />
          <Environment preset="city" />
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={4} blur={2} />

          <AvatarModel scan={activeScan} />

          {Array.from(selectedItems.values()).map(({ item, colorId }) => (
            <ClothingOverlay
              key={item.id}
              clothingItem={item}
              colorId={colorId}
              avatarConfig={activeScan.avatarConfig}
            />
          ))}

          <OrbitControls
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
            enablePan={false}
            target={[0, 0.8, 0]}
          />
        </Canvas>
      )}
    </div>
  )
}
