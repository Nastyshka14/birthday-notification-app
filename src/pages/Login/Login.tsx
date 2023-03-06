import React, { useState } from 'react'

import { Button, Col, Form, Input, Row, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { LoginProps, LoginState } from '../../domain/types'
import { Auth } from 'aws-amplify'
import { GoogleLogin } from 'react-google-login'
import { UserOutlined } from '@ant-design/icons'
import './Login.scss'

export const Login = ({ setLogin }: LoginState) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [failed, setFailed] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
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

  const onSubmit = async () => {
    setLoading(true)
    try {
      const newUser = await Auth.signIn(email, password)
      setLogin(newUser)
      localStorage.setItem('login', JSON.stringify(newUser))
      navigate('/')
    } catch (e) {
      alert(e.message)
    }
    setLoading(false)
  }

  const onChangeInput = (e: { target: { name: string; value: string } }) => {
    const eventFieldName: string = e.target.name
    const eventFieldValue: string = e.target.value
    switch (eventFieldName) {
      case 'email':
        setEmail(eventFieldValue)
        break
      case 'password':
        setPassword(eventFieldValue)
        break
      default:
        console.error('field isnt exist')
    }
  }

  return (
    <div className='container'>
      <div className='navbar'>
        <Link to='/' className='navbar__auth-text'>
          BACK
        </Link>
      </div>
      <div className='login'>
        <div className='login__info'>Log into Calendar or <Link to='/signup' className='login__signup-link'>Sign up</Link></div>
        {failed && <p className='login__failed'>Login failed</p>}
        <div className='login__area'>
        <div className='login__container'>
          <Form onFinish={onSubmit}>
            <Form.Item>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='Email'
                value={email}
                name='email'
                onChange={onChangeInput}
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
                value={password}
                name='password'
                onChange={onChangeInput}
              />
            </Form.Item>
            <Form.Item className='text-center'>
              <Row>
                <Col lg={24}>
                  <Button
                    style={{ width: '100%' }}
                    type='primary'
                    disabled={loading}
                    htmlType='submit'
                  >
                    {loading ? (
                      <Spin indicator={<UserOutlined className='site-form-item-icon' />} />
                    ) : (
                      'Register'
                    )}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
          <div className='login__divider'>
            <div className='login__line' />
            <span className='login__divider-text'>OR</span>
            <div className='login__line' />
          </div>
          <div className='login__social'>
            <div className='login__google'>
              <GoogleLogin
                clientId={
                  '831800577601-q6vcr59hkau3n90rvfpp9oktlsjh4l9c.apps.googleusercontent.com'
                }
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
    </div>
  )
}
