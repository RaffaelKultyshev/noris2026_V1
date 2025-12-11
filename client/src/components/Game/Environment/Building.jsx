import * as THREE from 'three'

export default function Building({ position, height = 40, width = 10, depth = 10 }) {
  const floors = Math.floor(height / 3)
  
  return (
    <group position={position}>
      {/* Main building structure */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.7} />
      </mesh>
      
      {/* Windows grid */}
      {Array.from({ length: floors }).map((_, floor) => (
        Array.from({ length: 4 }).map((_, col) => (
          <mesh 
            key={`${floor}-${col}`} 
            position={[
              -width/2 + 2 + col * 2, 
              2 + floor * 3, 
              depth/2 + 0.01
            ]}
          >
            <planeGeometry args={[1, 1.5]} />
            <meshStandardMaterial 
              color="#ffeecc" 
              emissive="#ffcc66" 
              emissiveIntensity={Math.random() > 0.3 ? 0.8 : 0.1}
            />
          </mesh>
        ))
      ))}
      
      {/* Roof */}
      <mesh position={[0, height + 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 1, 1, depth + 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
    </group>
  )
}

