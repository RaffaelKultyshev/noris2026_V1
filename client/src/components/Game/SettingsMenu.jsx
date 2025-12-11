import { useState, useRef, useEffect } from 'react'
import './SettingsMenu.css'

export default function SettingsMenu({ carRef, onReset, audioControls }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleReset = () => {
    if (carRef?.current?.reset) {
      carRef.current.reset()
    }
    if (onReset) onReset()
    setIsOpen(false)
  }

  return (
    <div className="settings-menu-container" ref={menuRef}>
      <button 
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        MENU
      </button>
      
      {isOpen && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>SETTINGS</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="settings-content">
            {/* Reset Button */}
            <button className="settings-btn reset-btn" onClick={handleReset}>
              <span>🔄</span>
              <span>Reset Position</span>
            </button>
            
            {/* Music Toggle */}
            <div className="settings-row">
              <label>
                <span>🎵</span>
                <span>Background Music</span>
              </label>
              <button 
                className={`toggle-btn ${audioControls?.musicEnabled ? 'active' : ''}`}
                onClick={() => audioControls?.toggleMusic()}
              >
                {audioControls?.musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            
            {/* Engine Sound Toggle */}
            <div className="settings-row">
              <label>
                <span>🔊</span>
                <span>Engine Sound</span>
              </label>
              <button 
                className={`toggle-btn ${audioControls?.engineEnabled ? 'active' : ''}`}
                onClick={() => audioControls?.toggleEngine()}
              >
                {audioControls?.engineEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            
            {/* Volume Slider */}
            <div className="settings-row slider-row">
              <label>
                <span>🔉</span>
                <span>Master Volume</span>
              </label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioControls?.volume || 100}
                  onChange={(e) => audioControls?.setVolume(parseInt(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-value">{audioControls?.volume || 100}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

