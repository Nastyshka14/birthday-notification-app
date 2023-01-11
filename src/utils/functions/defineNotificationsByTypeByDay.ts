import { Moment } from 'moment'

import {
  IBirthday,
  IEventsCollections,
  IFilterEvents,
  IMeeting,
  INotificationByTypeByDay,
  IReminder,
  IVacation,
} from '@domain/types'
import { dateToDayFormat, momentToDayFormat } from '@utils/functions/momentToISOString'
import { EVENTS } from '@constants/eventVariants'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'


 export const defineNotificationsByTypeByDay: INotificationByTypeByDay = (data, cellDate) => {

  const getTimeInterval = (start: Date, end: Date): boolean => {
    return (
      (momentToDayFormat(cellDate, true) as Moment).isSameOrAfter(
        dateToDayFormat(start, true) as Moment,
      ) &&
      (momentToDayFormat(cellDate, true) as Moment).isSameOrBefore(
        dateToDayFormat(end, true) as Moment,
      )
    )
  }
  const { birthdays, meetings, vacations, reminders }: IEventsCollections =
    parseCalendarCellData(data)

  const filterEventsByDay: IFilterEvents = (eventsList, cellDate) => {
    (eventsList.length === 0 ? [] : null)

    const eventType = eventsList[0].type

    if (eventType === EVENTS.birthday) {
      return (eventsList as Array<IBirthday>).filter((birthday: IBirthday): boolean => {
        return dateToDayFormat(birthday.date) === momentToDayFormat(cellDate)
      })
    }

    if (eventType === EVENTS.vacation) {
      return (eventsList as Array<IVacation>).filter((vacation: IVacation): boolean => {
       return getTimeInterval(vacation.start, vacation.end)
      })
    }

    if (eventType === EVENTS.meeting) {
      return (eventsList as Array<IMeeting>).filter((meeting: IMeeting): boolean => {
        return getTimeInterval(meeting.start, meeting.end)
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
