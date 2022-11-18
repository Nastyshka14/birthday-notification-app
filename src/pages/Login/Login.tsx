import React from 'react'
import { GoogleLogin } from 'react-google-login'
import './Login.scss'
import { Link, useNavigate } from 'react-router-dom'

type LoginProps = {
  setLogin: (value: object) => void
}

export const Login = ({ setLogin }: LoginProps) => {
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
    const loginData: object = await data.json()
    setLogin(loginData)
    localStorage.setItem('login', JSON.stringify(loginData))
    navigate('/')
  }

  return (
    <div className='login'>
      <div className='login__navbar'>
        <Link to='/' className='navbar auth--text'>
          BACK
        </Link>
      </div>
      <div className='login__container'>
        <h1 className='login__info'>Log into Calendar</h1>
        <div className='login__area'>
          <form className='login__inputs'>
            <div className='login__inputs item'>
              <label className='login__inputs label'>EMAIL ADDRESS</label>
              <input placeholder='name@example.com' className='login__inputs input' />
            </div>
            <div className='login__inputs item'>
              <label className='login__inputs label'>PASSWORD</label>
              <input placeholder='Password' className='login__inputs input' />
            </div>
            <button className='login__inputs btn'>Log in</button>
          </form>
          <div className='login__divider'>
            <div className='login__divider line' />
            <span className='login__divider text'>OR</span>
            <div className='login__divider line' />
          </div>
          <div className='login__social'>
            <div className='login__social google'>
              <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`}
                onSuccess={onSuccess}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                render={renderProps => (
                    <button className="login__google btn" onClick={renderProps.onClick}><div className="login__google icon" />Continue with Google</button>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
