import { Moment } from 'moment'

export interface IUseContentful {
  request: (body: { query: string }) => Promise<string>
}

export interface IBirthdayItem {
    name: string
    date: Date
  }

export interface IGetBirthdaysData {
  getListData: (value: Moment) => IBirthdayItem[];
  getBirthdays: () => Promise<void>;
}
