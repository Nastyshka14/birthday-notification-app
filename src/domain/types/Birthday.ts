import { Moment } from 'moment'

export interface IBirthdayItem {
    name: string
    date: Date
  }

export interface IGetBirthdaysData {
  getListData: (value: Moment) => IBirthdayItem[];
  getBirthdays: () => Promise<void>;
}

