import React, { useState, useEffect } from 'react'
import { Calendar, notification } from 'antd'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { INotification, IDataFromServer } from '../../domain/types'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { CalendarCellWithEvents } from '../CalendarCellWithEvents'
import { Notification } from '../Notification'
import './CalendarPage.scss'
import 'antd/dist/antd.css'
import useItems from 'antd/lib/menu/hooks/useItems'

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
    if (data) {
      const notificationsForToday = defineNotificationsByTypeByDay(data, moment(new Date()))

      let notificationMessage = ''
      for (const eventCollection in notificationsForToday) {
        notificationMessage += notificationsForToday[eventCollection]
          .map((eventItem: INotification) => eventItem.title)
          .join('\r\n')
      }

      notification.open({
        message: 'Notification',
        description: Notification(notificationMessage),
        duration: 0,
      })
    }
  }, [data])

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return (data && <CalendarCellWithEvents data={data} cellDate={dateCell} />)
  }

  return (
    <div className='calendar-wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
    </div>
  )
}
