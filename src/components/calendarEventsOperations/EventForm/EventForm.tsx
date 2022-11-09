import { useState, useEffect, useRef } from 'react'
import {
  createEvent,
  isEventWithIDExist,
  updateEvent,
  getItemById,
} from '../../../utils/services/http.service'
import { EVENTS, EVENTS_OPERATIONS } from '../../../constants'
import { InputText } from '../../core/InputText'
import { InputDate } from '../../core/InputDate'
import { Select } from '../../core/Select'
import { Button } from '../../core/Button'

export const EventForm = ({ ID }: { ID?: string }): JSX.Element => {
  const operation = ID ? EVENTS_OPERATIONS.update : EVENTS_OPERATIONS.create
  const [type, setType] = useState<string>('')
  const eventID = ID || '6AD4Pi1mnKZHyRDhEaPl3L' // todo - generate ID

  const counterRef = useRef(0)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (counterRef.current === 0) {
      getItemById(eventID).then((eventWithID) => {
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
    }
    counterRef.current++
  }, [])

  const handleSubmit = async () => {
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

    const createdEvent =
      !isEvent && operation === EVENTS_OPERATIONS.create && createEvent(type, eventID, event)
      console.log(type, eventID, event)
    const updatedEvent =
      isEvent && operation === EVENTS_OPERATIONS.update && updateEvent(eventID, event)
      console.log(event)
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
  return (
    <div className={`${operation}-event-form`}>
      {operation}
      {ID}
      {operation === EVENTS_OPERATIONS.create && (
        <Select
          value={type && type.toLocaleLowerCase()}
          data={Object.values(EVENTS)}
          onChange={handleEventTypeSelection}
        />
      )}
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
      <Button onClick={handleSubmit} />
    </div>
  )
}