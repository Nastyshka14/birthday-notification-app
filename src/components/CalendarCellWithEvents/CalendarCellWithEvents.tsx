import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { Birthday, Meeting, Vacation } from '../events'
import {
  IBirthday,
  IMeeting,
  IVacation,
  IEventsCollections,
  ICalendarCell,
} from '../../domain/types'
import './CalendarCellWithEvents.scss'

export const CalendarCellWithEvents = ({ data, cellDate }: ICalendarCell) => {
  const { birthdays, meetings, vacations }: IEventsCollections = defineNotificationsByTypeByDay(
    data,
    cellDate,
  )

  return (
    <div className='calendar-events'>
      <Birthday data={birthdays as Array<IBirthday>} />
      <Meeting data={meetings as Array<IMeeting>} />
      <Vacation data={vacations as Array<IVacation>} />
    </div>
  )
}
