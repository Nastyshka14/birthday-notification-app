import React, { useState, useEffect } from 'react'
import { Calendar, notification } from 'antd'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { IDataFromServer } from '../../domain/types'
import { CalendarCell } from '../CalendarCell'
import { Notification } from '../Notification'
import './CalendarPage.scss'
import 'antd/dist/antd.css'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null);

  useEffect(() => {
    const fetchEvents = getData(graphqlRequest)
      .then((data): void => {
        setData(data)
      })
  }, [])

  useEffect(() => {
    notification.open({
      message: 'Notification',
      description: Notification('some random message'),
      duration: 0,
    })
  }, [])

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return (data && <CalendarCell data={data} cellDate={dateCell} />)
  }

  return (
    <div className='calendar-wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
    </div>
  )
}
