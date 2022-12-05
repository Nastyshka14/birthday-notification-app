import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { gapi } from 'gapi-script'
import { Login } from './pages/Login/Login'
import { Home } from './pages/Home/Home'

function App() {
  const loginItem: string = localStorage.getItem('login')
  const [login, setLogin] = useState<object | null>(loginItem ? JSON.parse(loginItem) : null)

  const initClient = () => {
    gapi.client.init({
      clientId: `${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`,
      scope: '',
    })
  }

  gapi.load('client:auth2', initClient)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home login={login} setLogin={setLogin} />} />
        <Route path='/login' element={<Login setLogin={setLogin} />} />
      </Routes>
    </>
  )
}

export default App
