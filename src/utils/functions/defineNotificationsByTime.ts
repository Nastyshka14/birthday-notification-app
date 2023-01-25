import { Moment } from 'moment'

import { IDefineNotificationsByTime, IEventsCollections, INotification } from '@domain/types'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'

export const defineNotificationsByTime: IDefineNotificationsByTime = (data, cellDate) => {
  const { reminders }: IEventsCollections = parseCalendarCellData(data)

  const getParsedDate = (date: Moment | Date) => {
    return Date.parse(date.toLocaleString())
  }

  reminders.length === 0 && []

  const filterEventsByTime = (): Array<INotification> | [] => {
      return reminders.filter((reminder: INotification): boolean => {
        return (
          getParsedDate(reminder.date) - (getParsedDate(reminder.date) % 60000) ===
          getParsedDate(cellDate) - (getParsedDate(cellDate) % 60000)
        )
      })
  }

  const filterEventsByTimeBefore = (): Array<INotification> | [] => {
      return reminders.filter((reminder: INotification): boolean => {
        return (
          getParsedDate(reminder.date) -
            reminder.time * 60000 -
            ((getParsedDate(reminder.date) - reminder.time * 60000) % 60000) ===
          getParsedDate(cellDate) - (getParsedDate(cellDate) % 60000)
        )
      })
  }

  return {
    reminders: filterEventsByTime(),
    remindersBefore: filterEventsByTimeBefore(),
  }
}
