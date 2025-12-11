import { create } from 'zustand'

export const useGameStore = create((set) => ({
  gameState: 'menu', // 'menu', 'mapSelection', 'racing'
  selectedMap: null,
  isOnline: false,
  setGameState: (state) => set({ gameState: state }),
  setSelectedMap: (map) => set({ selectedMap: map }),
  setIsOnline: (online) => set({ isOnline: online }),
}))

