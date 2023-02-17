import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

import { Button, Col, Form, Input, Popover, Row, Spin } from 'antd'
import { Auth } from 'aws-amplify'
import { ConfirmEmailContainer } from '../ConfirmEmailContainer/ConfirmEmailContainer'
import { LoginState } from '../../domain/types'
import { UserOutlined } from '@ant-design/icons'
import './Signup.scss'

export const Signup = ({ setLogin }: LoginState) => {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const toLogIn = (data) => {
    setLogin(data)
    localStorage.setItem('login', JSON.stringify(data))
    navigate('/')
  }

  const onSubmit = async () => {
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

  const title = 'Password Policy'
  const passwordPolicyContent = (
    <React.Fragment>
      <h4>Your password should contain: </h4>
      <ul>
        <li>Minimum length of 8 characters</li>
        <li>Numerical characters (0-9)</li>
        <li>Special characters</li>
        <li>Uppercase letter</li>
        <li>Lowercase letter</li>
      </ul>
    </React.Fragment>
  )

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

  return (
    <div className='container'>
      <div className='navbar'>
        <Link to='/' className='navbar__auth-text'>
          BACK
        </Link>
      </div>
      <div className='login'>
        <h1 className='login__info'>Sign up</h1>
        <div className='login__area'>
          {user === null ? (
            <Form onFinish={onSubmit}>
              <Form.Item>
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='First Name'
                  value={username}
                  name='username'
                  onChange={onChangeInput}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='Last Name'
                  value={lastName}
                  name='lastName'
                  onChange={onChangeInput}
                />
              </Form.Item>
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
                  placeholder='Birthday'
                  value={birthday}
                  name='birthday'
                  onChange={onChangeInput}
                />
              </Form.Item>
              <Form.Item>
                <Popover
                  placement='right'
                  title={title}
                  content={passwordPolicyContent}
                  trigger='focus'
                >
                  <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    type='password'
                    placeholder='Password'
                    value={password}
                    name='password'
                    onChange={onChangeInput}
                  />
                </Popover>
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
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
                  <Col lg={24}>
                    Or <Link to='/login'>login to your account!</Link>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          ) : (
            <ConfirmEmailContainer
              email={email}
              password={password}
              toLogIn={toLogIn}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  )
}
