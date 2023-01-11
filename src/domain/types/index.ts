import { Moment } from 'moment'

import type { DatePickerProps } from 'antd/es/date-picker'

interface INotification {
  type: string
  title: string
  identifier: { id: string }
  description?: string
  date?: Date
  start?: Date
  end?: Date
}

type IBirthday = INotification

interface IReminder extends INotification {
  time?: number
}

type IVacation = INotification

type IMeeting = INotification

interface IEventsCollections {
  birthdays: Array<IBirthday>
  meetings: Array<IMeeting>
  vacations: Array<IVacation>
  reminders: Array<IReminder>
}

interface IDataFromServer {
  data: {
    birthdaysCollection: { items: Array<IBirthday> }
    meetingCollection: { items: Array<IMeeting> }
    vacationCollection: { items: Array<IVacation> }
    reminderCollection: { items: Array<IReminder> }
  }
}

type TListEvents = Array<IBirthday> | Array<IMeeting> | Array<IVacation> | Array<IReminder>
type TEvent = IBirthday | IMeeting | IVacation | IReminder

interface IFilterEvents {
  (eventsList: TListEvents, cellDate: Moment): Array<INotification> | []
}

interface ICalendarCell {
  data: IDataFromServer
  cellDate: Moment
  removeEvent: (id: string) => Promise<void>
  clickUpdate: (id: string) => void
  showModal: () => void
}

interface IEventsDayList {
  collection: Array<IBirthday> | Array<IMeeting> | Array<IVacation> | Array<IReminder>
  handleRemoveEvent: (id: string) => Promise<void>
  handleUpdateEvent: (id: string) => void
}

interface IEventsList {
  collection: Array<INotification>
}

interface IModalWindow {
  handleOk: () => void
  openMod: boolean
  handleCancel: () => void
  operation: string
  handleMarkdownInput: (value: string) => void
  handleTypeInput: (value: string) => void
  handleDateInput: (value: DatePickerProps['value']) => void
  handleStartInput: (value: DatePickerProps['value']) => void
  handleEndInput: (value: DatePickerProps['value']) => void
  handleChange: (value: DatePickerProps['value']) => void
  handleTextInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleTimeInput: (value: string) => void
  title: string
  type: string
  description: string
  date: Date
  start: Date
  end: Date
  time: number
}

interface INotificationComponent {
  (notifications: Array<INotification>): JSX.Element
}

interface INotificationByTypeByDay {
  (data: IDataFromServer, cellDate: Moment): IEventsCollections
}

interface IDefineReminderNotifictionsByTime {
  (data: IDataFromServer, cellDate: Moment): {
    reminders: IReminder[]
    notificationsBeforeReminders: IReminder[]
  }
}

interface IItemFromContentful {
  fields: {
    name?: { 'en-US': string }
    date?: { 'en-US': Date }
    title?: { 'en-US': string }
    description?: { 'en-US': string }
    start?: { 'en-US': Date }
    end?: { 'en-US': Date }
    time?: { 'en-US': number }
  },
  sys: { contentType: { sys: { id: string } } }
}

export {
  INotification,
  IBirthday,
  IMeeting,
  IVacation,
  IReminder,
  IEventsCollections,
  IDataFromServer,
  IFilterEvents,
  ICalendarCell,
  IEventsDayList,
  IEventsList,
  TListEvents,
  IModalWindow,
  INotificationComponent,
  INotificationByTypeByDay,
  IDefineReminderNotifictionsByTime,
  IItemFromContentful,
  TEvent,
}
