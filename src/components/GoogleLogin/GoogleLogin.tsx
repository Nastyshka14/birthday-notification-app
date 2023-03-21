import React from 'react'
import { useNavigate } from 'react-router-dom'

import { GoogleLogin, GoogleLoginResponse } from 'react-google-login'
import { LoginProps } from '../../domain/types'
import './GoogleLogin.scss'

export const GoogleIn = ({
  setLogin,
  onFailure,
}: {
  setLogin: React.Dispatch<React.SetStateAction<LoginProps>>
  onFailure: () => void
}): JSX.Element => {
  const navigate = useNavigate()
  const onSuccess = async (response: GoogleLoginResponse): Promise<void> => {
    const data = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: response?.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const loginData: LoginProps = await data.json()
    setLogin(loginData)
    localStorage.setItem('login', JSON.stringify(loginData))
    navigate('/')
  }
  return (
    <GoogleLogin
      clientId={'831800577601-q6vcr59hkau3n90rvfpp9oktlsjh4l9c.apps.googleusercontent.com'}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
      render={(renderProps) => (
        <button className='login__google-btn' onClick={renderProps.onClick}>
          <div className='login__google-icon' />
          Continue with Google
        </button>
      )}
    />
  )
}
