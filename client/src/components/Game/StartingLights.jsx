import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function StartingLights({ countdown, raceStarted }) {
  // Convert countdown to lights
  // countdown: 3 = 1 light, 2 = 2 lights, 1 = 3 lights, 0 = 4 lights, 'GO' = 5 lights then off
  const getLitLights = () => {
    if (countdown === null || raceStarted) return 0
    if (countdown === 'GO') return -1 // All off (green)
    if (countdown === 3) return 1
    if (countdown === 2) return 2
    if (countdown === 1) return 3
    if (countdown === 0) return 5
    return 0
  }
  
  const litLights = getLitLights()
  const isGreen = countdown === 'GO'

  return (
    <group position={[0, 10, 80]}>
      {/* Gantry structure */}
      {/* Left pole */}
      <mesh position={[-8, -4, 0]} castShadow>
        <boxGeometry args={[0.5, 8, 0.5]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Right pole */}
      <mesh position={[8, -4, 0]} castShadow>
        <boxGeometry args={[0.5, 8, 0.5]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Top beam */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[17, 0.5, 0.5]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Light panel background */}
      <mesh position={[0, -1.5, 0.3]} castShadow>
        <boxGeometry args={[14, 3, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* 5 Light columns */}
      {[0, 1, 2, 3, 4].map((col) => (
        <group key={col} position={[-5 + col * 2.5, -1.5, 0.5]}>
          {/* Top light (red) */}
          <Light 
            position={[0, 0.8, 0]} 
            isLit={litLights > col && !isGreen}
            color="#ff0000"
          />
          {/* Bottom light (red) */}
          <Light 
            position={[0, -0.8, 0]} 
            isLit={litLights > col && !isGreen}
            color="#ff0000"
          />
        </group>
      ))}
      
      {/* Green lights (shown only on GO) */}
      {isGreen && [0, 1, 2, 3, 4].map((col) => (
        <group key={`green-${col}`} position={[-5 + col * 2.5, -1.5, 0.5]}>
          <Light position={[0, 0, 0]} isLit={true} color="#00ff00" />
        </group>
      ))}
    </group>
  )
}

function Light({ position, isLit, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial 
        color={isLit ? color : '#333333'}
        emissive={isLit ? color : '#000000'}
        emissiveIntensity={isLit ? 2 : 0}
      />
      {/* Glow effect */}
      {isLit && (
        <pointLight 
          color={color} 
          intensity={5} 
          distance={10} 
          decay={2}
        />
      )}
    </mesh>
  )
}

