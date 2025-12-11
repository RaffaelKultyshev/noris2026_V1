import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SnowParticles({ count = 1000 }) {
  const pointsRef = useRef()
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400
      positions[i * 3 + 1] = Math.random() * 80 + 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400
      velocities[i] = Math.random() * 0.2 + 0.1
    }
    
    return { positions, velocities }
  }, [count])
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position.array
    
    for (let i = 0; i < count; i++) {
      // Fall down
      positions[i * 3 + 1] -= particles.velocities[i] * delta * 10
      
      // Drift slightly
      positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * delta * 0.5
      
      // Reset when hitting ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 80
        positions[i * 3] = (Math.random() - 0.5) * 400
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.3} 
        color="#ffffff" 
        transparent 
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

