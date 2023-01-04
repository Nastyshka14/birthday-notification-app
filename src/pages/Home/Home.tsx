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
        <div className='home__navbar logout'>
          <GoogleOut setLogin={setLogin} />
        </div>
        <div id='app-root'>
          <CalendarPage />
        </div>
      </div>
    ) : (
      <div className='home'>
        <div className='home__navbar'>
          <Link to='/login' className='navbar auth--text'>
            LOG IN
          </Link>
        </div>
        <div className='home__container'>
          <div className='container overlay' />
          <CalendarPage />
        </div>
      </div>
    )}
  </div>
)
