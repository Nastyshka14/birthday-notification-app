import { Moment } from 'moment'

import { DefineNotificationsByTime, EventsCollections, Notification } from '@domain/types'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'

export const defineNotificationsByTime: DefineNotificationsByTime = (data, cellDate) => {
  const { reminders, meetings }: EventsCollections = parseCalendarCellData(data)

  const getParsedDate = (date: Moment | Date) => {
    return Date.parse(date.toLocaleString())
  }
  
  reminders.length === 0 && []
  meetings.length === 0 && []

  const filterEventsByTime = (collection: Notification[]): Array<Notification> | [] => {
    return collection.filter((item: Notification): boolean => {
      return (
        getParsedDate(item.date) - (getParsedDate(item.date) % 60000) ===
        getParsedDate(cellDate) - (getParsedDate(cellDate) % 60000)
      )
    })
}

  const filterEventsByTimeBefore = (): Array<Notification> | [] => {
      return reminders.filter((reminder: Notification): boolean => {
        return (
          getParsedDate(reminder.date) -
            reminder.time * 60000 -
            ((getParsedDate(reminder.date) - reminder.time * 60000) % 60000) ===
          getParsedDate(cellDate) - (getParsedDate(cellDate) % 60000)
        )
      })
  }

  return {
    reminders: filterEventsByTime(reminders),
    meetings: filterEventsByTime(meetings),
    remindersBefore: filterEventsByTimeBefore(),
  }
}
