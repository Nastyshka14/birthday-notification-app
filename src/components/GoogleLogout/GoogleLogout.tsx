import React from 'react'
import { GoogleLogout } from 'react-google-login'
import { useNavigate } from 'react-router-dom'

import { LoginState } from '../../domain/types'

import './GoogleLogout.scss'

export const GoogleOut = ({ setLogin }: LoginState) => {
  const navigate = useNavigate()

  const onSuccess = () => {
    localStorage.removeItem('login')
    setLogin(null)
    navigate(0)
  }

  return (
    <GoogleLogout
      className='google-logout'
      clientId={`${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`}
      buttonText={'Log out'}
      onLogoutSuccess={onSuccess}
      render={(renderProps) => (
        <button className='google-logout__btn' onClick={renderProps.onClick}>
          Log out
        </button>
      )}
    />
  )
}
