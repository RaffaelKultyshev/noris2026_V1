import * as THREE from 'three'

export default function Stadium({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main structure */}
      <mesh position={[0, 15, 0]} castShadow receiveShadow>
        <torusGeometry args={[60, 8, 16, 32]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
      </mesh>
      
      {/* Seating tiers */}
      {Array.from({ length: 5 }).map((_, tier) => (
        <mesh 
          key={tier} 
          position={[0, 5 + tier * 2, 0]} 
          castShadow
        >
          <torusGeometry args={[55 - tier * 3, 1.5, 16, 32]} />
          <meshStandardMaterial 
            color={tier % 2 === 0 ? '#0066cc' : '#cc0000'} 
            roughness={0.6}
          />
        </mesh>
      ))}
      
      {/* Roof structure */}
      <mesh position={[0, 18, 0]} castShadow>
        <torusGeometry args={[65, 2, 16, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.6} />
      </mesh>
      
      {/* Support columns */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 60, 9, Math.sin(angle) * 60]} 
            castShadow
          >
            <cylinderGeometry args={[1.5, 1.5, 18, 8]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

