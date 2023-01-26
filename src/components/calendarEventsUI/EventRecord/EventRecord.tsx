import { useEffect, useState } from 'react'
import moment from 'moment'

import { Notification } from '@domain/types'
import './EventRecord.scss'

export const EventRecord = ({ eventRecord }: { eventRecord: Notification }): JSX.Element => {
  const [meeting, setMeeting] = useState<Notification>(null)
  const [vacation, setVacation] = useState<Notification>(null)
  const [reminder, setReminder] = useState<Notification>(null)
  const [birthdays, setBirthdays] = useState<Notification>(null)

  useEffect(() => {
    if (eventRecord.type === 'Meeting') {
      setMeeting(eventRecord)
    }
    if (eventRecord.type === 'Vacation') {
      setVacation(eventRecord)
    }
    if (eventRecord.type === 'Reminder') {
      setReminder(eventRecord)
    }
    if (eventRecord.type === 'Birthdays') {
      setBirthdays(eventRecord)
    }
  }, [eventRecord])

  const eventVacationDateLayout = (eventItem: Notification): JSX.Element => (
    <div className='event-record__date'>
      {moment(eventItem.date).format('MMM Do YYYY')} - {moment(eventItem.end).format('MMM Do YYYY')}
    </div>
  )
  const eventMeetingDateLayout = (eventItem: Notification): JSX.Element => (
    <div className='event-record__date'>
      {moment(eventItem.date).format('MMM D YYYY HH:mm')} - {moment(eventItem.end).format('MMM D YYYY HH:mm')}
    </div>
  )
  const eventReminderDateLayout = (eventItem: Notification): JSX.Element => (
    <div className='event-record__date'>{moment(eventItem.date).format('MMM D YYYY HH:mm')}</div>
  )
  const eventBirthdayDateLayout = (eventItem: Notification): JSX.Element => (
    <div className='event-record__date'>{moment(eventItem.date).format('MMM D YYYY')}</div>
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
        {meeting && eventMeetingDateLayout(meeting)}
        {vacation && eventVacationDateLayout(vacation)}
        {reminder && eventReminderDateLayout(reminder)}
        {birthdays && eventBirthdayDateLayout(birthdays)}
      </div>
    </div>
  )
}
