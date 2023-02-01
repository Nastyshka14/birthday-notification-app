import React, { useState } from 'react'

import { GoogleLogout } from 'react-google-login'
import { LoginState } from '../../domain/types'
import './GoogleLogout.scss'


export const GoogleOut = ({ setLogin }: LoginState) => {

  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // const storage = () => {return JSON.parse(localStorage.getItem('login'))}
  // const emailFrom = `${storage().name} ${storage().email}`

  const sendEmail = async (e) => {
    e.preventDefault();

    const data = {
      emailTo,

      subject,
      message
    };

    const response = await fetch(
      '/api/sendemail', { method: 'POST', body: JSON.stringify(data), headers: {
        'Content-Type': 'application/json'
      } }
    );
    console.log(data)
  };

  const mailForm = () => {
  return (
    <div className="--flex-center --bg-primary --100vh">
      <div className="--width-500px --card --p --bg-light">
        <form className="--form-control" onSubmit={sendEmail}>
          <input
            type="email"
            placeholder="Email"
            required
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
          />
          <input
            type="subject"
            placeholder="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            type="message"
            placeholder="Message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="--btn --btn-primary">
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}

  const onSuccess = () => {
    localStorage.removeItem('login')
    setLogin(null)
  }

  const getName = () => {
    const lol = localStorage.getItem('login')
    return JSON.parse(lol)
  }
  return (
    <GoogleLogout
      className='google-logout'
      clientId={`${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`}
      buttonText={'Log out'}
      onLogoutSuccess={onSuccess}
      render={(renderProps) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className='google-logout__btn' onClick={renderProps.onClick}>
          Log out
        </button>
        <img src={getName().picture} alt='lol' width={'50px'} height={'50px'} />
        {mailForm()}
        </div>
      )}
    />
  )
}
