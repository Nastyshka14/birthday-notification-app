import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}

if (!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}

reportWebVitals()
