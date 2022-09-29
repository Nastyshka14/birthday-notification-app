
interface ITimeRange {
  start: Date
  end: Date
}

interface IDay {
  date: Date
}

interface IDaysRange {
  start: Date
  end: Date
}

interface INotification {
  type: string
  title: string
  description?: string
  date?: Date
}


interface IBirthday extends INotification {
}

interface IVacation extends INotification {
  start: Date
  end: Date
}

interface IMeeting extends INotification {
  start: Date
  end: Date
}

interface IEventsCollections {
  birthdays: Array<IBirthday>,
  meetings: Array<IMeeting>,
  vacations: Array<IVacation>
}

interface IDataFromServer {
  data: {
    birthdaysCollection: { items: Array<IBirthday> },
    meetingCollection: { items: Array<IMeeting> },
    vacationCollection: { items: Array<IVacation> },
  }
}

export { INotification, IBirthday, IMeeting, IVacation, IEventsCollections, IDataFromServer }
