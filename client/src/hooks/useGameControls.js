import { useState, useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'

// Spawn point
const SPAWN_X = -12.5
const SPAWN_Z = -24.3

// Checkpoint system - multiple checkpoints around the track
// Must pass through all checkpoints in order to complete a lap
const CHECKPOINTS = [
  { x: -12.5, z: -24.3, radius: 8 },   // Start/Finish line
  { x: 0, z: -30, radius: 10 },         // Checkpoint 1
  { x: 20, z: -20, radius: 10 },       // Checkpoint 2
  { x: 30, z: 0, radius: 10 },         // Checkpoint 3
  { x: 20, z: 20, radius: 10 },         // Checkpoint 4
  { x: 0, z: 30, radius: 10 },          // Checkpoint 5
  { x: -20, z: 20, radius: 10 },       // Checkpoint 6
  { x: -30, z: 0, radius: 10 },        // Checkpoint 7
  { x: -20, z: -20, radius: 10 },       // Checkpoint 8
]

const CHECKPOINT_DETECTION_RADIUS = 15  // How close to checkpoint to trigger

export function useGameControls() {
  const [keys, setKeys] = useState({})
  const [speed, setSpeed] = useState(0)
  const [position, setPosition] = useState([0, 0, 0])
  const [rotation, setRotation] = useState(0)
  const [currentLap, setCurrentLap] = useState(1)
  const [raceStarted, setRaceStarted] = useState(false)
  const [raceFinished, setRaceFinished] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [raceTime, setRaceTime] = useState(0)
  const [lapTime, setLapTime] = useState(0)
  const [lastLapTime, setLastLapTime] = useState(null)
  const [bestLapTime, setBestLapTime] = useState(null)
  const raceStartTime = useRef(null)
  const lapStartTime = useRef(null)
  const nextCheckpointIndex = useRef(1)  // Start at checkpoint 1 (skip start/finish initially)
  const hasLeftStartArea = useRef(false)  // Must leave start area first
  const lastCheckpointTime = useRef(0)  // Prevent rapid checkpoint triggers

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys((prev) => ({ ...prev, [key]: true }))
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeys((prev) => ({ ...prev, [key]: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Start race immediately - NO COUNTDOWN
  useEffect(() => {
    if (!raceStarted) {
      // Start after a tiny delay to let everything load
      const timer = setTimeout(() => {
        setRaceStarted(true)
        raceStartTime.current = Date.now()
        lapStartTime.current = Date.now()
        console.log('Race started!')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [raceStarted])

  // Race timer
  useEffect(() => {
    if (!raceStarted) return

    const interval = setInterval(() => {
      if (raceStartTime.current) {
        setRaceTime((Date.now() - raceStartTime.current) / 1000)
      }
      if (lapStartTime.current) {
        setLapTime((Date.now() - lapStartTime.current) / 1000)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [raceStarted])

  const updateSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed)
  }, [])

  const updatePosition = useCallback((newPosition) => {
    setPosition(newPosition)
    
    // Don't check checkpoints if car is too close to spawn (prevents jumping at start)
    const distFromSpawn = Math.sqrt(
      Math.pow(newPosition[0] - SPAWN_X, 2) + 
      Math.pow(newPosition[2] - SPAWN_Z, 2)
    )
    
    // Checkpoint-based lap detection - only check when race started, not finished, car is moving, and away from spawn
    if (raceStarted && !raceFinished && newPosition && Math.abs(speed) > 1 && distFromSpawn > 5) {
      const now = Date.now()
      
      // Prevent rapid checkpoint triggers (cooldown)
      if (now - lastCheckpointTime.current < 1000) {
        return
      }
      
      const currentCheckpoint = CHECKPOINTS[nextCheckpointIndex.current]
      const distToCheckpoint = Math.sqrt(
        Math.pow(newPosition[0] - currentCheckpoint.x, 2) + 
        Math.pow(newPosition[2] - currentCheckpoint.z, 2)
      )
      
      // Must leave start area first before any checkpoints count
      if (!hasLeftStartArea.current) {
        const distFromStart = Math.sqrt(
          Math.pow(newPosition[0] - SPAWN_X, 2) + 
          Math.pow(newPosition[2] - SPAWN_Z, 2)
        )
        if (distFromStart > CHECKPOINT_DETECTION_RADIUS * 2) {
          hasLeftStartArea.current = true
          console.log('Left start area - checkpoints now active')
        }
        return
      }
      
      // Check if we've reached the current checkpoint
      if (distToCheckpoint <= CHECKPOINT_DETECTION_RADIUS) {
        lastCheckpointTime.current = now
        
        // Special handling for start/finish line (checkpoint 0)
        if (nextCheckpointIndex.current === 0) {
          // If we're at start/finish and we've completed all other checkpoints, it's a lap!
          // (nextCheckpointIndex is 0 means we've gone through all checkpoints 1-8)
          const completedLapTime = lapStartTime.current ? 
            (Date.now() - lapStartTime.current) / 1000 : 0
          
          if (completedLapTime > 10) {  // Minimum 10 seconds to prevent cheating
            setLastLapTime(completedLapTime)
            
            // Update best lap
            if (!bestLapTime || completedLapTime < bestLapTime) {
              setBestLapTime(completedLapTime)
            }
            
            console.log(`Lap ${currentLap} completed! Time: ${completedLapTime.toFixed(2)}s`)
            
            // Check if race is finished (after completing lap 2)
            if (currentLap >= 2) {
              // Race finished after 2 laps
              console.log('Race finished!')
              setRaceFinished(true)
              // Show finish screen, return to menu after delay
              setTimeout(() => {
                useGameStore.getState().setGameState('menu')
              }, 5000)
            } else {
              // Start new lap timer for next lap
              lapStartTime.current = Date.now()
              setCurrentLap((prev) => prev + 1)
            }
            
            // Reset for next lap - start at checkpoint 1 again
            nextCheckpointIndex.current = 1
            hasLeftStartArea.current = false
          }
        } else {
          // Regular checkpoint - move to next one
          nextCheckpointIndex.current = (nextCheckpointIndex.current + 1) % CHECKPOINTS.length
          console.log(`Checkpoint ${nextCheckpointIndex.current === 0 ? 'Start/Finish' : nextCheckpointIndex.current} reached!`)
        }
      }
    }
  }, [raceStarted, raceFinished, speed, currentLap, bestLapTime])

  const updateRotation = useCallback((newRotation) => {
    setRotation(newRotation)
  }, [])

  return {
    keys,
    speed,
    position,
    rotation,
    currentLap,
    raceStarted,
    raceFinished,
    countdown,
    raceTime,
    lapTime,
    lastLapTime,
    bestLapTime,
    updateSpeed,
    updatePosition,
    updateRotation,
  }
}
