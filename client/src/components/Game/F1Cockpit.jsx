import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Highly detailed F1 Cockpit - F1 25 style
export default function F1Cockpit({ steeringInput = 0, speed = 0 }) {
  const steeringGroupRef = useRef()
  const leftHandRef = useRef()
  const rightHandRef = useRef()
  
  useFrame(() => {
    if (steeringGroupRef.current) {
      const targetRotation = steeringInput * Math.PI * 0.45
      steeringGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        steeringGroupRef.current.rotation.z,
        targetRotation,
        0.15
      )
    }
    
    // Animate hands with steering
    if (leftHandRef.current && rightHandRef.current) {
      const handRotation = steeringInput * 0.3
      leftHandRef.current.rotation.z = handRotation
      rightHandRef.current.rotation.z = handRotation
    }
  })

  const displaySpeed = Math.round(speed)
  const gear = Math.min(Math.max(Math.floor(speed / 45) + 1, 1), 8)
  const rpm = Math.min(Math.floor((speed / 350) * 15000), 15000)

  return (
    <group>
      {/* ============ HALO (Titanium structure) ============ */}
      <group position={[0, 0.15, 0.3]}>
        {/* Main halo arch */}
        <mesh castShadow>
          <torusGeometry args={[0.35, 0.025, 10, 40, Math.PI]} />
          <meshStandardMaterial 
            color="#0d0d0d" 
            metalness={0.98} 
            roughness={0.05}
            envMapIntensity={2}
          />
        </mesh>
        {/* Center pillar */}
        <mesh position={[0, 0.2, 0.45]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.05, 0.9]} />
          <meshStandardMaterial 
            color="#0d0d0d" 
            metalness={0.98} 
            roughness={0.05}
            envMapIntensity={2}
          />
        </mesh>
        {/* Left support */}
        <mesh position={[-0.3, -0.1, 0.15]} rotation={[0.15, 0.5, 0.5]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.35]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Right support */}
        <mesh position={[0.3, -0.1, 0.15]} rotation={[0.15, -0.5, -0.5]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.35]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* ============ STEERING WHEEL (F1 style) ============ */}
      <group ref={steeringGroupRef} position={[0, -0.05, 0.5]} rotation={[-0.4, 0, 0]}>
        {/* Steering wheel base plate */}
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.18, 0.03]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.15} 
            metalness={0.6}
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Top grip */}
        <mesh position={[0, 0.08, 0.01]} castShadow>
          <boxGeometry args={[0.24, 0.03, 0.04]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.25} metalness={0.5} />
        </mesh>
        
        {/* Side grips (red) */}
        <mesh position={[-0.12, 0, 0.01]} castShadow>
          <boxGeometry args={[0.04, 0.14, 0.04]} />
          <meshStandardMaterial color="#cc0000" roughness={0.35} />
        </mesh>
        <mesh position={[0.12, 0, 0.01]} castShadow>
          <boxGeometry args={[0.04, 0.14, 0.04]} />
          <meshStandardMaterial color="#cc0000" roughness={0.35} />
        </mesh>
        
        {/* LCD Display (center top) */}
        <mesh position={[0, 0.04, 0.02]}>
          <boxGeometry args={[0.12, 0.05, 0.01]} />
          <meshStandardMaterial 
            color="#000000" 
            emissive="#00ff00" 
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Speed display - emissive green */}
        <mesh position={[0, 0.04, 0.026]}>
          <planeGeometry args={[0.1, 0.04]} />
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00" 
            emissiveIntensity={1.5}
          />
        </mesh>
        
        {/* Gear display */}
        <mesh position={[0, -0.02, 0.02]}>
          <boxGeometry args={[0.04, 0.03, 0.01]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000" 
            emissiveIntensity={1.2}
          />
        </mesh>
        
        {/* Button grid (12 buttons) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          const colors = ['#ff0000', '#00ff00', '#0066ff', '#ffff00']
          return (
            <mesh 
              key={i} 
              position={[-0.09 + col * 0.06, 0.02 - row * 0.04, 0.02]}
              castShadow
            >
              <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
              <meshStandardMaterial 
                color={colors[col]}
                emissive={colors[col]}
                emissiveIntensity={0.6}
              />
            </mesh>
          )
        })}
        
        {/* Rotary dials */}
        {[-0.08, 0.08].map((x, i) => (
          <mesh key={i} position={[x, -0.06, 0.02]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.015, 16]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        
        {/* Paddle shifters (behind wheel) */}
        <mesh position={[-0.16, 0, -0.04]} rotation={[0.3, 0, 0.15]} castShadow>
          <boxGeometry args={[0.05, 0.08, 0.012]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.08} />
        </mesh>
        <mesh position={[0.16, 0, -0.04]} rotation={[0.3, 0, -0.15]} castShadow>
          <boxGeometry args={[0.05, 0.08, 0.012]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.08} />
        </mesh>

        {/* ============ DRIVER HANDS (Detailed) ============ */}
        {/* Left hand */}
        <group ref={leftHandRef} position={[-0.12, 0, 0.05]}>
          {/* Palm */}
          <mesh>
            <boxGeometry args={[0.04, 0.03, 0.05]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
          </mesh>
          {/* Fingers */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={i} position={[0, -0.02 - i * 0.008, 0.03]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.025, 6]} />
              <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
            </mesh>
          ))}
          {/* Thumb */}
          <mesh position={[0.015, -0.01, 0.02]} rotation={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.005, 0.005, 0.02, 6]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
          </mesh>
          {/* Forearm */}
          <mesh position={[-0.02, 0.02, -0.12]} rotation={[0.8, 0.3, 0.2]} castShadow>
            <capsuleGeometry args={[0.025, 0.15, 4, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
        </group>

        {/* Right hand */}
        <group ref={rightHandRef} position={[0.12, 0, 0.05]}>
          {/* Palm */}
          <mesh>
            <boxGeometry args={[0.04, 0.03, 0.05]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
          </mesh>
          {/* Fingers */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={i} position={[0, -0.02 - i * 0.008, 0.03]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.025, 6]} />
              <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
            </mesh>
          ))}
          {/* Thumb */}
          <mesh position={[-0.015, -0.01, 0.02]} rotation={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.005, 0.005, 0.02, 6]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0.02, 0.02, -0.12]} rotation={[0.8, -0.3, -0.2]} castShadow>
            <capsuleGeometry args={[0.025, 0.15, 4, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ============ COCKPIT SIDES & DASHBOARD ============ */}
      {/* Left side panel */}
      <mesh position={[-0.45, -0.15, 0.35]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.2} />
      </mesh>
      {/* Left side screen */}
      <mesh position={[-0.45, -0.08, 0.35]}>
        <planeGeometry args={[0.15, 0.08]} />
        <meshStandardMaterial 
          color="#003366" 
          emissive="#0066cc" 
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Right side panel */}
      <mesh position={[0.45, -0.15, 0.35]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.2} />
      </mesh>
      {/* Right side screen */}
      <mesh position={[0.45, -0.08, 0.35]}>
        <planeGeometry args={[0.15, 0.08]} />
        <meshStandardMaterial 
          color="#003366" 
          emissive="#0066cc" 
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* ============ FRONT NOSE (visible ahead) ============ */}
      <mesh position={[0, -0.25, 1.2]} castShadow>
        <boxGeometry args={[0.4, 0.1, 1.5]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.27, 2.1]} castShadow>
        <boxGeometry args={[0.25, 0.06, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* ============ FRONT WHEELS (highly visible) ============ */}
      <group position={[-0.7, -0.3, 1.5]}>
        {/* Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
        </mesh>
        {/* Chrome rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.26, 20]} />
          <meshStandardMaterial 
            color="#c0c0c0" 
            metalness={0.98} 
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Brake disc */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      <group position={[0.7, -0.3, 1.5]}>
        {/* Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
        </mesh>
        {/* Chrome rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.26, 20]} />
          <meshStandardMaterial 
            color="#c0c0c0" 
            metalness={0.98} 
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Brake disc */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* ============ FRONT WING ============ */}
      <mesh position={[0, -0.35, 2.3]} castShadow>
        <boxGeometry args={[2, 0.05, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.15} />
      </mesh>
      {/* Wing endplates */}
      <mesh position={[-0.95, -0.32, 2.3]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.35]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0.95, -0.32, 2.3]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.35]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* ============ MIRRORS ============ */}
      <group position={[-0.52, 0.05, 0.42]} rotation={[0, 0.7, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.06, 0.035]} />
          <meshStandardMaterial 
            color="#88aacc" 
            metalness={1} 
            roughness={0.01}
            envMapIntensity={2}
          />
        </mesh>
      </group>
      <group position={[0.52, 0.05, 0.42]} rotation={[0, -0.7, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.06, 0.035]} />
          <meshStandardMaterial 
            color="#88aacc" 
            metalness={1} 
            roughness={0.01}
            envMapIntensity={2}
          />
        </mesh>
      </group>
    </group>
  )
}
