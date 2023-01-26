import React, {useEffect, useState} from 'react'
import {GoogleLogin} from 'react-google-login'
import './Login.scss'
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'
import {Link, useNavigate} from 'react-router-dom'
import UserPool from '../../UserPool'
import classNames from 'classnames'

import {LoginProps, LoginState} from '../../domain/types'

export const Login = ({setLogin}: LoginState) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [emailInside, setEmailInside] = useState<boolean>(false)
    const [passwordInside, setPasswordInside] = useState<boolean>(false)
    const [emailError, setEmailError] = useState<string>('Email cannot be empty.')
    const [passwordError, setPasswordError] = useState<string>('Password cannot be empty.')
    const [message, setMessage] = useState<string>('')
    const [formValid, setFormValid] = useState<boolean>(false)
    const [failed, setFailed] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (emailError || passwordError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }, [emailError, passwordError])

    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(String(e.target.value).toLowerCase())) {
            setEmailError('The email is incorrect.')
        } else {
            setEmailError('')
        }
    }
    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        if (e.target.value.length <= 8) {
            setPasswordError('Password must be at least 8 characters long')
            if (!e.target.value) {
                setPasswordError('Password cannot be empty.')
            }
        } else {
            setPasswordError('')
        }
    }

    const blurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'email':
                setEmailInside(true)
                break
            case 'password':
                setPasswordInside(true)
                break
        }
    }

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

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        })

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        })

        user.authenticateUser(authDetails, {
            onSuccess: async (data) => {
                setLogin(data)
                localStorage.setItem('login', JSON.stringify(data.getIdToken().getJwtToken()))
                navigate('/')
            },
            onFailure: () => {
                setMessage('Incorrect email or password.')
                setFailed(true)
            },
        })
    }

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
                        <p className='login__inputs message'>{message}</p>
                        <div className='login__item'>
                            <label className='login__label'>EMAIL ADDRESS</label>
                            <input placeholder='name@example.com'
                                   onBlur={(e) => blurHandler(e)}
                                   name='email'
                                   className={classNames('login__input', {error: emailInside && emailError})}
                                   value={email}
                                   onChange={(e) => emailHandler(e)}/>
                            <p className='login__inputs empty'>{emailInside && emailError}</p>
                        </div>
                        <div className='login__item'>
                            <label className='login__label'>PASSWORD</label>
                            <input
                                onBlur={(e) => blurHandler(e)}
                                name='password'
                                placeholder='Password'
                                className={classNames('login__input', {error: emailInside && emailError})}
                                value={password}
                                onChange={(e) => passwordHandler(e)}/>
                            <p className='login__inputs empty'>{passwordInside && passwordError}</p>
                        </div>
                        <button disabled={!formValid} className='login__btn' type={'submit'}>Log in</button>
                    </form>
                    <div className='login__divider'>
                        <div className='login__line'/>
                        <span className='login__divider-text'>OR</span>
                        <div className='login__line'/>
                    </div>
                    <div className='login__social'>
                        <div className='login__google'>
                            <GoogleLogin
                                clientId={`${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`}
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                                render={(renderProps) => (
                                    <button className='login__google-btn' onClick={renderProps.onClick}>
                                        <div className='login__google-icon'/>
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
