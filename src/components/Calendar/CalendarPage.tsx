import React, { useState, useEffect, useCallback } from 'react'
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

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null);

  useEffect(() => {
    getData(graphqlRequest)
      .then((data): void => {
        setData(data)
      })
  }, [])

  useEffect(() => {
    console.log('start useEffect ', new Date().getMilliseconds())

    if (data) {
      const notificationsForToday = defineNotificationsByTypeByDay(data, moment(new Date()))
      let notificationMessage = ''
      let isNotification = false

      for (const eventCollection in notificationsForToday) {
        if (notificationsForToday[eventCollection].length > 0) {
          isNotification = true
          break
        }
      }

      if (isNotification) {
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
    }
    console.log('end useEffect ', new Date().getMilliseconds())
  }, [data])

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return (data && <CalendarCellWithEvents data={data} cellDate={dateCell} />)
  }

  return (
    <div className='calendar__wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
    </div>
  )
}
