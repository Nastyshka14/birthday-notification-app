import { useState, useEffect } from 'react'
import { INotification, IMeeting, IVacation, IReminder } from '@domain/types'
import { EVENTS } from '@constants/eventVariants'
import moment from 'moment'
import './EventRecord.scss'

export const EventRecord = ({ eventRecord }: { eventRecord: INotification }): JSX.Element => {
  const [meeting, setMeeting] = useState<IMeeting>(null)
  const [vacation, setVacation] = useState<IVacation>(null)
  const [reminder, setReminder] = useState<IReminder>(null)

  useEffect(() => {
    if (eventRecord.type === EVENTS.meeting) {
      setMeeting(eventRecord as IMeeting)
    }
    if (eventRecord.type === EVENTS.vacation) {
      setVacation(eventRecord as IVacation)
    }
    if (eventRecord.type === EVENTS.reminder) {
      setReminder(eventRecord as IReminder)
    }
  }, [])

  const eventDateIntervalLayout = (eventItem: IMeeting | IVacation): JSX.Element => (
    <div className='event-record__date'>
      {`${moment(eventItem.start).format('MMM Do YYYY')}`} -{' '}
      {`${moment(eventItem.end).format('MMM Do YYYY')}`}
    </div>
  )
  const eventDateLayout = (eventItem: IReminder): JSX.Element => (
    <div className='event-record__date'>
      {`${moment(eventItem.date).format('MMM D YYYY HH:mm')}`}
    </div>
  )
  const getImage = (type: string): string => {
    return `event-record__image event-record__image--${type.toLowerCase()}`
  }

  return (
    <div className='event-record'>
      <div className={getImage(eventRecord.type)}></div>
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
