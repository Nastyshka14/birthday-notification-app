import { Moment } from 'moment'

import { IDefineNotificationsByTime, IEventsCollections, INotification } from '@domain/types'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'

export const defineNotificationsByTime: IDefineNotificationsByTime = (data, cellDate) => {
  const { reminders, meetings }: IEventsCollections = parseCalendarCellData(data)

  const getParsedDate = (date: Moment | Date) => {
    return Date.parse(date.toLocaleString())
  }

  reminders.length === 0 && []

  const filterRemindersByTime = (): Array<INotification> | [] => {
      return reminders.filter((reminder: INotification): boolean => {
        return (
          getParsedDate(reminder.date) - (getParsedDate(reminder.date) % 60000) ===
          getParsedDate(cellDate) - (getParsedDate(cellDate) % 60000)
        )
      })
  }
  meetings.length === 0 && []

  const filterMeetingsByTime = (): Array<INotification> | [] => {
      return meetings.filter((meeting: INotification): boolean => {
        return (
          getParsedDate(meeting.date) - (getParsedDate(meeting.date) % 60000) ===
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
    reminders: filterRemindersByTime(),
    meetings: filterMeetingsByTime(),
    remindersBefore: filterEventsByTimeBefore(),
  }
}
