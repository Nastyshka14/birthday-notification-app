import { useState, useEffect } from 'react'
import { formatDateToFullView } from '../../../utils/functions/momentToISOString'
import { INotification, IMeeting, IVacation } from '../../../domain/types'
import { EVENTS } from '../../../constants'
import './EventRecord.scss'

export const EventRecord = ({ eventRecord }: { eventRecord: INotification }): JSX.Element => {
  const [meeting, setMeeting] = useState<IMeeting>(null)
  const [vacation, setVacation] = useState<IVacation>(null)

  useEffect(() => {
    if (eventRecord.type === EVENTS.meeting) {
      setMeeting(eventRecord as IMeeting)
    }
    if (eventRecord.type === EVENTS.vacation) {
      setVacation(eventRecord as IVacation)
    }
  }, [])

  const eventDateIntervalLayout = (eventItem: IMeeting | IVacation): JSX.Element => (
    <>
      <p className='event-record__date'>From: {`${formatDateToFullView(eventItem.start)}`} -</p>
      <p className='event-record__date'>To: {`${formatDateToFullView(eventItem.end)}`}</p>
    </>
  )

  return (
    <div className='event-record'>
      <p className='event-record__title'>Title: {eventRecord.title}</p>
      {eventRecord?.description && (
        <p className='event-record__description'>Description: {eventRecord.description}</p>
      )}
      {eventRecord?.date && (
        <p className='event-record__date'>
          Date:{eventRecord.date && formatDateToFullView(eventRecord.date)}
        </p>
      )}
      {meeting && eventDateIntervalLayout(meeting)}
      {vacation && eventDateIntervalLayout(vacation)}
    </div>
  )
}
