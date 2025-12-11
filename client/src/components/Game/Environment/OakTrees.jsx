import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Preload tree model
useGLTF.preload('/models/mighty_oak_trees.glb')

export default function OakTrees({ count = 20, spread = 1000 }) {
  const { scene } = useGLTF('/models/mighty_oak_trees.glb')
  
  // Create tree positions and transforms
  const trees = useMemo(() => {
    const treeArray = []
    
    // Create multiple instances positioned around track
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 150 + Math.random() * (spread / 2 - 150)
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const scale = 0.8 + Math.random() * 0.4
      const rotation = Math.random() * Math.PI * 2
      
      treeArray.push({
        position: [x, 0, z],
        scale: scale,
        rotation: rotation
      })
    }
    
    return treeArray
  }, [count, spread])
  
  // Clone base scene once and enable shadows
  const baseScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return cloned
  }, [scene])
  
  if (!baseScene) return null
  
  return (
    <group>
      {trees.map((tree, i) => {
        const clonedTree = baseScene.clone()
        return (
          <primitive
            key={i}
            object={clonedTree}
            position={tree.position}
            scale={[tree.scale, tree.scale, tree.scale]}
            rotation={[0, tree.rotation, 0]}
            castShadow
            receiveShadow
          />
        )
      })}
    </group>
  )
}

