import { Link } from 'react-router-dom'
import React from 'react'

import { CalendarPage } from '../../components/Calendar'
import { GoogleOut } from '../../components/GoogleLogout'
import { LoginState } from '../../domain/types'

import './Home.scss'

export const Home = ({ login, setLogin }: LoginState) => {
  function authentication(): JSX.Element {
    if (login) {
      return (
        <div className='navbar navbar_logout'>
          <GoogleOut setLogin={setLogin} />
        </div>
      )
    }
    return (
      <div className='navbar'>
        <Link to='/login' className='navbar__auth-text'>
          LOG IN
        </Link>
      </div>
    )
  }

  return (
    <div className='home'>
      {authentication()}
      <div id='app-root' className={!login && 'container'}>
        {!login && <div className='container__overlay' />}
        <CalendarPage />
      </div>
    </div>
  )
}
