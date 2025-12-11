import './GameUI.css'

export default function GameUI({ controls }) {
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--.--'
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(2)
    return `${mins}:${secs.padStart(5, '0')}`
  }

  const speed = Math.round(controls.speed || 0)
  
  // Position info
  const posX = (controls.position?.[0] || 0).toFixed(1)
  const posY = (controls.position?.[1] || 0).toFixed(1)
  const posZ = (controls.position?.[2] || 0).toFixed(1)
  const rotationDeg = Math.round(((controls.rotation || 0) * 180 / Math.PI) % 360)

  return (
    <div className="game-ui">
      {/* Top Bar - Lap info only */}
      <div className="top-bar">
        <div className="lap-counter">
          LAP {controls.currentLap}/2
        </div>
      </div>

      {/* Position Display - Top Left Middle - SMALLER */}
      <div className="position-display">
        <div className="pos-row">X: <span className="pos-value">{posX}</span></div>
        <div className="pos-row">Y: <span className="pos-value">{posY}</span></div>
        <div className="pos-row">Z: <span className="pos-value">{posZ}</span></div>
        <div className="pos-row">Angle: <span className="pos-value">{rotationDeg}°</span></div>
      </div>

      {/* LAP TIMES - Top Center */}
      <div className="lap-times">
        <div className="lap-time-row">
          <span className="lap-label">TIME:</span>
          <span className="lap-value">{formatTime(controls.raceTime)}</span>
        </div>
        <div className="lap-time-row">
          <span className="lap-label">CURRENT LAP:</span>
          <span className="lap-value">{formatTime(controls.lapTime)}</span>
        </div>
        {controls.lastLapTime && (
          <div className="lap-time-row">
            <span className="lap-label">LAST LAP:</span>
            <span className="lap-value last">{formatTime(controls.lastLapTime)}</span>
          </div>
        )}
        {controls.bestLapTime && (
          <div className="lap-time-row">
            <span className="lap-label">BEST LAP:</span>
            <span className="lap-value best">{formatTime(controls.bestLapTime)}</span>
          </div>
        )}
      </div>

      {/* SPEED DISPLAY - Bottom Left */}
      <div className="speed-display">
        <span className="speed-value">{speed}</span>
        <span className="speed-unit">KM/H</span>
      </div>

      {/* Gear indicator */}
      {controls.raceStarted && (
        <div className="gear-display">
          <span className="gear-number">{Math.min(Math.max(Math.floor(speed / 45) + 1, 1), 8)}</span>
        </div>
      )}

      {/* Race Finished */}
      {controls.raceFinished && (
        <div className="race-finished">
          <h1>🏁 RACE FINISHED!</h1>
          <p>Total Time: {formatTime(controls.raceTime)}</p>
          {controls.bestLapTime && <p>Best Lap: {formatTime(controls.bestLapTime)}</p>}
          {controls.lastLapTime && <p>Last Lap: {formatTime(controls.lastLapTime)}</p>}
          <p className="return-hint">Returning to menu...</p>
        </div>
      )}

      {/* Throttle/Brake indicators */}
      {controls.raceStarted && (
        <div className="pedal-indicators">
          <div className={`pedal-bar throttle ${controls.keys?.w ? 'active' : ''}`} />
          <div className={`pedal-bar brake ${controls.keys?.s ? 'active' : ''}`} />
        </div>
      )}
    </div>
  )
}
