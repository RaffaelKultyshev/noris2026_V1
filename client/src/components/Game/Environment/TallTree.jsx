import * as THREE from 'three'

export default function TallTree({ position, height = 25 }) {
  const trunkHeight = height * 0.4
  const crownHeight = height * 0.6
  
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, trunkHeight, 8]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
      
      {/* Lower crown */}
      <mesh position={[0, trunkHeight + crownHeight * 0.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[8, crownHeight * 0.4, 8]} />
        <meshStandardMaterial color="#1a4d1a" roughness={0.8} />
      </mesh>
      
      {/* Middle crown */}
      <mesh position={[0, trunkHeight + crownHeight * 0.6, 0]} castShadow receiveShadow>
        <coneGeometry args={[6, crownHeight * 0.35, 8]} />
        <meshStandardMaterial color="#1a5a1a" roughness={0.8} />
      </mesh>
      
      {/* Top crown */}
      <mesh position={[0, trunkHeight + crownHeight * 0.85, 0]} castShadow receiveShadow>
        <coneGeometry args={[4, crownHeight * 0.25, 8]} />
        <meshStandardMaterial color="#206020" roughness={0.8} />
      </mesh>
      
      {/* Snow on branches */}
      <mesh position={[0, trunkHeight + crownHeight * 0.3, 0]} receiveShadow>
        <coneGeometry args={[8.2, 0.5, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  )
}

