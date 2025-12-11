import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// #region agent log
fetch('http://127.0.0.1:7242/ingest/223b6629-4162-42ae-bf88-ac9429aebf70', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'debug-session',
    runId: 'run_main_entry',
    hypothesisId: 'H1',
    location: 'main.jsx:11',
    message: 'main_entry_loaded',
    data: {},
    timestamp: Date.now()
  })
}).catch(() => {})
// #endregion

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

