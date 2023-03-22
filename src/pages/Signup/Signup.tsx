import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

import { Button, Col, Form, Input, Row, Spin } from 'antd'
import { CalendarOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Auth } from 'aws-amplify'
import { ConfirmEmailContainer } from '@pages/ConfirmEmailContainer/ConfirmEmailContainer'
import { GoogleIn } from '@components/GoogleLogin'
import { LoginProps } from '@domain/types'
import './Signup.scss'

export const Signup = ({
  setLogin,
}: {
  setLogin: React.Dispatch<React.SetStateAction<LoginProps>>
}): JSX.Element => {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState<boolean>(false)
  const navigate = useNavigate()

  const toLogIn = (data: LoginProps): void => {
    setLogin(data)
    localStorage.setItem('login', JSON.stringify(data))
    navigate('/')
  }

  const onSubmit = async (): Promise<void> => {
    setLoading(true)
    try {
      const newUser = await Auth.signUp({
        username: email,
        password,
        attributes: {
          // eslint-disable-next-line camelcase
          family_name: username,
          // eslint-disable-next-line camelcase
          given_name: lastName,
          birthdate: birthday,
        },
      })
      setUser(newUser)
    } catch (e) {
      alert(e.message)
    }
    setLoading(false)
  }

  const onChangeInput = (e: { target: { name: string; value: string } }) => {
    const eventFieldName: string = e.target.name
    const eventFieldValue: string = e.target.value

    switch (eventFieldName) {
      case 'username':
        setUsername(eventFieldValue)
        break
      case 'lastName':
        setLastName(eventFieldValue)
        break
      case 'email':
        setEmail(eventFieldValue)
        break
      case 'birthday':
        setBirthday(eventFieldValue)
        break
      case 'password':
        setPassword(eventFieldValue)
        break
      case 'confirm':
        setConfirm(eventFieldValue)
        break
      default:
        console.error('field isnt exist')
    }
  }

  // eslint-disable-next-line no-useless-escape
  const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  const onFailure = () => setFailed(true)

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: 'Email is not valid!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }

  return (
    <div className='container'>
      {user === null ? (
        <div className='signup'>
          <h1 className='signup__info'>Create an account</h1>
          <div className='signup__area'>
            <div className='signup__container'>
              <Form onFinish={onSubmit} validateMessages={validateMessages} className='signup__form'>
                <Form.Item name={'First name'} rules={[{ required: true }]}>
                  <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    placeholder='First Name'
                    value={username}
                    name='username'
                    onChange={onChangeInput}
                  />
                </Form.Item>
                <Form.Item name={'Last name'} rules={[{ required: true }]}>
                  <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    placeholder='Last Name'
                    value={lastName}
                    name='lastName'
                    onChange={onChangeInput}
                  />
                </Form.Item>
                <Form.Item name={'Email'} rules={[{ type: 'email', required: true }]}>
                  <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    placeholder='Email'
                    value={email}
                    name='email'
                    onChange={onChangeInput}
                  />
                </Form.Item>
                <Form.Item name={'Birthday'} rules={[{ required: true }]}>
                  <Input
                    prefix={<CalendarOutlined className='site-form-item-icon' />}
                    placeholder='Birthday'
                    value={birthday}
                    name='birthday'
                    onChange={onChangeInput}
                  />
                </Form.Item>
                <Form.Item
                  name={'password'}
                  rules={[
                    { required: true },
                    () => ({
                      validator(_, value) {
                        if (value.length < 8) {
                          return Promise.reject(new Error('The password should contain 8 symbols'))
                        } else if (!format.test(value)) {
                          return Promise.reject(
                            new Error('The password should contain special symbols'),
                          )
                        } else if (!value.split('').some((i) => !isNaN(i))) {
                          return Promise.reject(new Error('The password should contain numbers'))
                        } else if (
                          !value
                            .split('')
                            .some((i) => i.toUpperCase() === i && isNaN(i) && !format.test(i))
                        ) {
                          return Promise.reject(new Error('The password should contain uppercase'))
                        } else if (
                          !value
                            .split('')
                            .some((i) => i.toLowerCase() === i && isNaN(i) && !format.test(i))
                        ) {
                          return Promise.reject(new Error('The password should contain lowercase'))
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    type='password'
                    placeholder='Password'
                    value={password}
                    name='password'
                    onChange={onChangeInput}
                  />
                </Form.Item>
                <Form.Item
                  name={'confirm password'}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('The two passwords that you entered do not match!'),
                        )
                      },
                    }),
                  ]}
                  dependencies={['password']}
                >
                  <Input
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    type='password'
                    placeholder='Confirm Password'
                    value={confirm}
                    name='confirm'
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
              <div className='signup__divider'>
                <div className='signup__line' />
                <span className='signup__divider-text'>OR</span>
                <div className='signup__line' />
              </div>
              <div className='signup__login-container'>
                <Link to='/login' className='signup__login-link'>
                  Log in to your account!
                </Link>
                <div className='signup__google-container'>
                  <GoogleIn setLogin={setLogin} onFailure={onFailure} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ConfirmEmailContainer email={email} password={password} toLogIn={toLogIn} user={user} />
      )}
    </div>
  )
}
