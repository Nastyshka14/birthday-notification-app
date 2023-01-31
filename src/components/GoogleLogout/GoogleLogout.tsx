import React from 'react'

import { GoogleLogout } from 'react-google-login'
import { Login } from 'src/pages/Login/Login'
import { LoginState } from '../../domain/types'
import './GoogleLogout.scss'


export const GoogleOut = ({ setLogin }: LoginState) => {

  const onSuccess = () => {
    localStorage.removeItem('login')
    setLogin(null)
  }

  const getName = () => {
    const lol = localStorage.getItem('login')
    return JSON.parse(lol)
  }
  return (
    <GoogleLogout
      className='google-logout'
      clientId={`${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`}
      buttonText={'Log out'}
      onLogoutSuccess={onSuccess}
      render={(renderProps) => (
        <div>
        <button className='google-logout__btn' onClick={renderProps.onClick}>
          Log out
        </button>
        <img src={getName().picture} alt='lol' width={'50px'} height={'50px'} /></div>
      )}
    />
  )
}
