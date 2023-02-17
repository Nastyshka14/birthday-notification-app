import React, { useState } from 'react'

import { Button, Col, Form, Input, Spin } from 'antd'
import { Auth } from 'aws-amplify'
import { Icon } from '@aws-amplify/ui-react'
import './ConfirmEmailContainer.scss'

export const ConfirmEmailContainer = ({ email, password, toLogIn, user }) => {
  const [confirmationCode, setConfirmationCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmitConfirm = async () => {
    setLoading(true)

    try {
      await Auth.confirmSignUp(email, confirmationCode)
      await Auth.signIn(email, password)
      toLogIn(user)
    } catch (e) {
      alert(e.message)
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    setConfirmationCode(event.target.value)
  }

  return (
    <Form onFinish={handleSubmitConfirm}>
      <Col md={24} lg={18}>
        <div className='full-width'>
          <h2>Check your email</h2>
          <p>We've sent a six­ digit confirmation code</p>
        </div>
        <Form.Item label='Confirmation Code'>
          <Input
            size='large'
            type='number'
            placeholder='Enter confirmation code'
            onChange={handleChange}
            value={confirmationCode}
          />
        </Form.Item>
      </Col>
      <Col md={24} lg={12}>
        <Button type='primary' disabled={loading} htmlType='submit' size='large'>
          {loading ? (
            <Spin indicator={<Icon type='loading' style={{ fontSize: 24 }} />} />
          ) : (
            'Confirm Email'
          )}
        </Button>
      </Col>
    </Form>
  )
}
