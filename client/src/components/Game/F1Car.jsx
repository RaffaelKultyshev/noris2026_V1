import { forwardRef, useRef, useEffect, useImperativeHandle, useState, Suspense, useContext } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import F1Cockpit from './F1Cockpit'
import { TrackContext } from './Game'

// Preload F1 car model
try {
  useGLTF.preload('/models/f1_car.glb')
} catch (e) {
  console.warn('Failed to preload car:', e)
}

// Load F1 car model - BRIGHT RED COLOR
function F1CarModel({ steeringInput }) {
  const { scene } = useGLTF('/models/f1_car.glb')
  const [clonedScene, setClonedScene] = useState(null)
  
  useEffect(() => {
    if (scene && !clonedScene) {
      try {
        const cloned = scene.clone()
        cloned.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.material = new THREE.MeshStandardMaterial({
              color: 0xCC0000,
              metalness: 0.7,
              roughness: 0.2,
            })
          }
        })
        setClonedScene(cloned)
      } catch (e) {
        console.error('Error cloning F1 car:', e)
      }
    }
  }, [scene, clonedScene])
  
  useFrame(() => {
    if (clonedScene) {
      clonedScene.traverse((child) => {
        if (child.isMesh && (
          child.name.toLowerCase().includes('wheel') || 
          child.name.toLowerCase().includes('tire') ||
          child.name.toLowerCase().includes('front')
        )) {
          child.rotation.y = steeringInput * 0.5
        }
      })
    }
  })
  
  if (!clonedScene) {
    return (
      <mesh>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color="#CC0000" metalness={0.7} roughness={0.2} />
      </mesh>
    )
  }
  
  return (
    <primitive 
      object={clonedScene} 
      scale={[0.8, 0.8, 0.8]}
      position={[0, -0.3, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

// PHYSICS CONSTANTS
const MAX_SPEED = 350 / 3.6
const MAX_REVERSE_SPEED = -30 / 3.6
const ACCELERATION = 45
const BRAKE_FORCE = 70
const REVERSE_ACCELERATION = 20
const STEERING_SPEED = 4.8
const MAX_STEERING = 0.8
const FRICTION = 0.98
const COLLISION_BOUNCE = 0.5

// START POSITION
const START_POSITION = new THREE.Vector3(-12.5, 0.5, -24.3)
const START_ROTATION = -270 * (Math.PI / 180)

const F1Car = forwardRef(({ controls, audio }, ref) => {
  const groupRef = useRef()
  const velocity = useRef(0)
  const steeringAngle = useRef(0)
  const [steeringInput, setSteeringInput] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const initialized = useRef(false)
  const raycaster = useRef(new THREE.Raycaster())
  const trackMeshesRef = useContext(TrackContext)
  const lastCollisionCheck = useRef(0)
  const collisionCheckInterval = 100 // Check every 100ms for better performance
  const cachedMeshes = useRef(null) // Cache mesh list
  
  useImperativeHandle(ref, () => ({
    ...groupRef.current,
    reset: () => {
      if (groupRef.current) {
        groupRef.current.position.set(START_POSITION.x, START_POSITION.y, START_POSITION.z)
        groupRef.current.rotation.set(0, START_ROTATION, 0)
        velocity.current = 0
        steeringAngle.current = 0
        setSteeringInput(0)
      }
    }
  }))

  useEffect(() => {
    if (groupRef.current && !initialized.current) {
      groupRef.current.position.set(START_POSITION.x, START_POSITION.y, START_POSITION.z)
      groupRef.current.rotation.set(0, START_ROTATION, 0)
      velocity.current = 0
      initialized.current = true
    }
    
    // Update cached meshes when track meshes change
    if (trackMeshesRef?.current && trackMeshesRef.current.length > 0) {
      cachedMeshes.current = trackMeshesRef.current
    }
  }, [trackMeshesRef])
  
  useEffect(() => {
    if (controls && controls.raceStarted && audio) {
      audio.playEngineSound()
    }
  }, [controls?.raceStarted, audio])

  // OPTIMIZED COLLISION - Cached meshes, throttled, fewer rays
  const checkCollision = (position, direction, distance = 2.5) => {
    // Cache meshes to avoid repeated access
    if (!cachedMeshes.current && trackMeshesRef?.current) {
      cachedMeshes.current = trackMeshesRef.current
    }
    
    if (!cachedMeshes.current || cachedMeshes.current.length === 0) {
      return { hit: false }
    }
    
    const now = Date.now()
    if (now - lastCollisionCheck.current < collisionCheckInterval) {
      return { hit: false }
    }
    lastCollisionCheck.current = now
    
    // Only 2 rays for better performance
    const rayPositions = [
      new THREE.Vector3(position.x, position.y + 0.3, position.z),
      new THREE.Vector3(position.x, position.y + 0.3, position.z),
    ]
    
    // Single raycast forward
    raycaster.current.set(
      new THREE.Vector3(position.x, position.y + 0.3, position.z),
      direction.normalize()
    )
    raycaster.current.far = distance
    
    const intersects = raycaster.current.intersectObjects(cachedMeshes.current, false)
    
    if (intersects.length > 0 && intersects[0].distance < distance) {
      return { hit: true, distance: intersects[0].distance }
    }
    
    return { hit: false }
  }

  const checkOnTrack = (x, z) => {
    // Use cached meshes for better performance
    if (!cachedMeshes.current || cachedMeshes.current.length === 0) {
      return { onTrack: true, height: START_POSITION.y }
    }
    
    raycaster.current.set(
      new THREE.Vector3(x, 50, z),
      new THREE.Vector3(0, -1, 0)
    )
    raycaster.current.far = 100
    
    const intersects = raycaster.current.intersectObjects(cachedMeshes.current, false)
    
    if (intersects.length > 0) {
      return { onTrack: true, height: intersects[0].point.y + 0.5 }
    }
    
    return { onTrack: false, height: START_POSITION.y }
  }

  useFrame((state, delta) => {
    if (!groupRef.current || !controls) return
    
    const { keys = {}, raceStarted, updateSpeed, updatePosition, updateRotation } = controls
    
    if (!updateSpeed || !updatePosition || !updateRotation) return
    
    const pos = groupRef.current.position
    const rot = groupRef.current.rotation
    updatePosition([pos.x, pos.y, pos.z])
    updateRotation(rot.y)
    
    if (!raceStarted) {
      updateSpeed(0)
      setCurrentSpeed(0)
      velocity.current = 0
      return
    }
    
    const speedMs = velocity.current
    const speedKmh = Math.abs(speedMs * 3.6)
    
    if (keys.w && raceStarted) {
      if (velocity.current >= 0) {
        const powerCurve = 1 - (speedMs / MAX_SPEED) * 0.4
        velocity.current += ACCELERATION * powerCurve * delta
        if (velocity.current > MAX_SPEED) velocity.current = MAX_SPEED
      } else {
        velocity.current += ACCELERATION * delta
        if (velocity.current > 0) velocity.current = 0
      }
    }
    
    if (keys.s && raceStarted) {
      if (velocity.current > 0.5) {
        velocity.current -= BRAKE_FORCE * delta
        if (velocity.current < 0) velocity.current = 0
      } else {
        velocity.current -= REVERSE_ACCELERATION * delta
        if (velocity.current < MAX_REVERSE_SPEED) velocity.current = MAX_REVERSE_SPEED
      }
    }
    
    if (!keys.w && !keys.s) {
      velocity.current *= FRICTION
      if (Math.abs(velocity.current) < 0.3) velocity.current = 0
    }
    
    const absSpeedMs = Math.abs(speedMs)
    const speedFactor = Math.min(absSpeedMs / 12, 1)
    const steeringReduction = 1 - (absSpeedMs / MAX_SPEED) * 0.15
    
    let newSteeringInput = steeringInput
    if (keys.a && absSpeedMs > 0.3 && raceStarted) {
      steeringAngle.current += STEERING_SPEED * steeringReduction * delta
      newSteeringInput = Math.min(newSteeringInput + delta * 6, 1)  // REDUCED from 12 to 6
    } else if (keys.d && absSpeedMs > 0.3 && raceStarted) {
      steeringAngle.current -= STEERING_SPEED * steeringReduction * delta
      newSteeringInput = Math.max(newSteeringInput - delta * 6, -1)  // REDUCED from 12 to 6
    } else {
      steeringAngle.current *= 0.9  // Slower return to center
      newSteeringInput *= 0.85
    }
    setSteeringInput(newSteeringInput)
    
    steeringAngle.current = THREE.MathUtils.clamp(steeringAngle.current, -MAX_STEERING, MAX_STEERING)
    
    const steerDirection = velocity.current >= 0 ? 1 : -1
    groupRef.current.rotation.y += steeringAngle.current * speedFactor * steerDirection * delta
    
    const direction = new THREE.Vector3(0, 0, 1)
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), groupRef.current.rotation.y)
    
    const newX = pos.x + direction.x * velocity.current * delta
    const newZ = pos.z + direction.z * velocity.current * delta
    
    // OPTIMIZED COLLISION - Skip checks when at spawn to prevent jumping
    const distFromSpawn = Math.sqrt(
      Math.pow(pos.x - START_POSITION.x, 2) + 
      Math.pow(pos.z - START_POSITION.z, 2)
    )
    
    // Skip collision checks when very close to spawn (prevents jumping)
    if (distFromSpawn < 3 && Math.abs(velocity.current) < 2) {
      // Just move without collision checks at spawn
      groupRef.current.position.x = newX
      groupRef.current.position.z = newZ
      groupRef.current.position.y = START_POSITION.y
    } else if (Math.abs(velocity.current) > 0.5) {
      // Normal collision detection when away from spawn
      const collision = checkCollision(pos, direction.clone().multiplyScalar(Math.sign(velocity.current)), 2.5)
      
      if (collision.hit) {
        velocity.current = 0
      } else {
        const trackCheck = checkOnTrack(newX, newZ)
        
        if (trackCheck.onTrack) {
          // Only check future collision if moving fast
          if (Math.abs(velocity.current) > 5) {
            const newPos = new THREE.Vector3(newX, trackCheck.height, newZ)
            const futureCollision = checkCollision(newPos, direction.clone().multiplyScalar(Math.sign(velocity.current)), 1.8)
            
            if (!futureCollision.hit) {
              groupRef.current.position.x = newX
              groupRef.current.position.z = newZ
              groupRef.current.position.y = trackCheck.height
            } else {
              velocity.current *= 0.6
            }
          } else {
            // Slow speed - just move
            groupRef.current.position.x = newX
            groupRef.current.position.z = newZ
            groupRef.current.position.y = trackCheck.height
          }
        } else {
          velocity.current *= 0.9
        }
      }
    } else {
      // Very slow movement - just update position
      const trackCheck = checkOnTrack(newX, newZ)
      if (trackCheck.onTrack) {
        groupRef.current.position.x = newX
        groupRef.current.position.z = newZ
        groupRef.current.position.y = trackCheck.height
      }
    }
    
    groupRef.current.rotation.x = 0
    groupRef.current.rotation.z = 0
    
    updateSpeed(speedKmh)
    setCurrentSpeed(speedKmh)
    if (audio) {
      audio.updateEngineSound(speedKmh)
    }
  })

  return (
    <group ref={groupRef} position={[START_POSITION.x, START_POSITION.y, START_POSITION.z]}>
      <Suspense fallback={
        <mesh>
          <boxGeometry args={[2, 0.5, 4]} />
          <meshStandardMaterial color="#CC0000" metalness={0.7} roughness={0.2} />
        </mesh>
      }>
        <F1CarModel steeringInput={steeringInput} />
      </Suspense>
      
      <group position={[0, 0.55, -0.8]}>
        <F1Cockpit steeringInput={steeringInput} speed={currentSpeed} />
      </group>
    </group>
  )
})

F1Car.displayName = 'F1Car'
export default F1Car
