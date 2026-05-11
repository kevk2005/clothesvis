import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import type { BodyScan } from '@/models/types'

interface AvatarModelProps {
  scan: BodyScan
}

/** Renders the body scan mesh. Falls back to a parametric mannequin when no mesh URL is provided. */
export function AvatarModel({ scan }: AvatarModelProps) {  if (scan.bodyMesh) {
    const isGLB = scan.bodyMesh.endsWith('.glb') || scan.bodyMesh.endsWith('.gltf')
    return isGLB
      ? <GLBAvatar url={scan.bodyMesh} />
      : <OBJAvatar url={scan.bodyMesh} />
  }

  // Parametric mannequin built from measurements
  return <ProceduralAvatar scan={scan} />
}

function GLBAvatar({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url)
  return <primitive object={gltf.scene} />
}

function OBJAvatar({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url)
  return <primitive object={obj} />
}

function ProceduralAvatar({ scan }: { scan: BodyScan }) {
  const { height, chest, waist, hips } = scan.measurements
  const scale = height / 170 // normalise to 170 cm reference

  const torsoH = 0.55 * scale
  const torsoR = (chest / 100) * 0.18

  const hipR = (hips / 100) * 0.19
  const waistR = (waist / 100) * 0.15

  return (
    <group position={[0, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.65 * scale, 0]} castShadow>
        <sphereGeometry args={[0.12 * scale, 24, 24]} />
        <meshStandardMaterial color={scan.avatarConfig.skinTone} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.1 * scale, 0]} castShadow>
        <cylinderGeometry args={[torsoR, waistR, torsoH, 24]} />
        <meshStandardMaterial color={scan.avatarConfig.skinTone} />
      </mesh>
      {/* Hips */}
      <mesh position={[0, 0.72 * scale, 0]} castShadow>
        <cylinderGeometry args={[waistR, hipR, 0.25 * scale, 24]} />
        <meshStandardMaterial color={scan.avatarConfig.skinTone} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-hipR * 0.55, 0.28 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.07 * scale, 0.055 * scale, 0.7 * scale, 16]} />
        <meshStandardMaterial color={scan.avatarConfig.skinTone} />
      </mesh>
      {/* Right leg */}
      <mesh position={[hipR * 0.55, 0.28 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.07 * scale, 0.055 * scale, 0.7 * scale, 16]} />
        <meshStandardMaterial color={scan.avatarConfig.skinTone} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-torsoR - 0.08 * scale, 1.15 * scale, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.045 * scale, 0.035 * scale, 0.55 * scale, 16]} />
        <meshStandardMaterial color={scan.avatarConfig.skinTone} />
      </mesh>
      {/* Right arm */}
      <mesh position={[torsoR + 0.08 * scale, 1.15 * scale, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.045 * scale, 0.035 * scale, 0.55 * scale, 16]} />
        <meshStandardMaterial color={scan.avatarConfig.skinTone} />
      </mesh>
    </group>
  )
}
