import React from 'react'
import { useNavigate } from 'react-router-dom'

import { CalendarPage } from '@components/Calendar'
import { Login } from '../Login/Login'
import { LoginState } from '@domain/types'
import './Home.scss'

export const Home = ({ login, setLogin }: LoginState): JSX.Element => {
  const navigate = useNavigate()
  const userInitials = !login.picture
    ? `${login?.lastName.toUpperCase()[0]}${login?.name.toUpperCase()[0]}`
    : ''
  const toSignUp = () => {
    navigate('/login')
    return (
      <div>
        <Login setLogin={setLogin} />
      </div>
    )
  }

  const toLogIn = () => {
    navigate('/')
    return (
      <div>
        <CalendarPage userInitials={userInitials} />
      </div>
    )
  }
  const authentication = !login ? toSignUp() : toLogIn()

  return authentication
}
