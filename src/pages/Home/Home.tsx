import React from 'react'

import { CalendarPage } from '@components/Calendar'
import { LoginState } from '@domain/types'
import './Home.scss'

export const Home = ({ login }: LoginState): JSX.Element => {
  const userInitials = () => {
    return !login?.picture
      ? `${login?.lastName.toUpperCase()[0]}${login?.name.toUpperCase()[0]}`
      : ''
  }
  return (
    <div>
      <CalendarPage userInitials={userInitials()} />
    </div>
  )
}
