import { DataFromServer } from '@domain/types'

export const parseCalendarCellData = (data: DataFromServer) => {
  const { data: {
    birthdaysCollection: { items: birthdays },
    meetingCollection: { items: meetings },
    vacationCollection: { items: vacations },
    reminderCollection: { items: reminders }
  } } = data


  return { birthdays, meetings, vacations, reminders }
}
