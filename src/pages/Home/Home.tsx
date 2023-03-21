import React from 'react'

import { CalendarPage } from '@components/Calendar'
import { LoginState } from '@domain/types'
import { Signup } from '../Signup/Signup'
import './Home.scss'


export const Home = ({ login, setLogin }: LoginState): JSX.Element => {
  const userInitials =
    !login.picture && `${login?.lastName.toUpperCase()[0]}${login?.name.toUpperCase()[0]}`
  const authentication = !login ? (
    <div>
      <Signup setLogin={setLogin} />
    </div>
  ) : (
    <div>
      <CalendarPage userInitials={userInitials} />
    </div>
  )

  return (
    <div className='home'>
      <div>{authentication}</div>
    </div>
  )
}
