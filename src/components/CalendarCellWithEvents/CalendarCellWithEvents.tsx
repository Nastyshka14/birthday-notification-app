import { useState } from 'react'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { IEventsCollections, ICalendarCell } from '../../domain/types'
import { EVENTS_OPERATIONS } from '../../constants'
import { EventsList } from '../calendarEventsUI'
import { CreateEventForm } from '../calendarEventsOperations/CreateEventForm'
import { Button } from '../core/Button'
import { ModalWindow } from '../core/ModalWindow'

export const CalendarCellWithEvents = ({ data, cellDate }: ICalendarCell) => {
  const [isAddEvent, setAddEvent] = useState<boolean>(false)
  const eventsCollections: IEventsCollections = defineNotificationsByTypeByDay(data, cellDate)

  const handleOnClick = () => {
    setAddEvent(true)
  }

  return (
    <div className='events'>
      {Object.keys(eventsCollections).map((eventsCollection, index) => (
        <EventsList collection={eventsCollections[eventsCollection]} key={index} />
      ))}
      <Button type={EVENTS_OPERATIONS.create} onClick={handleOnClick}></Button>
      {isAddEvent && (
        <ModalWindow>
          <CreateEventForm />
        </ModalWindow>
      )}
    </div>
  )
}
