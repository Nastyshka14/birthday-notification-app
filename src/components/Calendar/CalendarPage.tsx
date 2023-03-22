import React, { useEffect, useRef, useState } from 'react'
import moment, { Moment } from 'moment'
import { useNavigate } from 'react-router-dom'

import { Button, Calendar, Col, Row, Select } from 'antd'
import { DataFromServer, LoginProps, Notification } from '@domain/types'
import { EVENTS, EVENTS_OPERATIONS } from '@constants/eventVariants'
import {
  createEvent,
  deleteEventByID,
  getItemById,
  isEventWithIDExist,
  updateEvent,
} from '@utils/services/http.service'
import { Auth } from 'aws-amplify'
import { CalendarCellWithEvents } from '@components/CalendarCellWithEvents'
import type { DatePickerProps } from 'antd/es/date-picker'
import { GoogleOut } from '@components/GoogleLogout'
import { ModalWindow } from '@components/core/ModalWindow'
import { defineNotificationsByTime } from '@utils/functions/defineNotificationsByTime'
import { defineNotificationsByTypeByDay } from '@utils/functions/defineNotificationsByTypeByDay'
import { filterNotificationsForTime } from '@utils/functions/filterNotificationsForTime'
import { filterNotificationsForToday } from '@utils/functions/filterNotificationsForToday'
import getData from '@utils/services/api'
import graphqlRequest from '@utils/graphql/graphqlRequest'
import 'antd/dist/antd.css'
import './CalendarPage.scss'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = ({ userInitials }: { userInitials: string }): JSX.Element => {
  const [data, setData] = useState<DataFromServer | null>(null)
  const [type, setType] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [time, setTime] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [end, setEnd] = useState<Date>(new Date())
  const [date, setDate] = useState<Date>(new Date())
  const [timePicker, setTimePicker] = useState<Moment | null>(null)
  const [eventID, setEventID] = useState<string>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [clock, setClock] = useState(moment(new Date()).format('MMM D YYYY, HH:mm'))
  const navigate = useNavigate()
  const operation = eventID ? EVENTS_OPERATIONS.update : EVENTS_OPERATIONS.create

  const generateID = (): string => {
    let ID: string = Math.floor(Math.random() * 100).toString()
    const findIdInBirthdays = data.data.birthdaysCollection.items.find(
      (item) => item.identifier.id === ID,
    )
    const findIdInMeetings = data.data.meetingCollection.items.find(
      (item) => item.identifier.id === ID,
    )
    const findIdInVacations = data.data.vacationCollection.items.find(
      (item) => item.identifier.id === ID,
    )
    const findIdInReminders = data.data.reminderCollection.items.find(
      (item) => item.identifier.id === ID,
    )
    if (findIdInBirthdays || findIdInMeetings || findIdInReminders || findIdInVacations) {
      return (ID = Math.floor(Math.random() * 100).toString())
    } else {
      return ID
    }
  }

  const runsCounterRef = useRef(0)
  useEffect(() => {
    if (runsCounterRef.current === 0) {
      getData(graphqlRequest).then((data: DataFromServer): void => {
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
  }, [data, clock])

  useEffect(() => {
    if (data) {
      const notificationsForTime = defineNotificationsByTime(data, moment(new Date()))

      if (notificationsForTime.reminders.length > 0) {
        filterNotificationsForTime(notificationsForTime.reminders)
      }
      if (notificationsForTime.meetings.length > 0) {
        filterNotificationsForTime(notificationsForTime.meetings)
      }
      if (notificationsForTime.remindersBefore.length > 0) {
        filterNotificationsForTime(notificationsForTime.remindersBefore)
      }
    }
  }, [data, clock])

  useEffect(() => {
    setInterval(() => {
      setClock(moment(new Date()).format('MMM D YYYY, HH:mm'))
    }, 20000)
  })

  const handleRemoveEvent = async (id: string): Promise<void> => {
    const isEvent = await isEventWithIDExist(id)
    isEvent && deleteEventByID(id)
    const filteredBirthdays = data.data.birthdaysCollection.items.filter(
      (eventItem) => eventItem.identifier.id !== id,
    )
    const filteredVacations = data.data.vacationCollection.items.filter(
      (eventItem) => eventItem.identifier.id !== id,
    )
    const filteredMeetings = data.data.meetingCollection.items.filter(
      (eventItem) => eventItem.identifier.id !== id,
    )
    const filteredReminders = data.data.reminderCollection.items.filter(
      (eventItem) => eventItem.identifier.id !== id,
    )
    setData({
      data: {
        birthdaysCollection: { items: filteredBirthdays },
        vacationCollection: { items: filteredVacations },
        meetingCollection: { items: filteredMeetings },
        reminderCollection: { items: filteredReminders },
      },
    })
  }

  const handleUpdateEvent = (id: string): void => {
    showModal()
    setEventID(id)
    getItemById(id).then((eventWithID) => {
      if (eventWithID) {
        const type = eventWithID.sys.contentType.sys.id
        setType(type)
        setTitle(eventWithID.fields.title['en-US'])
        setDate(eventWithID.fields.date['en-US'])
        if (type === EVENTS.reminder) {
          setTime(eventWithID.fields.time['en-US'])
          setDescription(eventWithID.fields.description['en-US'])
          setEmail(eventWithID.fields.email['en-US'])
        } else if (type === EVENTS.meeting || type === EVENTS.vacation) {
          setDescription(eventWithID.fields.description['en-US'])
          setEnd(eventWithID.fields.end['en-US'])
        }
      }
    })
  }

  const handleUpdateSubmit = async (): Promise<void> => {
    const isEvent = await isEventWithIDExist(eventID)
    const event =
      (type === EVENTS.birthday && {
        title: { 'en-US': title },
        date: { 'en-US': date },
      }) ||
      (type === EVENTS.reminder && {
        time: { 'en-US': time },
        email: { 'en-US': email },
        title: { 'en-US': title },
        date: { 'en-US': date },
        description: { 'en-US': description },
      }) ||
      ((type === EVENTS.meeting || type === EVENTS.vacation) && {
        title: { 'en-US': title },
        description: { 'en-US': description },
        date: { 'en-US': date },
        end: { 'en-US': end },
      })

    isEvent && updateEvent(eventID, event)

    const updatedBirthdays = data.data.birthdaysCollection.items.map(
      (eventItem: Notification): Notification =>
        eventItem.identifier.id === eventID
          ? {
              ...eventItem,
              type: type[0].toUpperCase() + type.slice(1),
              title: title,
              date: date,
            }
          : eventItem,
    )
    const updatedVacations = data.data.vacationCollection.items.map(
      (eventItem: Notification): Notification =>
        eventItem.identifier.id === eventID
          ? {
              ...eventItem,
              type: type[0].toUpperCase() + type.slice(1),
              title: title,
              date: date,
              end: end,
              description: description,
            }
          : eventItem,
    )
    const updatedMeetings = data.data.meetingCollection.items.map(
      (eventItem: Notification): Notification =>
        eventItem.identifier.id === eventID
          ? {
              ...eventItem,
              type: type[0].toUpperCase() + type.slice(1),
              title: title,
              date: date,
              end: end,
              description: description,
            }
          : eventItem,
    )
    const updatedReminders = data.data.reminderCollection.items.map(
      (eventItem: Notification): Notification =>
        eventItem.identifier.id === eventID
          ? {
              ...eventItem,
              type: type[0].toUpperCase() + type.slice(1),
              title: title,
              description: description,
              date: date,
              time: time,
              email: email,
            }
          : eventItem,
    )
    setData({
      data: {
        birthdaysCollection: { items: updatedBirthdays },
        vacationCollection: { items: updatedVacations },
        meetingCollection: { items: updatedMeetings },
        reminderCollection: { items: updatedReminders },
      },
    })
  }

  const handleTypeInput = (value: string) => {
    setType(value)
  }

  const handleMarkdownInput = (value: string) => {
    setDescription(value)
  }

  const handleDateWithTimeInput = (value: DatePickerProps['value']) => {
    setDate(new Date(value.toDate()))
  }

  const handleTimeInput = (value: string) => {
    setTime(+value)
  }

  const handleTimePickerInput = (value: Moment) => {
    setTimePicker(value)
    const newEnd = moment(date).add(value.hours(), 'hours').add(value.minutes(), 'minutes')
    setEnd(new Date(newEnd.toDate()))
  }

  const handleDateInput = (value: DatePickerProps['value']) => {
    setDate(new Date(value.toDate()))
  }

  const handleEndInput = (value: DatePickerProps['value']) => {
    setEnd(new Date(value.toDate()))
  }

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventFieldName: string = e.target.name
    const eventFieldValue: string = e.target.value

    switch (eventFieldName) {
      case 'title':
        setTitle(eventFieldValue)
        break
      case 'description':
        setDescription(eventFieldValue)
        break
      case 'email':
        setEmail(eventFieldValue)
        break
      default:
        console.error('field isnt exist')
    }
  }

  const handleCreateEvent = async (): Promise<void> => {
    const ID = generateID() + '84okokoko374' + generateID()
    const titleField = { title: { 'en-US': title } }
    const dateField = { date: { 'en-US': date } }
    const descriptionField = { description: { 'en-US': description } }
    const timeField = { time: { 'en-US': time } }
    const endField = { end: { 'en-US': end } }
    const emailField = { email: { 'en-US': email } }
    const event =
      (type === EVENTS.birthday && {
        ...titleField,
        ...dateField,
      }) ||
      (type === EVENTS.reminder && {
        ...titleField,
        ...dateField,
        ...descriptionField,
        ...timeField,
        ...emailField,
      }) ||
      (type === EVENTS.meeting && {
        ...titleField,
        ...dateField,
        ...descriptionField,
        ...endField,
      }) ||
      (type === EVENTS.vacation && {
        ...titleField,
        ...dateField,
        ...descriptionField,
        ...endField,
      })

    createEvent(type, ID, event)

    const typeField = { type: type[0].toUpperCase() + type.slice(1) }
    const idField = { identifier: { id: ID } }

    const dataWithNewBirthday =
      type === 'birthdays'
        ? [
            {
              ...typeField,
              ...idField,
              title: title,
              date: date,
            },
            ...data.data.birthdaysCollection.items,
          ]
        : [...data.data.birthdaysCollection.items]
    const dataWithNewMeeting =
      type === 'meeting'
        ? [
            {
              ...typeField,
              ...idField,
              title: title,
              date: date,
              end: end,
              description: description,
            },
            ...data.data.meetingCollection.items,
          ]
        : [...data.data.meetingCollection.items]
    const dataWithNewVacation =
      type === 'vacation'
        ? [
            {
              ...typeField,
              ...idField,
              title: title,
              date: date,
              end: end,
              description: description,
            },
            ...data.data.vacationCollection.items,
          ]
        : [...data.data.vacationCollection.items]
    const dataWithNewReminder =
      type === 'reminder'
        ? [
            {
              ...typeField,
              ...idField,
              title: title,
              description: description,
              date: date,
              time: time,
              email: email,
            },
            ...data.data.reminderCollection.items,
          ]
        : [...data.data.reminderCollection.items]
    setData({
      data: {
        birthdaysCollection: { items: dataWithNewBirthday },
        vacationCollection: { items: dataWithNewVacation },
        meetingCollection: { items: dataWithNewMeeting },
        reminderCollection: { items: dataWithNewReminder },
      },
    })
    clearInput()
  }

  const clearInput = (): void => {
    setType('')
    setTitle('')
    setEmail('')
    setTime(0)
    setDescription('')
    setDate(new Date())
    setEnd(new Date())
    setEventID(null)
    setTimePicker(null)
  }

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return (
      data && (
        <CalendarCellWithEvents
          data={data}
          cellDate={dateCell}
          removeEvent={handleRemoveEvent}
          showModal={showModal}
          clickUpdate={handleUpdateEvent}
        />
      )
    )
  }

  const showModal = (): void => {
    setIsModalOpen(true)
  }

  const handleOk = (): void => {
    operation === 'update' ? handleUpdateSubmit() : handleCreateEvent()
    setIsModalOpen(false)
  }

  const handleCancel = (): void => {
    setIsModalOpen(false)
    clearInput()
  }

  const onSuccess = (): void => {
    localStorage.removeItem('login')
    navigate('/login')
  }

  const getLogin = (): LoginProps => {
    const login = localStorage.getItem('login')
    return JSON.parse(login)
  }

  const signOut = async (): Promise<void> => {
    try {
      await Auth.signOut({ global: true })
      onSuccess()
    } catch (e) {
      alert(e.message)
    }
  }
  return (
    <div className='calendar__wrapper'>
      <Calendar
        headerRender={({ value, onChange }) => {
          const start = 0
          const end = 12
          const monthOptions = []

          let current = value.clone()
          const localeData = value.localeData()
          const months = []
          for (let i = 0; i < 12; i++) {
            current = current.month(i)
            months.push(localeData.monthsShort(current))
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className='month-item'>
                {months[i]}
              </Select.Option>,
            )
          }

          const year = value.year()
          const month = value.month()
          const options = []
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className='year-item'>
                {i}
              </Select.Option>,
            )
          }
          return (
            <div className='calendar'>
              <div className='calendar__clock'>{clock}</div>
              <div className='calendar__buttons'>
                <Row gutter={8} className='calendar__row'>
                  <Col className='calendar__col'>
                    <Button onClick={showModal}>Create new</Button>
                  </Col>
                  <Col className='calendar__col'>
                    <Select
                      size='middle'
                      dropdownMatchSelectWidth={false}
                      className='my-year-select'
                      value={year}
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear)
                        onChange(now)
                      }}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col className='calendar__col'>
                    <Select
                      size='middle'
                      dropdownMatchSelectWidth={false}
                      value={month}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth)
                        onChange(now)
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                  <Col className='calendar__col'>
                    {getLogin()?.picture ? (
                      <GoogleOut onSuccess={onSuccess} />
                    ) : (
                      <button className='google-logout__btn' onClick={signOut}>
                        Log out
                      </button>
                    )}
                  </Col>
                  <Col className='calendar__col'>
                    {getLogin().picture ? (
                      <img className='googleout__img' src={getLogin().picture} alt='Avatar' />
                    ) : (
                      <div className='calendar__user--img'>{userInitials}</div>
                    )}
                  </Col>
                </Row>
              </div>
            </div>
          )
        }}
        dateCellRender={dateCellRender}
      />
      <ModalWindow
        openMod={isModalOpen}
        handleCancel={handleCancel}
        time={time}
        timePicker={timePicker}
        operation={operation}
        type={type}
        handleTypeInput={handleTypeInput}
        title={title}
        description={description}
        date={date}
        end={end}
        handleChange={handleDateWithTimeInput}
        handleOk={handleOk}
        handleTimePickerInput={handleTimePickerInput}
        handleDateInput={handleDateInput}
        handleTextInput={handleTextInput}
        handleEndInput={handleEndInput}
        handleMarkdownInput={handleMarkdownInput}
        email={email}
        handleTimeInput={handleTimeInput}
      />
    </div>
  )
}
