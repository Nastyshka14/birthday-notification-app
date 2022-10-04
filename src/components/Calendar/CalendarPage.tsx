import React, { useState, useEffect, useRef } from 'react'
import { Calendar, notification } from 'antd'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { IDataFromServer, INotification, IEventsCollections } from '../../domain/types'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { CalendarCellWithEvents } from '../CalendarCellWithEvents'
import { Notifications} from '../Notifications'
import './CalendarPage.scss'
import 'antd/dist/antd.css'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null)
  const runsCounter = useRef(0)

  useEffect(() => {
    if (runsCounter.current === 0) {
      getData(graphqlRequest).then((data): void => {
        setData(data)
      })
    }

    runsCounter.current++

    return () => setData(null)
  }, [])

  useEffect(() => {
    if (data) {
      const notificationsForToday = defineNotificationsByTypeByDay(data, moment(new Date()))
      let isNotification = false

      for (const eventCollection in notificationsForToday) {
        if (notificationsForToday[eventCollection].length > 0) {
          isNotification = true
          break
        }
      }

      if (isNotification) {
        let notificationsList: Array<INotification> = []

        for (const notificationCollection in notificationsForToday) {
          notificationsList = [
            ...notificationsList,
            ...(notificationsForToday[notificationCollection] as Array<INotification>),
          ]
        }

        notification.open({
          message: 'Notifications',
          description: Notifications(JSON.stringify(notificationsList)),
          duration: 0,
        })
      }
    }
  }, [data])

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return data && <CalendarCellWithEvents data={data} cellDate={dateCell} />
  }

  return (
    <div className='calendar__wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
      {}
    </div>
  )
}
