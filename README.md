# Noris 2026 - F1 Racing Game

A professional 3D F1 racing game built with React, Three.js, and React Three Fiber.

## Features

- 🏎️ **Realistic F1 Experience**: First-person cockpit view with steering wheel and dashboard
- 🗺️ **Two Unique Tracks**: Monaco-inspired (tight, technical) and Silverstone-inspired (sweeping, high-speed)
- 🎮 **Realistic Physics**: F1-grade acceleration, braking, and steering
- 🔊 **Dynamic Audio**: Engine sounds that change based on speed
- 📊 **Race Features**: 
  - Traffic light countdown start
  - 2-lap races (~1 minute per lap)
  - Real-time speedometer
  - Lap counter
  - Minimap with position indicator
- 🎨 **Professional UI**: Overwatch-inspired menu design
- ⚡ **Optimized Performance**: 60 FPS target with motion blur and speed effects

## Controls

- **W** - Accelerate
- **A** - Steer Left
- **D** - Steer Right
- **S** - Brake
- **ESC** - Return to Menu

## Installation

```bash
# Install all dependencies
npm run install-all

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

### Note on Large Files

Large 3D model files (`.glb` files over 100MB) are not included in the repository due to GitHub's file size limits. These files should be kept locally in:
- `client/public/models/` - For game models
- `Map/` - For track maps
- `F1_car/` - For car models

The game will work with the files that are already present locally. For deployment, ensure these files are included in your deployment process.

## Project Structure

```
verstappen-2025/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Menu/       # Main menu and map selection
│   │   │   └── Game/       # Game components (Car, Track, UI)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # State management (Zustand)
│   │   └── App.jsx         # Main app component
│   └── package.json
└── package.json
```

## Technologies

- **React 18** - UI framework
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **@react-three/cannon** - Physics engine
- **@react-three/drei** - Useful helpers for R3F
- **Howler.js** - Audio engine
- **Zustand** - State management
- **Vite** - Build tool

## Deployment

The project is configured for deployment on Render. The `render.yaml` file contains the deployment configuration.

To deploy:
1. Push code to GitHub
2. Connect repository to Render
3. Render will automatically detect and deploy using `render.yaml`

## Future Features

- [ ] Online multiplayer mode
- [ ] More tracks
- [ ] Leaderboards
- [ ] Replay system
- [ ] Customizable car settings

## License

MIT

