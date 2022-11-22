import React, { useEffect, useState, useRef } from 'react'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { IEventsCollections, ICalendarCell } from '../../domain/types'
import { EVENTS_OPERATIONS, EVENTS } from '../../constants'
import { EventsList } from '../calendarEventsUI'
import { EventForm } from '../calendarEventsOperations/EventForm'
import { Button } from '../core/Button'
import { Modal } from 'antd'

import {
  createEvent,
  isEventWithIDExist,
  updateEvent,
  getItemById,
  deleteEventByID,
} from '../../utils/services/http.service'
import { InputText } from '../core/InputText'
import { EventsItem } from '../calendarEventsUI/EventItem'
import { InputDate } from '../core/InputDate'
import { Select } from '../core/Select'


export const CalendarCellWithEvents = ({
  data,
  cellDate,
  removeEvent,
  createEvent,
  updateEvent,
}) => {
  const [type, setType] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [eventID, setEventID] = useState<string>(null)
  const [listOfEvents, setListOfEvents] = useState({ birthdays: [], meetings: [], vacations: [] })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const operation = eventID ? EVENTS_OPERATIONS.update : EVENTS_OPERATIONS.create

  useEffect(() => {
    const eventsCollections: IEventsCollections = defineNotificationsByTypeByDay(data, cellDate)
    setListOfEvents(eventsCollections)
  }, [data, cellDate])

  const handleSubmit = () => {
    createEvent(type, title, date, description, start, end)
    handleOk()
  }

  const handleUpdate = () => {
    updateEvent(eventID, type, title, date, description, start, end)
    handleOk()
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

  const handleEventTypeSelection = (e: Event & { target: HTMLInputElement }) => {
    setType(e.target.value)
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

  return (
    <div className='events'>
      <Button type={EVENTS_OPERATIONS.create} onClick={showModal}></Button>
      {Object.keys(listOfEvents).map((eventsCollection, index) => (
        // <EventsList
        //   collection={listOfEvents[eventsCollection]}
        //   handleRemoveEvent={handleRemoveEvent}
        //   key={index}
        // />
        <ul className='events-list' key={index}>
          {listOfEvents[eventsCollection].map((eventItem) => (
            <React.Fragment key={eventItem.identifier.id}>
              <EventsItem eventItem={eventItem} />

              <Button
                type={EVENTS_OPERATIONS.delete}
                onClick={() => removeEvent(eventItem.identifier.id)}
              />
              <Button
                type={EVENTS_OPERATIONS.update}
                onClick={() => handleUpdateEvent(eventItem.identifier.id)}
              />
            </React.Fragment>
          ))}
        </ul>
      ))}

      <Modal title='Update' open={isModalOpen} onCancel={handleCancel}>
        <div className={`${operation}-event-form`}>
          <Select
            value={type && type.toLocaleLowerCase()}
            data={Object.values(EVENTS)}
            onChange={handleEventTypeSelection}
          />

          <InputText value={title} label={'Title'} name='title' onChange={handleInput} />

          {(type && type.toLocaleLowerCase() === EVENTS.vacation.toLocaleLowerCase()) ||
          type.toLocaleLowerCase() === EVENTS.meeting.toLocaleLowerCase() ? (
            <>
              <InputText
                value={description}
                label={'Description'}
                name='description'
                onChange={handleInput}
              />
              <InputDate value={start} label='Date from' name='start' onChange={handleInput} />
              <InputDate value={end} label='Date to' name='end' onChange={handleInput} />
            </>
          ) : (
            <InputDate value={date} label='Date' name='date' onChange={handleInput} />
          )}
          <Button onClick={operation === EVENTS_OPERATIONS.create ? handleSubmit : handleUpdate} />
        </div>
      </Modal>
    </div>
  )
}
