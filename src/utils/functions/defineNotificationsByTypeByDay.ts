import { parseCalendarCellData } from './parseCalendarCellData'
import { EVENTS } from '../../constants'
import { dateToDayFormat, momentToDayFormat } from './momentToISOString'
import { Moment } from 'moment'
import {
  IBirthday,
  IMeeting,
  IVacation,
  IEventsCollections,
  IFilterEvents,
  IReminder,
  INotificationByTypeByDay,
} from '../../domain/types'

export const defineNotificationsByTypeByDay: INotificationByTypeByDay = (data, cellDate) => {
  const { birthdays, meetings, vacations, reminders }: IEventsCollections =
    parseCalendarCellData(data)

  const filterEventsByDay: IFilterEvents = (eventsList, cellDate) => {
    if (eventsList.length === 0) return []

    const eventType = eventsList[0].type

    if (eventType === EVENTS.birthday) {
      return (eventsList as Array<IBirthday>).filter((birthday: IBirthday): boolean => {
        return dateToDayFormat(birthday.date) === momentToDayFormat(cellDate)
      })
    }

    if (eventType === EVENTS.vacation) {
      return (eventsList as Array<IVacation>).filter((vacation: IVacation): boolean => {
        return (
          (momentToDayFormat(cellDate, true) as Moment).isSameOrAfter(
            dateToDayFormat(vacation.start, true) as Moment,
          ) &&
          (momentToDayFormat(cellDate, true) as Moment).isSameOrBefore(
            dateToDayFormat(vacation.end, true) as Moment,
          )
        )
      })
    }

    if (eventType === EVENTS.meeting) {
      return (eventsList as Array<IMeeting>).filter((meeting: IMeeting): boolean => {
        return (
          (momentToDayFormat(cellDate, true) as Moment).isSameOrAfter(
            dateToDayFormat(meeting.start, true) as Moment,
          ) &&
          (momentToDayFormat(cellDate, true) as Moment).isSameOrBefore(
            dateToDayFormat(meeting.end, true) as Moment,
          )
        )
      })
    }
    if (eventType === EVENTS.reminder) {
      return (eventsList as Array<IReminder>).filter((reminder: IReminder): boolean => {
        return dateToDayFormat(reminder.date) === momentToDayFormat(cellDate)
      })
    }
  }

  return {
    birthdays: filterEventsByDay(birthdays, cellDate) as Array<IBirthday>,
    meetings: filterEventsByDay(meetings, cellDate) as Array<IMeeting>,
    vacations: filterEventsByDay(vacations, cellDate) as Array<IVacation>,
    reminders: filterEventsByDay(reminders, cellDate) as Array<IReminder>,
  }
}
