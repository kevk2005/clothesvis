import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { AvatarConfig, ClothingItem } from '@/models/types'

interface ClothingOverlayProps {
  clothingItem: ClothingItem
  colorId: string
  avatarConfig: AvatarConfig
}

const CATEGORY_POSITION: Record<ClothingItem['category'], [number, number, number]> = {
  tops:        [0, 1.1, 0.01],
  bottoms:     [0, 0.6, 0.01],
  dresses:     [0, 0.9, 0.01],
  outerwear:   [0, 1.1, 0.02],
  shoes:       [0, -0.05, 0.01],
  accessories: [0, 1.5, 0.01],
}

const CATEGORY_SCALE: Record<ClothingItem['category'], [number, number, number]> = {
  tops:        [0.55, 0.45, 1],
  bottoms:     [0.52, 0.55, 1],
  dresses:     [0.55, 0.9, 1],
  outerwear:   [0.62, 0.5, 1],
  shoes:       [0.25, 0.12, 1],
  accessories: [0.2, 0.2, 1],
}

export function ClothingOverlay({ clothingItem, colorId }: Omit<ClothingOverlayProps, 'avatarConfig'> & Pick<ClothingOverlayProps, 'avatarConfig'>) {
  const color = clothingItem.colors.find((c) => c.name === colorId) ?? clothingItem.colors[0]
  const textureUrl = color?.textureUrl ?? clothingItem.images.overlayMask

  const texture = useTexture(textureUrl)
  texture.colorSpace = THREE.SRGBColorSpace

  const position = CATEGORY_POSITION[clothingItem.category]
  const scale = CATEGORY_SCALE[clothingItem.category]

  return (
    <mesh position={position} scale={scale} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.1}
        depthWrite={false}
        color={color?.hex ?? '#ffffff'}
      />
    </mesh>
  )
}
