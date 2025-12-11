import { useGameStore } from '../../store/gameStore'
import './MainMenu.css'

export default function MainMenu() {
  const setGameState = useGameStore((state) => state.setGameState)

  return (
    <div className="main-menu">
      <div className="menu-background">
        <div className="particles">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
      </div>
      
      <div className="menu-content">
        <h1 className="game-title">NORIS 2026</h1>
        <h2 className="game-subtitle">F1 RACING EXPERIENCE</h2>
        
        <button 
          className="play-button"
          onClick={() => setGameState('mapSelection')}
        >
          <span className="button-text">PLAY</span>
          <span className="button-glow"></span>
        </button>
      </div>
    </div>
  )
}

