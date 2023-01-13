import React, { useEffect, useRef, useState } from 'react'
import moment, { Moment } from 'moment'

import { Button, Calendar, Col, Row, Select, notification } from 'antd'
import { EVENTS, EVENTS_OPERATIONS } from '@constants/eventVariants'
import { IDataFromServer, INotification } from '@domain/types'
import {
  createEvent,
  deleteEventByID,
  getItemById,
  isEventWithIDExist,
  updateEvent,
} from '@utils/services/http.service'
import { CalendarCellWithEvents } from '@components/CalendarCellWithEvents'
import type { DatePickerProps } from 'antd/es/date-picker'
import { ModalWindow } from '@components/core/ModalWindow'
import { NotificationTitle } from '@components/core/NotificationTitle'
import { Notifications } from '@components/Notifications'
import { defineNotificationsByTypeByDay } from '@utils/functions/defineNotificationsByTypeByDay'
import { defineReminderNotificationsByTime } from '@utils/functions/defineReminderNotificationsByTime'
import { filterNotificationsForToday } from '@utils/functions/filterNotificationsForToday'
import getData from '@utils/services/api'
import graphqlRequest from '@utils/graphql/graphqlRequest'
import 'antd/dist/antd.css'
import './CalendarPage.scss'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = (): JSX.Element => {
  const [data, setData] = useState<IDataFromServer | null>(null)
  const [type, setType] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [time, setTime] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [eventID, setEventID] = useState<string>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
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
      getData(graphqlRequest).then((data: IDataFromServer): void => {
        setData(data)
        console.log('ggg', data)
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

  useEffect(() => {
    if (data) {
      const remindersForEveryDay = defineReminderNotificationsByTime(data, moment(new Date()))
      {
        remindersForEveryDay.reminders.length > 0 &&
          notification.open({
            message: <NotificationTitle />,
            description: Notifications(remindersForEveryDay.reminders),
            duration: 0,
          })
      }

      {
        remindersForEveryDay.notificationsBeforeReminders.length > 0 &&
          notification.open({
            message: <NotificationTitle />,
            description: Notifications(remindersForEveryDay.notificationsBeforeReminders),
            duration: 0,
          })
      }
    }
  }, [data])

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
        if (type === 'birthdays') {
          setTitle(eventWithID.fields.name['en-US'])
          setDate(eventWithID.fields.date['en-US'])
        } else if (type === 'reminder') {
          setTitle(eventWithID.fields.title['en-US'])
          setTime(eventWithID.fields.time['en-US'])
          setDate(eventWithID.fields.date['en-US'])
          setDescription(eventWithID.fields.description['en-US'])
        } else {
          setTitle(eventWithID.fields.title['en-US'])
          setDescription(eventWithID.fields.description['en-US'])
          setStart(eventWithID.fields.start['en-US'])
          setEnd(eventWithID.fields.end['en-US'])
        }
      }
    })
  }

  const handleUpdateSubmit = async (): Promise<void> => {
    const isEvent = await isEventWithIDExist(eventID)
    const event =
      (type.toLocaleLowerCase() === EVENTS.birthday.toLowerCase() && {
        name: { 'en-US': title },
        date: { 'en-US': date },
      }) ||
      (type.toLocaleLowerCase() === EVENTS.reminder.toLowerCase() && {
        time: { 'en-US': time },
        title: { 'en-US': title },
        date: { 'en-US': date },
        description: { 'en-US': description },
      }) ||
      ((type.toLocaleLowerCase() === EVENTS.meeting.toLowerCase() ||
        type.toLocaleLowerCase() === EVENTS.vacation.toLowerCase()) && {
        title: { 'en-US': title },
        description: { 'en-US': description },
        start: { 'en-US': start },
        end: { 'en-US': end },
      })

    isEvent && updateEvent(eventID, event)

    const updatedBirthdays = data.data.birthdaysCollection.items.map(
      (eventItem: INotification): INotification =>
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
      (eventItem: INotification): INotification =>
        eventItem.identifier.id === eventID
          ? {
            ...eventItem,
            type: type[0].toUpperCase() + type.slice(1),
            title: title,
            start: start,
            end: end,
            description: description,
          }
          : eventItem,
    )
    const updatedMeetings = data.data.meetingCollection.items.map(
      (eventItem: INotification): INotification =>
        eventItem.identifier.id === eventID
          ? {
            ...eventItem,
            type: type[0].toUpperCase() + type.slice(1),
            title: title,
            start: start,
            end: end,
            description: description,
          }
          : eventItem,
    )
    const updatedReminders = data.data.reminderCollection.items.map(
      (eventItem: INotification): INotification =>
        eventItem.identifier.id === eventID
          ? {
            ...eventItem,
            type: type[0].toUpperCase() + type.slice(1),
            title: title,
            description: description,
            date: date,
            time: time,
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

  const handleDateInput = (value: DatePickerProps['value']) => {
    setDate(new Date(value.toDate()))
  }

  const handleStartInput = (value: DatePickerProps['value']) => {
    setStart(new Date(value.format('YYYY-MM-DD')))
  }

  const handleEndInput = (value: DatePickerProps['value']) => {
    setEnd(new Date(value.format('YYYY-MM-DD')))
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
    default:
      console.error('field isnt exist')
    }
  }

  const handleCreateEvent = async (): Promise<void> => {
    const ID = generateID() + '84okokoko374' + generateID()
    const event =
      (type.toLocaleLowerCase() === EVENTS.birthday.toLowerCase() && {
        name: { 'en-US': title },
        date: { 'en-US': date },
      }) ||
      (type.toLocaleLowerCase() === EVENTS.reminder.toLowerCase() && {
        title: { 'en-US': title },
        date: { 'en-US': date },
        time: { 'en-US': time },
        description: { 'en-US': description },
      }) ||
      ((type.toLocaleLowerCase() === EVENTS.meeting.toLowerCase() ||
        type.toLocaleLowerCase() === EVENTS.vacation.toLowerCase()) && {
        title: { 'en-US': title },
        description: { 'en-US': description },
        start: { 'en-US': start },
        end: { 'en-US': end },
      })

    createEvent(type, ID, event)

    const dataWithNewBirthday =
      type === 'birthdays'
        ? [
          {
            type: type[0].toUpperCase() + type.slice(1),
            identifier: { id: ID },
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
            type: type[0].toUpperCase() + type.slice(1),
            identifier: { id: ID },
            title: title,
            start: start,
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
            type: type[0].toUpperCase() + type.slice(1),
            identifier: { id: ID },
            title: title,
            start: start,
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
            type: type[0].toUpperCase() + type.slice(1),
            identifier: { id: ID },
            title: title,
            description: description,
            date: date,
            time: time,
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

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    operation === 'update' ? handleUpdateSubmit() : handleCreateEvent()
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setType('')
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
            <div className='calendar__buttons'>
              <Row gutter={8}>
                <Col></Col>
                <Button onClick={showModal}>Create</Button>
                <Col>
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
                <Col>
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
              </Row>
            </div>
          )
        }}
        dateCellRender={dateCellRender}
      />
      <ModalWindow
        openMod={isModalOpen}
        handleCancel={handleCancel}
        time={time}
        operation={operation}
        type={type}
        handleTypeInput={handleTypeInput}
        title={title}
        description={description}
        date={date}
        start={start}
        end={end}
        handleChange={handleDateWithTimeInput}
        handleOk={handleOk}
        handleDateInput={handleDateInput}
        handleTextInput={handleTextInput}
        handleStartInput={handleStartInput}
        handleEndInput={handleEndInput}
        handleMarkdownInput={handleMarkdownInput}
        handleTimeInput={handleTimeInput}
      />
    </div>
  )
}
