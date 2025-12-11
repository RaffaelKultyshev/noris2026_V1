import { useMemo, useRef, useContext } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { TrackContext } from './Game'

// Preload map model
try {
  useGLTF.preload('/models/map_circuit.glb')
} catch (e) {
  console.warn('Failed to preload map:', e)
}

// Color mapping based on object names
function getColorForObject(name) {
  const n = name.toLowerCase()
  
  // Track/Road - Realistic dark asphalt
  if (n.includes('track') || n.includes('road') || n.includes('asphalt') || n.includes('tarmac')) {
    return { color: 0x1a1a1a, roughness: 0.85, metalness: 0.05 }  // Realistic dark asphalt
  }
  
  // Kerbs/Curbs - Realistic red/white
  if (n.includes('kerb') || n.includes('curb')) {
    return { color: 0xcc0000, roughness: 0.75, metalness: 0.0 }  // Realistic red kerbs
  }
  
  // Trees/Foliage - Realistic forest green
  if (n.includes('tree') || n.includes('leaf') || n.includes('foliage') || n.includes('bush')) {
    return { color: 0x2d5016, roughness: 0.9, metalness: 0.0 }  // Realistic forest green
  }
  
  // Grass - Realistic green
  if (n.includes('grass') || n.includes('lawn') || n.includes('ground')) {
    return { color: 0x4a7c3a, roughness: 0.95, metalness: 0.0 }  // Realistic grass green
  }
  
  // Barriers/Walls/Fence - Realistic dark grey
  if (n.includes('barrier') || n.includes('wall') || n.includes('fence') || n.includes('guard')) {
    return { color: 0x2a2a2a, roughness: 0.6, metalness: 0.4 }  // Realistic dark barriers
  }
  
  // Tires - Realistic black
  if (n.includes('tire') || n.includes('tyre')) {
    return { color: 0x0a0a0a, roughness: 0.95, metalness: 0.0 }  // Realistic black rubber
  }
  
  // Cones - Realistic orange
  if (n.includes('cone') || n.includes('pylon')) {
    return { color: 0xff8800, roughness: 0.7, metalness: 0.0 }  // Realistic orange cones
  }
  
  // Buildings/Stands/Grandstand - Realistic concrete
  if (n.includes('building') || n.includes('stand') || n.includes('grandstand') || n.includes('pit')) {
    return { color: 0x6b6b6b, roughness: 0.7, metalness: 0.1 }  // Realistic concrete grey
  }
  
  // Signs/Boards/Billboard - Realistic blue
  if (n.includes('sign') || n.includes('board') || n.includes('billboard') || n.includes('banner')) {
    return { color: 0x1e3a8a, roughness: 0.4, metalness: 0.3 }  // Realistic blue signs
  }
  
  // Balloons - Realistic red
  if (n.includes('balloon')) {
    return { color: 0xcc0000, roughness: 0.5, metalness: 0.0 }  // Realistic red balloons
  }
  
  // Metal/Steel structures - Realistic metal
  if (n.includes('metal') || n.includes('steel') || n.includes('pole') || n.includes('tower')) {
    return { color: 0x6b6b6b, roughness: 0.2, metalness: 0.9 }  // Realistic metal grey
  }
  
  // Sand/Gravel - Realistic sandy
  if (n.includes('sand') || n.includes('gravel') || n.includes('runoff')) {
    return { color: 0xb8a082, roughness: 0.95, metalness: 0.0 }  // Realistic sandy beige
  }
  
  // Water - Realistic blue
  if (n.includes('water') || n.includes('lake') || n.includes('pond')) {
    return { color: 0x2e5a8a, roughness: 0.1, metalness: 0.2 }  // Realistic water blue
  }
  
  // Default - realistic medium grey
  return { color: 0x5a5a5a, roughness: 0.7, metalness: 0.1 }
}

export default function Track() {
  const gltf = useGLTF('/models/map_circuit.glb')
  const mapRef = useRef()
  const trackMeshesRef = useContext(TrackContext)
  
  const coloredScene = useMemo(() => {
    if (!gltf.scene) return null
    
    const cloned = gltf.scene.clone()
    const meshes = []
    const coloredNames = []
    
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        meshes.push(child)
        
        // Get color based on object name
        const colorInfo = getColorForObject(child.name || child.parent?.name || '')
        
        // Create new material with color
        const newMat = new THREE.MeshStandardMaterial({
          color: colorInfo.color,
          roughness: colorInfo.roughness,
          metalness: colorInfo.metalness,
          side: THREE.DoubleSide,
        })
        
        // Keep original texture if it exists
        if (child.material?.map) {
          newMat.map = child.material.map
        }
        
        child.material = newMat
        coloredNames.push(`${child.name}: #${colorInfo.color.toString(16)}`)
      }
    })
    
    console.log('Track colored:', meshes.length, 'meshes')
    console.log('Sample objects:', coloredNames.slice(0, 10))
    
    if (trackMeshesRef) {
      trackMeshesRef.current = meshes
    }
    
    return cloned
  }, [gltf.scene, trackMeshesRef])
  
  if (!coloredScene) return null
  
  return (
    <primitive
      ref={mapRef}
      object={coloredScene}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  )
}
