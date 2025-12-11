import * as THREE from 'three'

export default function ChristmasHouse({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* House base */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 4, 5]} />
        <meshStandardMaterial color="#8b6f47" roughness={0.8} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[3.5, 2, 4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} /> {/* Snow on roof */}
      </mesh>
      
      {/* Windows - glowing */}
      <mesh position={[-1, 2, 2.51]}>
        <planeGeometry args={[0.8, 1]} />
        <meshStandardMaterial 
          color="#ffcc66" 
          emissive="#ff9933" 
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[1, 2, 2.51]}>
        <planeGeometry args={[0.8, 1]} />
        <meshStandardMaterial 
          color="#ffcc66" 
          emissive="#ff9933" 
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, 1, 2.51]}>
        <planeGeometry args={[0.8, 1.5]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
      </mesh>
      
      {/* Christmas lights string */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-1.5 + i * 0.4, 3.8, 2.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color={['#ff0000', '#00ff00', '#0000ff', '#ffff00'][i % 4]} 
            emissive={['#ff0000', '#00ff00', '#0000ff', '#ffff00'][i % 4]} 
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      
      {/* Chimney */}
      <mesh position={[1.5, 5, 0]} castShadow>
        <boxGeometry args={[0.6, 1.5, 0.6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
    </group>
  )
}

