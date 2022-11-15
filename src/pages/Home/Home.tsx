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
        <div>
          <div className='navbar logout'>
            <GoogleOut setLogin={setLogin} />
          </div>
          <div id='app-root'>
            <CalendarPage />
          </div>
        </div>
      ) : (
        <div className='wrapper'>
          <div className='navbar'>
            <Link to='/login' className='navbar__item'>
              LOG IN
            </Link>
          </div>
          <div className='container'>
            <div className='container__overlay' />
            <div id='app-root'>
              <CalendarPage />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
