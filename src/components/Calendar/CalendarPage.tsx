import React, { useState, useEffect, useRef } from 'react'
import { Calendar } from 'antd'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { IDataFromServer } from '../../domain/types'
import { EVENTS_OPERATIONS, EVENTS } from '../../constants'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { filterNotificationsForToday } from 'src/utils/functions/filterNotificationsForToday'
import { CalendarCellWithEvents } from '../CalendarCellWithEvents'
import {
  createEvent,
  isEventWithIDExist,
  updateEvent,
  getItemById,
  deleteEventByID,
} from '../../utils/services/http.service'
import 'antd/dist/antd.css'
import './CalendarPage.scss'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null)
  const eventID = Math.floor(Math.random() * 100).toString()

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
        filterNotificationsForToday(notificationsForToday)
      }
    }
  }, [data])

  const handleRemoveEvent = async (id: string): Promise<void> => {
    const isEvent = await isEventWithIDExist(id)
    const isDeleted = isEvent && deleteEventByID(id)
    const filteredBirthdays = data.data.birthdaysCollection.items.filter(
      (eventItem) => eventItem.identifier.id !== id,
    )
    const filteredVacations = data.data.vacationCollection.items.filter(
      (eventItem) => eventItem.identifier.id !== id,
    )
    const filteredMeetings = data.data.meetingCollection.items.filter(
      (eventItem) => eventItem.identifier.id !== id,
    )
    setData({
      data: {
        birthdaysCollection: { items: filteredBirthdays },
        vacationCollection: { items: filteredVacations },
        meetingCollection: { items: filteredMeetings },
      },
    })
  }
  const handleUpdateSubmit = async (id, type, title, date, description, start, end) => {
    const isEvent = await isEventWithIDExist(id)
    const event =
      type.toLocaleLowerCase() === EVENTS.birthday.toLowerCase()
        ? { name: { 'en-US': title }, date: { 'en-US': date } }
        : {
            title: { 'en-US': title },
            description: { 'en-US': description },
            start: { 'en-US': start },
            end: { 'en-US': end },
          }
          

    const updatedEvent = isEvent && updateEvent(id, event)
      const updatedBirthdays = data.data.birthdaysCollection.items.map(
        (eventItem) => eventItem.identifier.id === id ? {...eventItem, type: type[0].toUpperCase() + type.slice(1),
          title: title,
          date: date.toISOString()} : eventItem
      )
    
      const updatedVacations = data.data.vacationCollection.items.map(
        (eventItem) => eventItem.identifier.id === id ? {...eventItem, type: type[0].toUpperCase() + type.slice(1),
          title: title,
          start: start.toISOString(), end: end.toISOString(), description: description} : eventItem
      
      )
      const updatedMeetings = data.data.meetingCollection.items.map(
        (eventItem) => eventItem.identifier.id === id ? {...eventItem, type: type[0].toUpperCase() + type.slice(1),
          title: title,
          start: start.toISOString(), end: end.toISOString(), description: description} : eventItem
      )
      setData({
        data: {
          birthdaysCollection: { items: updatedBirthdays },
          vacationCollection: { items: updatedVacations },
          meetingCollection: { items: updatedMeetings },
        },
      })

    
  }
  const handleCreateEvent = async (type, title, date, description, start, end) => {
    const isEvent = await isEventWithIDExist(eventID)

    const event =
      type.toLocaleLowerCase() === EVENTS.birthday.toLowerCase()
        ? { name: { 'en-US': title }, date: { 'en-US': date } }
        : {
            title: { 'en-US': title },
            description: { 'en-US': description },
            start: { 'en-US': start },
            end: { 'en-US': end },
          }

    const createdEvent = !isEvent && createEvent(type, eventID, event)

    const dataWithNewBirthday =
      !isEvent && type === 'Birthdays'
        ? [
            ...data.data.birthdaysCollection.items,
            {
              type: type,
              identifier: { id: eventID },
              title: title,
              date: date.toISOString(),
            },
          ]
        : [...data.data.birthdaysCollection.items]

    const dataWithNewMeeting =
      !isEvent && type === 'Meeting'
        ? [
            ...data.data.meetingCollection.items,
            {
              type: type,
              identifier: { id: eventID },
              title: title,
              start: start.toISOString(),
              end: end.toISOString(),
              description: description,
            },
          ]
        : [...data.data.meetingCollection.items]

    const dataWithNewVacation =
      !isEvent && type === 'Vacation'
        ? [
            ...data.data.vacationCollection.items,
            {
              type: type,
              identifier: { id: eventID },
              title: title,
              start: start.toISOString(),
              end: end.toISOString(),
              description: description,
            },
          ]
        : [...data.data.vacationCollection.items]

    setData({
      data: {
        birthdaysCollection: { items: dataWithNewBirthday },
        vacationCollection: { items: dataWithNewVacation },
        meetingCollection: { items: dataWithNewMeeting },
      },
    })
  }

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return (
      data && (
        <CalendarCellWithEvents
          data={data}
          cellDate={dateCell}
          removeEvent={handleRemoveEvent}
          createEvent={handleCreateEvent}
          updateEvent={handleUpdateSubmit}
        />
      )
    )
  }

  return (
    <div className='calendar__wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
    </div>
  )
}
