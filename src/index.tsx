import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'

declare global {
  interface Window {
    cordova: unknown
  }
}

window.cordova = window.cordova || false

const root = ReactDOM.createRoot(document.getElementById('root'))
const startApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

if (!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}

reportWebVitals()
