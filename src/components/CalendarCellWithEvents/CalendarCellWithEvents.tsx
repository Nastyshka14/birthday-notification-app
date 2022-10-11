import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { IEventsCollections, ICalendarCell } from '../../domain/types'
import { EventsList } from '../events'

export const CalendarCellWithEvents = ({ data, cellDate }: ICalendarCell) => {
  const eventsCollections: IEventsCollections = defineNotificationsByTypeByDay(data, cellDate)
  return (
    <div className='events'>
      {Object.keys(eventsCollections).map((eventsCollection, index) => (
        <EventsList collection={eventsCollections[eventsCollection]} key={index} />
      ))}
    </div>
  )
}
