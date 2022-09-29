import moment, { Moment } from 'moment'
import { parseCalendarCellData } from '../../utils/functions/parseCalendarCellData'
import { dateToDayFormat, momentToDayFormat } from '../../utils/functions/momentToISOString'
import { Birthday, Meeting, Vacation } from '../events'
import {
  INotification,
  IBirthday,
  IMeeting,
  IVacation,
  IEventsCollections,
  IDataFromServer
} from '../../domain/types'

type TListEvents = Array<IBirthday> | Array<IMeeting> | Array<IVacation>

interface IFilterEvents {
  (eventsList: TListEvents, cellDate: Moment): Array<INotification>
}

interface ICalendarCell {
  data: IDataFromServer,
  cellDate: Moment,
}

export const CalendarCell = ({ data, cellDate }: ICalendarCell) => {
  const { birthdays, meetings, vacations }: IEventsCollections = parseCalendarCellData(data)

  const filterEventsByDay: IFilterEvents = (eventsList, cellDate) => {
    const eventType = eventsList[0].type

    if (eventType === 'Birthdays') {
      return (eventsList as Array<IBirthday>).filter((birthday: IBirthday): boolean => {
        return dateToDayFormat(birthday.date) === momentToDayFormat(cellDate)
      })
    }

    if (eventType === 'Vacation') {
      return (eventsList as Array<IVacation>).filter((vacation: IVacation): boolean => {
        return moment(momentToDayFormat(cellDate)).isSameOrAfter(moment(dateToDayFormat(vacation.start))) &&
          moment(momentToDayFormat(cellDate)).isSameOrBefore(moment(dateToDayFormat(vacation.end)))
      })
    }

    if (eventType === 'Meeting') {
      return (eventsList as Array<IMeeting>).filter((meeting: IMeeting): boolean => {
        return moment(momentToDayFormat(cellDate)).isSameOrAfter(moment(dateToDayFormat(meeting.start))) &&
          moment(momentToDayFormat(cellDate)).isSameOrBefore(moment(dateToDayFormat(meeting.end)))
      })
    }
  }

  return (
    <>
      <Birthday data={filterEventsByDay(birthdays, cellDate)} />
      <Meeting data={filterEventsByDay(meetings, cellDate) as Array<IMeeting>} />
      <Vacation data={filterEventsByDay(vacations, cellDate) as Array<IVacation>} />
    </>
  )
}
