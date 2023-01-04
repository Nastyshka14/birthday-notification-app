
import { IDataFromServer } from '@domain/types'

export const parseCalendarCellData = (data: IDataFromServer) => {
  const { data: {
    birthdaysCollection: { items: birthdays },
    meetingCollection: { items: meetings },
    vacationCollection: { items: vacations },
    reminderCollection: {items: reminders}
  } } = data


  return { birthdays, meetings, vacations, reminders }
}
