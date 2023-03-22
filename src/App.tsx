import { Navigate, Route, Routes } from 'react-router-dom'
import React, { useState } from 'react'

import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'
import { LoginProps } from './domain/types'
import { Signup } from './pages/Signup/Signup'
import { gapi } from 'gapi-script'


function App() {
  const loginItem: string = localStorage.getItem('login')
  const [login, setLogin] = useState<LoginProps | null>(loginItem ? JSON.parse(loginItem) : null)

  const initClient = () => {
    gapi.client.init({
      clientId: `${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`,
      scope: '',
    })
  }
  gapi.load('client:auth2', initClient)

  return (
    <Routes>
      <Route path='*' element={<Navigate to='/login' replace />} />
      {!login ? (
        <Route path='/login' element={<Login setLogin={setLogin} />} />
      ) : (
        <Route path='/' element={<Home login={login} setLogin={setLogin} />} />
      )}
      <Route path='/signup' element={<Signup setLogin={setLogin} />} />
      <Route path='/login' element={<Login setLogin={setLogin} />} />
    </Routes>
  )
}

export default App
