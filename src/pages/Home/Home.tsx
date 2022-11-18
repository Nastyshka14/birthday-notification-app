import React from 'react'
import { Link } from 'react-router-dom'
import { GoogleOut } from '../../components/GoogleLogout'
import { CalendarPage } from '../../components/Calendar'
import './Home.scss'

type LoginProps = {
  login: object
  setLogin: (value: object) => void
}

export const Home = ({ login, setLogin }: LoginProps) => {
  return (
    <div>
      {login ? (
        <div className="home">
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
}
