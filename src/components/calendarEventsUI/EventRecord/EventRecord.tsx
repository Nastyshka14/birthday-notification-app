import { useEffect, useState } from 'react'
import moment from 'moment'

import { EVENTS } from '@constants/eventVariants'
import { INotification } from '@domain/types'
import './EventRecord.scss'

export const EventRecord = ({ eventRecord }: { eventRecord: INotification }): JSX.Element => {
  const [meeting, setMeeting] = useState<INotification>(null)
  const [vacation, setVacation] = useState<INotification>(null)
  const [reminder, setReminder] = useState<INotification>(null)

  useEffect(() => {
    if (eventRecord.type === EVENTS.meeting) {
      setMeeting(eventRecord)
    }
    if (eventRecord.type === EVENTS.vacation) {
      setVacation(eventRecord)
    }
    if (eventRecord.type === EVENTS.reminder) {
      setReminder(eventRecord)
    }
  }, [eventRecord])

  const eventDateIntervalLayout = (eventItem: INotification): JSX.Element => (
    <div className='event-record__date'>
      {moment(eventItem.start).format('MMM Do YYYY')} -
      {moment(eventItem.end).format('MMM Do YYYY')}
    </div>
  )
  const eventDateLayout = (eventItem: INotification): JSX.Element => (
    <div className='event-record__date'>
      {moment(eventItem.date).format('MMM D YYYY HH:mm')}
    </div>
  )
  const getImage = (type: string): string => {
    return `event-record__image event-record__image--${type.toLowerCase()}`
  }

  return (
    <div className='event-record'>
      <div className={getImage(eventRecord.type)} />
      <div className='event-record__details'>
        <p className='event-record__title'>{eventRecord.title}</p>
        {eventRecord?.description && (
          <p className='event-record__description'>{eventRecord.description}</p>
        )}
        {meeting && eventDateIntervalLayout(meeting)}
        {vacation && eventDateIntervalLayout(vacation)}
        {reminder && eventDateLayout(reminder)}
      </div>
    </div>
  )
}
