import { Moment } from 'moment'

import { IDefineReminderNotifictionsByTime, IEventsCollections, IFilterEvents, INotification } from '@domain/types'
import { EVENTS } from '@constants/eventVariants'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'

export const defineReminderNotificationsByTime: IDefineReminderNotifictionsByTime = (
  data,
  cellDate,
) => {
  const { reminders }: IEventsCollections = parseCalendarCellData(data)

  const getParsedDate = (date: Moment | Date) => {
    return Date.parse(date.toLocaleString())
  }

  const filterRemindersByDate: IFilterEvents = (eventsList, cellDate) => {
    eventsList.length === 0 && []

    const eventType = eventsList[0].type

    if (eventType === EVENTS.reminder) {
      return eventsList.filter((reminder: INotification): boolean => {
        return (
          getParsedDate(reminder.date) - (getParsedDate(reminder.date) % 60000) ===
          getParsedDate(cellDate) - (getParsedDate(cellDate) % 60000)
        )
      })
    }
  }
  const filterRemindersByNotifies: IFilterEvents = (
    eventsList,
    cellDate,
  ) => {
    eventsList.length === 0 && []

    const eventType = eventsList[0].type

    if (eventType === EVENTS.reminder) {
      return eventsList.filter((reminder: INotification): boolean => {
        return (
          (getParsedDate(reminder.date) -
            reminder.time * 60000 -
            (getParsedDate(reminder.date) % 10000)) ===
          (getParsedDate(cellDate) - (getParsedDate(cellDate) % 10000))
        )
      })
    }
  }

  return {
    reminders: filterRemindersByDate(reminders, cellDate),
    notificationsBeforeReminders: filterRemindersByNotifies(reminders, cellDate),
  }
}
