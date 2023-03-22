import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

import { Button, Col, Form, Input, Row, Spin } from 'antd'
import { CognitoUser, LoginProps } from '@domain/types'
import { Auth } from 'aws-amplify'
import { GoogleIn } from '@components/GoogleLogin'
import { UserOutlined } from '@ant-design/icons'
import './Login.scss'


export const Login = ({
  setLogin,
}: {
  setLogin: React.Dispatch<React.SetStateAction<LoginProps>>
}): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [failed, setFailed] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFailure = (): void => setFailed(true)

  const getLoginUser = (user: CognitoUser): LoginProps => {
    return {
      lastName: user.attributes.family_name,
      name: user.attributes.given_name,
      email: user.attributes.email,
    }
  }

  const onSubmit = async (): Promise<void> => {
    setLoading(true)
    try {
      const newUser = await Auth.signIn(email, password)
      setLogin(getLoginUser(newUser))
      localStorage.setItem('login', JSON.stringify(getLoginUser(newUser)))
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
      <div className='login'>
        <div className='login__info'>
          <span>Log into Calendar</span>
          <span> or </span> 
          <Link to='/signup' className='login__signup-link'>
            Sign up
          </Link>
        </div>
        {failed && <p className='login__failed'>Login failed</p>}
        <div className='login__area'>
          <div className='login__container'>
            <Form onFinish={onSubmit} className='login__form'>
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
                  <Col lg={24} style={{ width: '100%' }}>
                    <Button
                      type='primary'
                      disabled={loading}
                      htmlType='submit'
                      style={{ width: '100%' }}
                    >
                      {loading ? (
                        <Spin indicator={<UserOutlined className='site-form-item-icon' />} />
                      ) : (
                        'Login'
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
                <GoogleIn setLogin={setLogin} onFailure={onFailure} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
