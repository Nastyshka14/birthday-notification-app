import React from 'react'
import { Link } from 'react-router-dom'

import { CalendarPage } from '../../components/Calendar'
import { GoogleOut } from '../../components/GoogleLogout'
import { LoginState } from '../../domain/types'

import './Home.scss'

export const Home = ({ login, setLogin }: LoginState) => (
  <div>
    {login ? (
      <div className='home'>
        <div className='navbar navbar_logout'>
          <GoogleOut setLogin={setLogin} />
        </div>
        <div id='app-root'>
          <CalendarPage />
        </div>
      </div>
    ) : (
      <div className='home'>
        <div className='navbar'>
          <Link to='/login' className='navbar__auth-text'>
            LOG IN
          </Link>
        </div>
        <div className='container'>
          <div className='container__overlay' />
          <CalendarPage />
        </div>
      </div>
    )}
  </div>
)
