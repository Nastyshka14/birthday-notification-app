import {
  IEventsCollections,
  IFilterEvents,
  INotification,
  INotificationByTypeByDay,
} from '@domain/types'
import { dateToDayFormat, momentToDayFormat } from '@utils/functions/momentToISOString'
import { EVENTS } from '@constants/eventVariants'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'


export const defineNotificationsByTypeByDay: INotificationByTypeByDay = (data, cellDate): IEventsCollections => {

  const getTimeInterval = (start: Date, end: Date): boolean => {
    return (
      (momentToDayFormat(cellDate, true)).isSameOrAfter(
        dateToDayFormat(start, true),
      ) &&
      (momentToDayFormat(cellDate, true)).isSameOrBefore(
        dateToDayFormat(end, true),
      )
    )
  }
  const { birthdays, meetings, vacations, reminders }: IEventsCollections =
    parseCalendarCellData(data)

  const filterEventsByDay: IFilterEvents = (eventsList, cellDate) => {
    (eventsList.length === 0 && [])

    const eventType = eventsList[0].type

    if (eventType === EVENTS.birthday) {
      return eventsList.filter((birthday: INotification): boolean => {
        return dateToDayFormat(birthday.date) === momentToDayFormat(cellDate)
      })
    }

    if (eventType === EVENTS.vacation) {
      return eventsList.filter((vacation: INotification): boolean => {
        return getTimeInterval(vacation.start, vacation.end)
      })
    }

    if (eventType === EVENTS.meeting) {
      return eventsList.filter((meeting: INotification): boolean => {
        return getTimeInterval(meeting.start, meeting.end)
      })
    }
    if (eventType === EVENTS.reminder) {
      return eventsList.filter((reminder: INotification): boolean => {
        return dateToDayFormat(reminder.date) === momentToDayFormat(cellDate)
      })
    }
  }

  return {
    birthdays: filterEventsByDay(birthdays, cellDate),
    meetings: filterEventsByDay(meetings, cellDate),
    vacations: filterEventsByDay(vacations, cellDate),
    reminders: filterEventsByDay(reminders, cellDate),
  }
}
