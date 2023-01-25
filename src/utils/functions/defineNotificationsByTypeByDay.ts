import moment from 'moment'

import {
  IEventsCollections,
  IFilterEvents,
  INotification,
  INotificationByTypeByDay,
} from '@domain/types'
import { dateToDayFormat, momentToDayFormat } from '@utils/functions/momentToISOString'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'

export const defineNotificationsByTypeByDay: INotificationByTypeByDay = (
  data,
  cellDate,
): IEventsCollections => {
  
  const getTimeInterval = (start: Date, end: Date): boolean => {
    return (
      moment(momentToDayFormat(cellDate)).isSameOrAfter(moment(dateToDayFormat(start))) &&
      moment(momentToDayFormat(cellDate)).isSameOrBefore(moment(dateToDayFormat(end)))
    )
  }

  const { birthdays, meetings, vacations, reminders }: IEventsCollections =
    parseCalendarCellData(data)

  const filterEventsByDay: IFilterEvents = (eventsList, cellDate) => {
    eventsList.length === 0 && []

    const eventType = eventsList[0].type

    if (eventType === 'Birthdays') {
      return eventsList.filter((birthday: INotification): boolean => {
        return (new Date(birthday.date).getDate().toString() === cellDate.format('D') && (new Date(birthday.date).getMonth() + 1).toString() === cellDate.format('M'))
      })
    }

    if (eventType === 'Vacation') {
      return eventsList.filter((vacation: INotification): boolean => {
        return getTimeInterval(vacation.start, vacation.end)
      })
    }

    if (eventType === 'Meeting') {
      return eventsList.filter((meeting: INotification): boolean => {
        return getTimeInterval(meeting.start, meeting.end)
      })
    }
    if (eventType === 'Reminder') {
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
