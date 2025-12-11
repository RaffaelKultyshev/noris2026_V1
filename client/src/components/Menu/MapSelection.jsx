import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import './MapSelection.css'

const maps = [
  {
    id: 'monaco',
    name: 'Monaco Grand Prix',
    description: 'Tight corners, narrow streets',
    preview: '🏎️',
    available: true
  },
  {
    id: 'dubai',
    name: 'Dubai Grand Prix',
    description: 'Coming Soon',
    preview: '🏜️',
    available: false
  }
]

export default function MapSelection() {
  const [selectedMapLocal, setSelectedMapLocal] = useState('monaco')  // Auto-select Monaco
  const [isOnline, setIsOnline] = useState(false)
  const { setGameState, setSelectedMap } = useGameStore()

  const handleStart = () => {
    if (!selectedMapLocal) return
    
    if (isOnline) {
      alert('Online mode is currently being built and is not ready yet. Please use offline mode.')
      return
    }
    
    setSelectedMap(selectedMapLocal)
    setGameState('racing')
  }

  return (
    <div className="map-selection">
      <div className="selection-background">
        <div className="particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
      </div>

      <div className="selection-content">
        <h1 className="selection-title">SELECT TRACK</h1>
        
        <div className="maps-grid">
          {maps.map((map) => (
            <button
              key={map.id}
              className={`map-card ${selectedMapLocal === map.id ? 'selected' : ''} ${!map.available ? 'unavailable' : ''}`}
              onClick={() => map.available && setSelectedMapLocal(map.id)}
              type="button"
              disabled={!map.available}
            >
              <div className="map-preview">{map.preview}</div>
              <h3 className="map-name">{map.name}</h3>
              <p className="map-description">{map.description}</p>
              {!map.available && <div className="coming-soon-badge">COMING SOON</div>}
            </button>
          ))}
        </div>

        <div className="mode-toggle-container">
          <span className="toggle-label">Mode:</span>
          <div className="toggle-switch">
            <button
              className={`toggle-option ${!isOnline ? 'active' : ''}`}
              onClick={() => setIsOnline(false)}
            >
              Offline
            </button>
            <button
              className={`toggle-option ${isOnline ? 'active' : ''}`}
              onClick={() => setIsOnline(true)}
            >
              Online
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button className="back-button" onClick={() => setGameState('menu')}>
            BACK
          </button>
          <button 
            className="start-button"
            onClick={handleStart}
            disabled={!selectedMapLocal}
          >
            START RACE
          </button>
        </div>
      </div>
    </div>
  )
}

