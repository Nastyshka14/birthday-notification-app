import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals.js'
import './index.css'

import { Amplify } from 'aws-amplify'
import config from './aws-exports.js'
import '@aws-amplify/ui-react/styles.css'

import { AmplifyProvider } from '@aws-amplify/ui-react'

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
