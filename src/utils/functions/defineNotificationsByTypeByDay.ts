import { Moment } from 'moment'
import { parseCalendarCellData } from './parseCalendarCellData'
import { dateToDayFormat, momentToDayFormat } from './momentToISOString'
import {
  IBirthday,
  IMeeting,
  IVacation,
  IEventsCollections,
  IDataFromServer,
  IFilterEvents
} from '../../domain/types'
import { EVENTS } from '../../constants'

interface INotificationByTypeByDay {
  (data: IDataFromServer, cellDate: Moment): IEventsCollections
}

export const defineNotificationsByTypeByDay: INotificationByTypeByDay = (data, cellDate) => {
  const { birthdays, meetings, vacations }: IEventsCollections = parseCalendarCellData(data)

  const filterEventsByDay: IFilterEvents = (eventsList, cellDate) => {
    const eventType = eventsList[0].type

    if (eventType === EVENTS.birthday) {
      return (eventsList as Array<IBirthday>).filter((birthday: IBirthday): boolean => {
        return dateToDayFormat(birthday.date) === momentToDayFormat(cellDate)
      })
    }

    if (eventType === EVENTS.vacation) {
      return (eventsList as Array<IVacation>).filter((vacation: IVacation): boolean => {
        return (momentToDayFormat(cellDate, true) as Moment).isSameOrAfter(dateToDayFormat(vacation.start, true) as Moment) &&
          (momentToDayFormat(cellDate, true) as Moment).isSameOrBefore(dateToDayFormat(vacation.end, true) as Moment)
      })
    }

    if (eventType === EVENTS.meeting) {
      return (eventsList as Array<IMeeting>).filter((meeting: IMeeting): boolean => {
        return (momentToDayFormat(cellDate, true) as Moment).isSameOrAfter(dateToDayFormat(meeting.start, true) as Moment) &&
          (momentToDayFormat(cellDate, true) as Moment).isSameOrBefore(dateToDayFormat(meeting.end, true) as Moment)
      })
    }
  }

  return {
    birthdays: filterEventsByDay(birthdays, cellDate) as Array<IBirthday>,
    meetings: filterEventsByDay(meetings, cellDate) as Array<IMeeting>,
    vacations: filterEventsByDay(vacations, cellDate) as Array<IVacation>,
  }
}
