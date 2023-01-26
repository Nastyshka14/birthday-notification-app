import moment from 'moment'

import {
  EventsCollections,
  FilterEvents,
  Notification,
  NotificationByTypeByDay,
} from '@domain/types'
import { dateToDayFormat, momentToDayFormat } from '@utils/functions/momentToISOString'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'

export const defineNotificationsByTypeByDay: NotificationByTypeByDay = (
  data,
  cellDate,
): EventsCollections => {
  
  const getTimeInterval = (start: Date, end: Date): boolean => {
    return (
      moment(momentToDayFormat(cellDate)).isSameOrAfter(moment(dateToDayFormat(start))) &&
      moment(momentToDayFormat(cellDate)).isSameOrBefore(moment(dateToDayFormat(end)))
    )
  }

  const { birthdays, meetings, vacations, reminders }: EventsCollections =
    parseCalendarCellData(data)

  const filterEventsByDay: FilterEvents = (eventsList, cellDate) => {
    eventsList.length === 0 && []

    const eventType = eventsList[0].type

    if (eventType === 'Birthdays') {
      return eventsList.filter((birthday: Notification): boolean => {
        return (new Date(birthday.date).getDate().toString() === cellDate.format('D') && (new Date(birthday.date).getMonth() + 1).toString() === cellDate.format('M'))
      })
    }

    if (eventType === 'Vacation') {
      return eventsList.filter((vacation: Notification): boolean => {
        return getTimeInterval(vacation.date, vacation.end)
      })
    }

    if (eventType === 'Meeting') {
      return eventsList.filter((meeting: Notification): boolean => {
        return getTimeInterval(meeting.date, meeting.end)
      })
    }
    if (eventType === 'Reminder') {
      return eventsList.filter((reminder: Notification): boolean => {
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
