import { Link } from 'react-router-dom'
import React from 'react'

import { CalendarPage } from '../../components/Calendar'
import { LoginState } from '../../domain/types'
import './Home.scss'

export const Home = ({ login, setLogin }: LoginState) => {
  const authentication = !login ? (
    <div className='navbar'>
      <Link to='/login' className='navbar__auth-text'>
        LOG IN
      </Link>
    </div>
  ) : (
    <CalendarPage setLogin={setLogin} />
  )

  return (
    <div className='home'>
      <div>{authentication}</div>
    </div>
  )
}
