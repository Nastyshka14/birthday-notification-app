import moment, { Moment } from 'moment'

export const momentToISOString = (item: Moment): string => {
  return moment(item.format('YYYY-MM-DD')).toISOString()
}

export const momentToFullDateFormat = (date: Moment): string => {
  return date.format('MMMM Do YYYY, h:mm:ss a')
}

export const momentToDayFormat = (date: Moment): string => {
  return date.format('YYYY-MM-DD')
}

export const dateToDayFormat = (date: Date): string => {
  return moment(date.toLocaleString()).format('YYYY-MM-DD')
}
