import moment, { Moment } from 'moment'
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

interface INotificationByTypeByDay {
  (data: IDataFromServer, cellDate: Moment): IEventsCollections
}

export const defineNotificationsByTypeByDay: INotificationByTypeByDay = (data, cellDate) => {
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

  return {
    birthdays: filterEventsByDay(birthdays, cellDate) as Array<IBirthday>,
    meetings: filterEventsByDay(meetings, cellDate) as Array<IMeeting>,
    vacations: filterEventsByDay(vacations, cellDate) as Array<IVacation>,
  }
}
