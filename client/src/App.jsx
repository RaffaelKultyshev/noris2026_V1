import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import MainMenu from './components/Menu/MainMenu'
import MapSelection from './components/Menu/MapSelection'
import Game from './components/Game/Game'
import './App.css'

function App() {
  const { gameState, selectedMap, setGameState, setSelectedMap } = useGameStore()

  if (gameState === 'menu') {
    return <MainMenu />
  }

  if (gameState === 'mapSelection') {
    return <MapSelection />
  }

  if (gameState === 'racing') {
    return <Game trackId={selectedMap} />
  }

  return <MainMenu />
}

export default App

