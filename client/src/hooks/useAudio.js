import { useRef, useEffect, useCallback, useState } from 'react'
import { Howl } from 'howler'

export function useAudio() {
  const audioContextRef = useRef(null)
  const oscillatorsRef = useRef([])
  const gainNodesRef = useRef([])
  const masterGainRef = useRef(null)
  const noiseNodeRef = useRef(null)
  const noiseGainRef = useRef(null)
  const isPlayingRef = useRef(false)
  const backgroundMusicRef = useRef(null)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [engineEnabled, setEngineEnabled] = useState(true)
  const [volume, setVolume] = useState(100)

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      const ctx = audioContextRef.current
      
      masterGainRef.current = ctx.createGain()
      masterGainRef.current.gain.value = 0.12
      masterGainRef.current.connect(ctx.destination)

      const harmonics = [
        { type: 'sawtooth', freqMult: 1, gain: 0.35 },
        { type: 'sawtooth', freqMult: 2, gain: 0.25 },
        { type: 'square', freqMult: 0.5, gain: 0.15 },
        { type: 'sawtooth', freqMult: 3, gain: 0.12 },
        { type: 'triangle', freqMult: 4, gain: 0.08 },
        { type: 'sawtooth', freqMult: 1.01, gain: 0.15 },
        { type: 'sawtooth', freqMult: 0.99, gain: 0.15 },
      ]

      harmonics.forEach((h) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = h.type
        osc.frequency.value = 100 * h.freqMult
        gain.gain.value = h.gain
        
        osc.connect(gain)
        gain.connect(masterGainRef.current)
        
        oscillatorsRef.current.push({ osc, freqMult: h.freqMult })
        gainNodesRef.current.push(gain)
      })

      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
      
      noiseNodeRef.current = ctx.createBufferSource()
      noiseNodeRef.current.buffer = noiseBuffer
      noiseNodeRef.current.loop = true
      
      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = 800
      bandpass.Q.value = 0.5
      
      noiseGainRef.current = ctx.createGain()
      noiseGainRef.current.gain.value = 0.02
      
      noiseNodeRef.current.connect(bandpass)
      bandpass.connect(noiseGainRef.current)
      noiseGainRef.current.connect(masterGainRef.current)

    } catch (e) {
      console.warn('Audio initialization failed:', e)
    }
  }, [])

  const playEngineSound = useCallback(() => {
    if (isPlayingRef.current) return
    
    initAudio()
    
    if (!audioContextRef.current) return

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    try {
      oscillatorsRef.current.forEach(({ osc }) => {
        try { osc.start() } catch (e) { /* already started */ }
      })
      if (noiseNodeRef.current) {
        try { noiseNodeRef.current.start() } catch (e) { /* already started */ }
      }
      isPlayingRef.current = true
    } catch (e) {
      console.warn('Could not start audio:', e)
    }
    
    // Play background music
    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Howl({
        src: ['/audio/max_verstappen_33.mp3'],
        loop: true,
        volume: 0.25,
        autoplay: false,
        onload: () => {
          console.log('Max Verstappen music loaded')
        },
        onloaderror: (id, error) => {
          console.warn('Failed to load background music:', error)
        },
        onplayerror: (id, error) => {
          console.warn('Failed to play background music:', error)
          backgroundMusicRef.current.once('unlock', () => {
            backgroundMusicRef.current.play()
          })
        }
      })
    }
    if (musicEnabled && !backgroundMusicRef.current.playing()) {
      try {
        backgroundMusicRef.current.play()
      } catch (e) {
        console.warn('Music play error:', e)
      }
    }
  }, [initAudio, musicEnabled])

  const updateEngineSound = useCallback((speedKmh) => {
    if (!audioContextRef.current || !isPlayingRef.current || !engineEnabled) {
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioContextRef.current?.currentTime || 0, 0.1)
      }
      return
    }

    const ctx = audioContextRef.current
    const volumeMultiplier = volume / 100
    
    const minFreq = 120
    const maxFreq = 480
    const maxSpeed = 350
    
    const speedRatio = Math.min(speedKmh / maxSpeed, 1)
    const baseFreq = minFreq + speedRatio * (maxFreq - minFreq)
    
    const time = Date.now() / 1000
    const variation = Math.sin(time * 25) * 3 + Math.sin(time * 40) * 1.5

    oscillatorsRef.current.forEach(({ osc, freqMult }) => {
      osc.frequency.setTargetAtTime(
        (baseFreq + variation) * freqMult,
        ctx.currentTime,
        0.04
      )
    })

    if (masterGainRef.current) {
      const baseVol = 0.08
      const speedVol = speedRatio * 0.15
      const throttleBoost = speedKmh > 10 ? 0.04 : 0
      masterGainRef.current.gain.setTargetAtTime(
        (baseVol + speedVol + throttleBoost) * volumeMultiplier,
        ctx.currentTime,
        0.08
      )
    }

    if (noiseGainRef.current) {
      const crackle = speedRatio * 0.04 * volumeMultiplier
      noiseGainRef.current.gain.setTargetAtTime(crackle, ctx.currentTime, 0.05)
    }
  }, [engineEnabled, volume])

  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => {
      const newState = !prev
      if (backgroundMusicRef.current) {
        if (newState) {
          backgroundMusicRef.current.play()
        } else {
          backgroundMusicRef.current.pause()
        }
      }
      return newState
    })
  }, [])

  const toggleEngine = useCallback(() => {
    setEngineEnabled(prev => !prev)
  }, [])

  const setVolumeLevel = useCallback((newVolume) => {
    setVolume(newVolume)
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume((newVolume / 100) * 0.25)
    }
  }, [])

  const stopEngineSound = useCallback(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.15)
    }
  }, [])

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(({ osc }) => {
        try { osc.stop() } catch (e) {}
      })
      if (noiseNodeRef.current) {
        try { noiseNodeRef.current.stop() } catch (e) {}
      }
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return { 
    playEngineSound, 
    updateEngineSound, 
    stopEngineSound,
    toggleMusic,
    toggleEngine,
    setVolume: setVolumeLevel,
    musicEnabled,
    engineEnabled,
    volume
  }
}
