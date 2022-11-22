import React, { useEffect, useState, useRef } from 'react'
import { INotification } from '../../../domain/types'
import {
  isEventWithIDExist,
  deleteEventByID,
  updateEvent,
  getItemById,
} from '../../../utils/services/http.service'
import { EVENTS_OPERATIONS, EVENTS } from '../../../constants'
import { EventForm } from '../../calendarEventsOperations/EventForm'
import { EventsItem } from '../EventItem'
import { Button } from '../../core/Button'
import { InputText } from '../../core/InputText'
import { InputDate } from '../../core/InputDate'
import { Modal } from 'antd'
import './EventsList.scss'

export const EventsList = <T extends INotification>({collection, handleRemoveEvent}): JSX.Element => {
  /**
   *
   * TODO: replace alerts with modal window component
   */

  const [listOfEvents, setListOfEvents] = useState<Array<T>>(collection)
  const [isUpdateEventDialog, setUpdateEventDialog] = useState<boolean>(false)
  const [eventID, setEventID] = useState<string>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [type, setType] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const counterRef = useRef(0)

  useEffect(() => setListOfEvents(collection), [collection])
  
  const handleUpdateEvent = (id: string) => {
    showModal()
    setEventID(id)
    const l = getItemById(id).then((eventWithID) => {
      if (eventWithID) {
        const type = eventWithID.sys.contentType.sys.id
        setType(type)
        
        setTitle(eventWithID.fields.title['en-US'])
        console.log(title)
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

  const operation = eventID ? EVENTS_OPERATIONS.update : EVENTS_OPERATIONS.create
  const updateEventID = eventID || Math.floor(Math.random() * 100).toString()


  const handleSubmit = async () => {
    const isEvent = await isEventWithIDExist(updateEventID)
    const event =
      type.toLocaleLowerCase() === EVENTS.birthday.toLowerCase()
        ? { name: { 'en-US': title }, date: { 'en-US': date } }
        : {
            title: { 'en-US': title },
            description: { 'en-US': description },
            start: { 'en-US': start },
            end: { 'en-US': end },
          }
          

    const updatedEvent =
      isEvent && operation === EVENTS_OPERATIONS.update && updateEvent(updateEventID, event)
    const updatedListOfEvents = listOfEvents.map((eventItem) =>
      eventItem.identifier.id === updateEventID
        ? { ...eventItem, title: title, date: date.toISOString() }
        : { ...eventItem },
    )
    setListOfEvents(updatedListOfEvents)

    handleOk()
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
    <>
      <ul className='events-list'>
        {collection.map((eventItem: INotification) => (
          <React.Fragment key={eventItem.identifier.id}>
            <EventsItem eventItem={eventItem} />
            
            <Button
              type={EVENTS_OPERATIONS.delete}
              onClick={() => handleRemoveEvent(eventItem.identifier.id)}
            />
            <Button
              type={EVENTS_OPERATIONS.update}
              onClick={() => handleUpdateEvent(eventItem.identifier.id)}
            />

            <Modal title='Update' open={isModalOpen} onCancel={handleCancel}>
              {/* <EventForm ID={eventID} onOk={handleOk} collection={listOfEvents} /> */}
              <div className={`${operation}-event-form`}>
                {operation}
                {eventID}

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
                    <InputDate
                      value={start}
                      label='Date from'
                      name='start'
                      onChange={handleInput}
                    />
                    <InputDate value={end} label='Date to' name='end' onChange={handleInput} />
                  </>
                ) : (
                  <InputDate value={date} label='Date' name='date' onChange={handleInput} />
                )}
                <Button onClick={handleSubmit} />
              </div>
            </Modal>
          </React.Fragment>
        ))}
      </ul>

    </>
  )
}
