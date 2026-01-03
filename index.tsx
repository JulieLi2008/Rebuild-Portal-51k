
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Importing your main App file
import './styles.css'   // Importing your styles (if you have them)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
