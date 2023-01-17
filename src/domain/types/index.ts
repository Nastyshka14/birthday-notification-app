import { Moment } from 'moment'

import type { DatePickerProps } from 'antd/es/date-picker'

interface INotification {
  type: string;
  title: string;
  identifier: { id: string };
  description?: string;
  date?: Date;
  start?: Date;
  end?: Date;
  time?: number;
}

interface IEventsCollections {
  birthdays: Array<INotification>;
  meetings: Array<INotification>;
  vacations: Array<INotification>;
  reminders: Array<INotification>;
}

interface IDataFromServer {
  data: {
    birthdaysCollection: { items: Array<INotification> };
    meetingCollection: { items: Array<INotification> };
    vacationCollection: { items: Array<INotification> };
    reminderCollection: { items: Array<INotification> };
  };
}

interface IFilterEvents {
  (eventsList: Array<INotification>, cellDate: Moment): Array<INotification> | [];
}

interface ICalendarCell {
  data: IDataFromServer;
  cellDate: Moment;
  removeEvent: (id: string) => Promise<void>;
  clickUpdate: (id: string) => void;
  showModal: () => void;
}

interface IEventsDayList {
  collection: Array<INotification>;
  handleRemoveEvent: (id: string) => Promise<void>;
  handleUpdateEvent: (id: string) => void;
}

interface IEventsList {
  collection: Array<INotification>;
}

interface IModalWindow {
  handleOk: () => void;
  openMod: boolean;
  handleCancel: () => void;
  operation: string;
  handleMarkdownInput: (value: string) => void;
  handleTypeInput: (value: string) => void;
  handleDateInput: (value: DatePickerProps['value']) => void;
  handleStartInput: (value: DatePickerProps['value']) => void;
  handleEndInput: (value: DatePickerProps['value']) => void;
  handleChange: (value: DatePickerProps['value']) => void;
  handleTextInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeInput: (value: string) => void;
  title: string;
  type: string;
  description: string;
  date: Date;
  start: Date;
  end: Date;
  time: number;
}

interface INotificationComponent {
  (notifications: Array<INotification>): JSX.Element;
}

interface INotificationByTypeByDay {
  (data: IDataFromServer, cellDate: Moment): IEventsCollections;
}

interface IDefineReminderNotifictionsByTime {
  (data: IDataFromServer, cellDate: Moment): {
    reminders: INotification[];
    notificationsBeforeReminders: INotification[];
  };
}

interface IItemFromContentful {
  name?: { 'en-US': string };
  date?: { 'en-US': Date };
  title?: { 'en-US': string };
  description?: { 'en-US': string };
  start?: { 'en-US': Date };
  end?: { 'en-US': Date };
  time?: { 'en-US': number };
}

export {
  INotification,
  IEventsCollections,
  IDataFromServer,
  IFilterEvents,
  ICalendarCell,
  IEventsDayList,
  IEventsList,
  IModalWindow,
  INotificationComponent,
  INotificationByTypeByDay,
  IDefineReminderNotifictionsByTime,
  IItemFromContentful,
}
