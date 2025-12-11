import * as THREE from 'three'

export default function Mountains() {
  return (
    <group>
      {/* Mountain range 1 - Left background */}
      <mesh position={[-400, 0, 200]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[80, 120, 8]} />
        <meshStandardMaterial color="#6a7a8a" roughness={0.9} />
      </mesh>
      <mesh position={[-450, 0, 300]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[100, 150, 8]} />
        <meshStandardMaterial color="#5a6a7a" roughness={0.9} />
      </mesh>
      <mesh position={[-500, 0, 400]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
        <coneGeometry args={[90, 140, 8]} />
        <meshStandardMaterial color="#6a7a8a" roughness={0.9} />
      </mesh>
      
      {/* Mountain range 2 - Right background */}
      <mesh position={[900, 0, 300]} rotation={[0, -0.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[85, 130, 8]} />
        <meshStandardMaterial color="#5a6a7a" roughness={0.9} />
      </mesh>
      <mesh position={[950, 0, 500]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[95, 145, 8]} />
        <meshStandardMaterial color="#6a7a8a" roughness={0.9} />
      </mesh>
      
      {/* Mountain range 3 - Far background */}
      <mesh position={[200, 0, -600]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[110, 160, 8]} />
        <meshStandardMaterial color="#4a5a6a" roughness={0.9} />
      </mesh>
      <mesh position={[100, 0, -650]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
        <coneGeometry args={[95, 150, 8]} />
        <meshStandardMaterial color="#5a6a7a" roughness={0.9} />
      </mesh>
      
      {/* Snow caps on mountains */}
      {[-400, -450, -500, 900, 950, 200, 100].map((x, i) => (
        <mesh key={i} position={[x, 120 + i * 10, 200 + i * 50]} castShadow>
          <coneGeometry args={[30 + i * 2, 20, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

