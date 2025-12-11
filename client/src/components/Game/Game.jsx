import { Suspense, useEffect, useRef, Component, createContext } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import Track from './Track'
import F1Car from './F1Car'
import GameUI from './GameUI'
import SettingsMenu from './SettingsMenu'
import { useGameControls } from '../../hooks/useGameControls'
import { useAudio } from '../../hooks/useAudio'
import './Game.css'

// Context to share track collision meshes
export const TrackContext = createContext(null)

// Error boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Game Error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', padding: '20px', background: '#333' }}>
          <h1>Something went wrong</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

// Cockpit camera follows the car
function CockpitCamera({ carRef, controls }) {
  const { camera } = useThree()
  const shakeOffset = useRef({ x: 0, y: 0 })
  
  useFrame(() => {
    if (!carRef.current || !controls) return
    
    const carPosition = carRef.current.position
    const carRotation = carRef.current.rotation.y
    const speedKmh = controls.speed || 0
    
    if (isNaN(carPosition.x) || isNaN(carPosition.y) || isNaN(carPosition.z)) return
    
    const eyeHeight = 1.2
    
    if (speedKmh > 200) {
      const intensity = Math.min((speedKmh - 200) / 300, 0.5) * 0.005
      const time = Date.now() / 100
      shakeOffset.current.x = Math.sin(time * 3) * intensity
      shakeOffset.current.y = Math.cos(time * 2) * intensity * 0.5
    } else {
      shakeOffset.current.x *= 0.95
      shakeOffset.current.y *= 0.95
    }
    
    camera.position.set(
      carPosition.x + shakeOffset.current.x,
      carPosition.y + eyeHeight + shakeOffset.current.y,
      carPosition.z
    )
    
    const lookDist = 80
    const lookX = carPosition.x + Math.sin(carRotation) * lookDist
    const lookZ = carPosition.z + Math.cos(carRotation) * lookDist
    camera.lookAt(lookX, carPosition.y + eyeHeight * 0.8, lookZ)
    
    const baseFOV = 75
    const fovBoost = (speedKmh / 350) * 12
    camera.fov = baseFOV + fovBoost
    camera.updateProjectionMatrix()
  })
  
  return null
}

export default function Game({ trackId }) {
  const { setGameState } = useGameStore()
  const controls = useGameControls()
  const carRef = useRef()
  const trackMeshesRef = useRef([])
  const audio = useAudio()

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setGameState('menu')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [setGameState])

  return (
    <ErrorBoundary>
      <div className="game-container">
        <TrackContext.Provider value={trackMeshesRef}>
          <Canvas
            camera={{ position: [0, 3, 10], fov: 75, near: 0.1, far: 5000 }}
            gl={{ 
              antialias: true, 
              powerPreference: 'high-performance',
              alpha: false
            }}
            shadows
            onCreated={({ gl }) => {
              // Brighter tone mapping
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.2  // INCREASED from 1.0 to 1.2
              gl.shadowMap.enabled = true
              gl.shadowMap.type = THREE.PCFSoftShadowMap
              gl.outputColorSpace = THREE.SRGBColorSpace
            }}
          >
            <Suspense fallback={null}>
              {/* Brighter sky */}
              <color attach="background" args={['#B0E0E6']} />
              
              {/* BRIGHTER lighting */}
              <ambientLight intensity={1.2} color="#ffffff" />
              
              {/* BRIGHTER main sun light */}
              <directionalLight
                position={[100, 150, 100]}
                intensity={2.5}
                castShadow
                shadowMapSizeWidth={2048}
                shadowMapSizeHeight={2048}
                shadowCameraFar={500}
                shadowCameraLeft={-200}
                shadowCameraRight={200}
                shadowCameraTop={200}
                shadowCameraBottom={-200}
                color="#ffffff"
              />
              
              {/* BRIGHTER fill light */}
              <directionalLight
                position={[-50, 80, -50]}
                intensity={1.2}
                color="#ffffff"
              />
              
              {/* BRIGHTER hemisphere light */}
              <hemisphereLight 
                skyColor="#B0E0E6" 
                groundColor="#666666" 
                intensity={0.9}
              />
              
              {/* Scene */}
              <Track trackId={trackId} />
              <F1Car ref={carRef} controls={controls} audio={audio} />
              <CockpitCamera carRef={carRef} controls={controls} />
            </Suspense>
          </Canvas>
        </TrackContext.Provider>
        <GameUI controls={controls} />
        <SettingsMenu 
          carRef={carRef} 
          audioControls={{
            musicEnabled: audio.musicEnabled,
            engineEnabled: audio.engineEnabled,
            volume: audio.volume,
            toggleMusic: audio.toggleMusic,
            toggleEngine: audio.toggleEngine,
            setVolume: audio.setVolume
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
