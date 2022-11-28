import React, { useState, useEffect, useRef } from 'react'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { IDataFromServer } from '../../domain/types'
import { EVENTS_OPERATIONS, EVENTS } from '../../constants'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { filterNotificationsForToday } from 'src/utils/functions/filterNotificationsForToday'
import { CalendarCellWithEvents } from '../CalendarCellWithEvents'
import { ModalWindow } from '../core/ModalWindow'
import {
  createEvent,
  isEventWithIDExist,
  updateEvent,
  getItemById,
  deleteEventByID,
} from '../../utils/services/http.service'
import 'antd/dist/antd.css'
import './CalendarPage.scss'
import { Calendar, Col, Row, Select, Button } from 'antd'
import type { Dayjs } from 'dayjs'
import type { CalendarMode } from 'antd/es/calendar/generateCalendar'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null)
  const [type, setType] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [eventID, setEventID] = useState<string>(null)
  const operation = eventID ? EVENTS_OPERATIONS.update : EVENTS_OPERATIONS.create

  const generateID = async (): Promise<string> => {
    let ID
    do {
      ID = Math.floor(Math.random() * 100).toString()
    } while (await isEventWithIDExist(ID))
    return ID
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }

  const runsCounterRef = useRef(0)
  useEffect(() => {
    if (runsCounterRef.current === 0) {
      getData(graphqlRequest).then((data: IDataFromServer): void => {
        setData(data)
      })
      console.log(data)
    }
    runsCounterRef.current++
    return () => setData(null)
  }, [])

  useEffect(() => {
    if (data) {
      const notificationsForToday = defineNotificationsByTypeByDay(data, moment(new Date()))
      console.log(data)
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

  const handleUpdateEvent = (id: string) => {
    showModal()
    setEventID(id)
    getItemById(id).then((eventWithID) => {
      if (eventWithID) {
        const type = eventWithID.sys.contentType.sys.id
        setType(type)
        setTitle(eventWithID.fields.title['en-US'])
        if (type === EVENTS.birthday) {
          setDate(eventWithID.fields.date['en-US'])
        } else {
          setDescription(eventWithID.fields.description['en-US'])
          setStart(eventWithID.fields.start['en-US'])
          setEnd(eventWithID.fields.end['en-US'])
        }
      }
    })
    alert('display update event form')
  }

  const handleUpdateSubmit = async () => {
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

    const updatedEvent = isEvent && updateEvent(eventID, event)
    const updatedBirthdays = data.data.birthdaysCollection.items.map((eventItem) =>
      eventItem.identifier.id === eventID
        ? { ...eventItem, type: type[0].toUpperCase() + type.slice(1), title: title, date: date }
        : eventItem,
    )

    const updatedVacations = data.data.vacationCollection.items.map((eventItem) =>
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
    const updatedMeetings = data.data.meetingCollection.items.map((eventItem) =>
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
    setData({
      data: {
        birthdaysCollection: { items: updatedBirthdays },
        vacationCollection: { items: updatedVacations },
        meetingCollection: { items: updatedMeetings },
      },
    })
    handleOk()
  }

  const handleEventTypeSelection = (e: Event & { target: HTMLInputElement }) => {
    setType(e.target.value)
  }

  const handleInput = (e: Event & { target: HTMLInputElement }): void => {
    const eventFieldName: string = e.target.name
    const eventFieldValue: string = e.target.value

    switch (eventFieldName) {
      case 'title':
        setTitle(eventFieldValue)
        break
      case 'description':
        setDescription(eventFieldValue)
        break
      case 'start':
        setStart(new Date(eventFieldValue))
        break
      case 'end':
        setEnd(new Date(eventFieldValue))
        break
      case 'date':
        setDate(new Date(eventFieldValue))
        break
      default:
        console.error('field isnt exist')
    }
  }

  const handleCreateEvent = async () => {
    const ID = await generateID()
    const event =
      type.toLocaleLowerCase() === EVENTS.birthday.toLowerCase()
        ? { name: { 'en-US': title }, date: { 'en-US': date.toISOString() } }
        : {
            title: { 'en-US': title },
            description: { 'en-US': description },
            start: { 'en-US': start.toISOString() },
            end: { 'en-US': end.toISOString() },
          }
    const createdEvent = createEvent(type, ID, event)
    const dataWithNewBirthday =
      type === 'Birthdays'
        ? [
            {
              type: type,
              identifier: { id: ID },
              title: title,
              date: date,
            },
            ...data.data.birthdaysCollection.items,
          ]
        : [...data.data.birthdaysCollection.items]

    const dataWithNewMeeting =
      type === 'Meeting'
        ? [
            {
              type: type,
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
      type === 'Vacation'
        ? [
            {
              type: type,
              identifier: { id: ID },
              title: title,
              start: start,
              end: end,
              description: description,
            },
            ...data.data.vacationCollection.items,
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
          // createEvent={handleCreateEvent}
          clickUpdate={handleUpdateEvent}
          // updateEvent={handleUpdateSubmit}

        />
      )
    )
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleSubmit = () => {
    handleCreateEvent()
    handleOk()
  }

  return (
    <div className='calendar__wrapper' style={{ display: 'flex' }}>
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
            <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end' }}>
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
        className='calendar'
      />
      <ModalWindow
        openMod={isModalOpen}
        handleCancel={handleCancel}
        operation={operation}
        type={type}
        handleEventTypeSelection={handleEventTypeSelection}
        title={title}
        description={description}
        date={date}
        start={start}
        end={end}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
        handleUpdate={handleUpdateSubmit}
      />
    </div>
  )
}
