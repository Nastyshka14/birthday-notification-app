import React, { useState, useEffect, useRef } from 'react'
import { Calendar } from 'antd'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { IDataFromServer } from '../../domain/types'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { displayNotifications } from 'src/utils/functions/displayNotifications'
import { CalendarCellWithEvents } from '../CalendarCellWithEvents'
import './CalendarPage.scss'
import 'antd/dist/antd.css'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null)
  const runsCounterRef = useRef(0)

  useEffect(() => {
    if (runsCounterRef.current === 0) {
      getData(graphqlRequest).then((data: IDataFromServer): void => {
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

      for (const eventCollection in notificationsForToday) {
        if ((isNotification = notificationsForToday[eventCollection].length > 0)) {
          break
        }
      }

      if (isNotification) {
        displayNotifications(notificationsForToday)
      }
    }
  }, [data])

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return data && <CalendarCellWithEvents data={data} cellDate={dateCell} />
  }

  return (
    <div className='calendar__wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
    </div>
  )
}
