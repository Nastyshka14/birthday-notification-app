import { Moment } from 'moment'

import { IDefineReminderNotifictionsByTime, IEventsCollections, IReminder } from '@domain/types'
import { EVENTS } from '@constants/eventVariants'
import { parseCalendarCellData } from '@utils/functions/parseCalendarCellData'

export const defineReminderNotificationsByTime: IDefineReminderNotifictionsByTime = (data, cellDate) => {
  const { reminders }: IEventsCollections = parseCalendarCellData(data)

  const filterRemindersByDate = (eventsList: Array<IReminder>, cellDate: Moment): IReminder[] => {
    if (eventsList.length === 0) return []

    const eventType = eventsList[0].type

    if (eventType === EVENTS.reminder) {
      return (eventsList as Array<IReminder>).filter((reminder: IReminder): boolean => {
        return (
          Date.parse(reminder.date.toLocaleString()) -
            (Date.parse(reminder.date.toLocaleString()) % 60000) ===
          Date.parse(cellDate.toLocaleString()) - (Date.parse(cellDate.toLocaleString()) % 60000)
        )
      })
    }
  }
  const filterRemindersByNotifies = (eventsList: Array<IReminder>, cellDate: Moment): IReminder[] => {
    if (eventsList.length === 0) return []

    const eventType = eventsList[0].type

    if (eventType === EVENTS.reminder) {
      return (eventsList as Array<IReminder>).filter((reminder: IReminder): boolean => {
        return (
          Date.parse(reminder.date.toLocaleString()) -
            reminder.time * 60000 -
            (Date.parse(reminder.date.toLocaleString()) % 10000) ===
          Date.parse(cellDate.toLocaleString()) - (Date.parse(cellDate.toLocaleString()) % 10000)
        )
      })
    }
  }

  return {
    reminders: filterRemindersByDate(reminders, cellDate) as Array<IReminder>,
    notificationsBeforeReminders: filterRemindersByNotifies(reminders, cellDate),
  }
}
