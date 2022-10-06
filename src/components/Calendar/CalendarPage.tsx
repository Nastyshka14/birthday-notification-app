import React, { useState, useEffect, useRef } from 'react'
import { Calendar, notification } from 'antd'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { IDataFromServer, INotification } from '../../domain/types'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import {
  saveDataToStorage,
  getDataFromStorage,
  removeDataFromStorage,
} from '../../utils/functions/sessionStorageData'
import { CalendarCellWithEvents } from '../CalendarCellWithEvents'
import { Notifications } from '../Notifications'
import './CalendarPage.scss'
import 'antd/dist/antd.css'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null)
  const runsCounterRef = useRef(0)

  useEffect(() => {
    if (runsCounterRef.current === 0) {
      getData(graphqlRequest).then((data): void => {
        setData(data)
      })
    }

    runsCounterRef.current++

    return () => setData(null)
  }, [])

  useEffect(() => {
    if (data) {
      const notificationsForToday = defineNotificationsByTypeByDay(data, moment(new Date()))
      let isNotification = false
      let isNotificationsWithUpdates = false

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

        const notificationsForTodayFromStorage: Array<INotification> = JSON.parse(
          getDataFromStorage('notifications'),
        )

        if (notificationsForTodayFromStorage) {
          if (
            !isServerStorageNotificationForTodayTheSame(
              notificationsList,
              notificationsForTodayFromStorage,
            )
          ) {
            removeDataFromStorage('notifications')
            isNotificationsWithUpdates = true
          }
        } else {
          isNotificationsWithUpdates = true
        }

        if (isNotificationsWithUpdates) {
          saveDataToStorage('notifications', JSON.stringify(notificationsList))
          notification.open({
            message: 'Notifications',
            description: Notifications(JSON.stringify(notificationsList)),
            duration: 0,
          })
        }
      }
    }
  }, [data])

  const isServerStorageNotificationForTodayTheSame = (
    serverNotificationForToday: Array<INotification>,
    storageNotificationForToday: Array<INotification>,
  ): boolean => {
    if (serverNotificationForToday.length !== storageNotificationForToday.length) {
      return false
    }

    for (let i = 0; i < serverNotificationForToday.length; i++) {
      if (serverNotificationForToday[i].type !== storageNotificationForToday[i].type) {
        return false
      }

      const fieldsList = Object.keys(serverNotificationForToday[i])

      for (const field in fieldsList) {
        if (typeof serverNotificationForToday[field] !== 'object') {
          if (serverNotificationForToday[field] !== storageNotificationForToday[field]) {
            return false
          }
        }
      }
    }

    return true
  }

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return data && <CalendarCellWithEvents data={data} cellDate={dateCell} />
  }

  return (
    <div className='calendar__wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
    </div>
  )
}
