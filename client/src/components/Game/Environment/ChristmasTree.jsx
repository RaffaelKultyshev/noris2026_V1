import * as THREE from 'three'

export default function ChristmasTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
      
      {/* Bottom cone */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[2, 2, 8]} />
        <meshStandardMaterial color="#1a4d1a" roughness={0.8} />
      </mesh>
      
      {/* Middle cone */}
      <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 1.8, 8]} />
        <meshStandardMaterial color="#1a5a1a" roughness={0.8} />
      </mesh>
      
      {/* Top cone */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1, 1.5, 8]} />
        <meshStandardMaterial color="#206020" roughness={0.8} />
      </mesh>
      
      {/* Snow on tree branches */}
      <mesh position={[0, 2.5, 0]} receiveShadow>
        <coneGeometry args={[2.1, 0.3, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.8, 0]} receiveShadow>
        <coneGeometry args={[1.6, 0.3, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 5, 0]} receiveShadow>
        <coneGeometry args={[1.1, 0.3, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  )
}

