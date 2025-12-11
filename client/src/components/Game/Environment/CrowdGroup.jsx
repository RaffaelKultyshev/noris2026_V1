import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function CrowdGroup({ position, count = 25, spreadX = 15, spreadZ = 8 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      pos.push({
        x: position[0] + (Math.random() - 0.5) * spreadX,
        y: position[1] + 0.8,
        z: position[2] + (Math.random() - 0.5) * spreadZ
      })
    }
    return pos
  }, [count, position, spreadX, spreadZ])
  
  // Set positions once, no animation
  useMemo(() => {
    if (!meshRef.current) return
    positions.forEach((pos, i) => {
      dummy.position.set(pos.x, pos.y, pos.z)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions, dummy])
  
  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow>
      <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
      <meshStandardMaterial color="#3a5a8a" roughness={0.7} />
    </instancedMesh>
  )
}
