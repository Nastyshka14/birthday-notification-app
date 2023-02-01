import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { LoginProps, LoginState } from '../../domain/types'
import { GoogleLogin } from 'react-google-login'
import './Login.scss'


export const Login = ({ setLogin }: LoginState) => {
  const [failed, setFailed] = useState<boolean>(false)
  const navigate = useNavigate()

  const onSuccess = async (res) => {
    const data = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: res.tokenId,
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

  const onFailure = () => setFailed(true)

  return (
    <div className='container'>
      <div className='navbar'>
        <Link to='/' className='navbar__auth-text'>
          BACK
        </Link>
      </div>
      <div className='login'>
        <h1 className='login__info'>Log into Calendar</h1>
        {failed && <p className='login__failed'>Login failed</p>}
        <div className='login__area'>
          <form className='login__inputs'>
            <div className='login__item'>
              <label className='login__label'>EMAIL ADDRESS</label>
              <input placeholder='name@example.com' className='login__input' />
            </div>
            <div className='login__item'>
              <label className='login__label'>PASSWORD</label>
              <input placeholder='Password' className='login__input' />
            </div>
            <button className='login__btn'>Log in</button>
          </form>
          <div className='login__divider'>
            <div className='login__line' />
            <span className='login__divider-text'>OR</span>
            <div className='login__line' />
          </div>
          <div className='login__social'>
            <div className='login__google'>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
