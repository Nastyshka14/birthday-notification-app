import { Moment } from 'moment'

import type { DatePickerProps } from 'antd/es/date-picker'


interface Notification {
  type: string;
  title: string;
  identifier: { id: string };
  description?: string;
  date?: Date;
  end?: Date;
  time?: number;
}

interface EventsCollections {
  birthdays: Array<Notification>;
  meetings: Array<Notification>;
  vacations: Array<Notification>;
  reminders: Array<Notification>;
}

interface DataFromServer {
  data: {
    birthdaysCollection: { items: Array<Notification> };
    meetingCollection: { items: Array<Notification> };
    vacationCollection: { items: Array<Notification> };
    reminderCollection: { items: Array<Notification> };
  };
}

interface FilterEvents {
  (eventsList: Array<Notification>, cellDate: Moment): Array<Notification> | [];
}

interface CalendarCell {
  data: DataFromServer;
  cellDate: Moment;
  removeEvent: (id: string) => Promise<void>;
  clickUpdate: (id: string) => void;
  showModal: () => void;
}

interface EventsDayListProps {
  collection: Array<Notification>;
  handleRemoveEvent: (id: string) => Promise<void>;
  handleUpdateEvent: (id: string) => void;
}

interface EventsListProps {
  collection: Array<Notification>;
}

interface ModalWindowProps {
  handleOk: () => void;
  openMod: boolean;
  handleCancel: () => void;
  operation: string;
  handleMarkdownInput: (value: string) => void;
  handleTypeInput: (value: string) => void;
  handleDateInput: (value: DatePickerProps['value']) => void;
  handleTimePickerInput: (value: Moment | null) => void;
  handleEndInput: (value: DatePickerProps['value']) => void;
  handleChange: (value: DatePickerProps['value']) => void;
  handleTextInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeInput: (value: string) => void;
  title: string;
  type: string;
  description: string;
  date: Date;
  timePicker: Moment | null;
  end: Date;
  time: number;
}

interface Section {
  (date: JSX.Element, duration: JSX.Element, end: JSX.Element): JSX.Element;
}

interface NotificationComponent {
  (notifications: Array<Notification>): JSX.Element;
}

interface NotificationByTypeByDay {
  (data: DataFromServer, cellDate: Moment): EventsCollections;
}

interface DefineNotificationsByTime {
  (data: DataFromServer, cellDate: Moment): {
    reminders: Notification[] | [];
    meetings: Notification[] | [];
    remindersBefore: Notification[] | [];
  };
}

interface ItemFromContentful {
  date?: { 'en-US': Date };
  title?: { 'en-US': string };
  description?: { 'en-US': string };
  end?: { 'en-US': Date };
  time?: { 'en-US': number };
}

export {
  Notification,
  EventsCollections,
  DataFromServer,
  FilterEvents,
  CalendarCell,
  EventsDayListProps,
  EventsListProps,
  ModalWindowProps,
  NotificationComponent,
  NotificationByTypeByDay,
  DefineNotificationsByTime,
  ItemFromContentful,
  Section
}
