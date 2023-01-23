import { Moment } from 'moment'

interface INotification {
  type: string
  title: string
  identifier: { id: string }
  description?: string
  date?: Date
}

type IBirthday = INotification

interface IVacation extends INotification {
  start: Date
  end: Date
}

interface IMeeting extends INotification {
  start: Date
  end: Date
}

interface IEventsCollections {
  birthdays: Array<IBirthday>
  meetings: Array<IMeeting>
  vacations: Array<IVacation>
}

interface IDataFromServer {
  data: {
    birthdaysCollection: { items: Array<IBirthday> }
    meetingCollection: { items: Array<IMeeting> }
    vacationCollection: { items: Array<IVacation> }
  }
}

type TListEvents = Array<IBirthday> | Array<IMeeting> | Array<IVacation>
type TEvent = IBirthday | IMeeting | IVacation

interface IFilterEvents {
  (eventsList: TListEvents, cellDate: Moment): Array<INotification> | []
}

interface ICalendarCell {
  data: IDataFromServer
  cellDate: Moment
}

interface LoginProps {
  email: string
  name: string
  picture: string
}

type LoginState = {
  login?: LoginProps
  setLogin: (value: LoginProps) => void
}

export {
  INotification,
  IBirthday,
  IMeeting,
  IVacation,
  IEventsCollections,
  IDataFromServer,
  IFilterEvents,
  ICalendarCell,
  TListEvents,
  TEvent,
  LoginProps,
  LoginState,
}
