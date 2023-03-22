import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { Amplify } from 'aws-amplify'
import App from './App'
import config from './aws-exports.js'
import reportWebVitals from './reportWebVitals.js'
import './index.css'


Amplify.configure(config)

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
