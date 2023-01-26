import moment, { Moment } from 'moment'

export const momentToISOString = (item: Moment): string => {
  return moment(item.format('YYYY-MM-DD')).toISOString()
}

export const momentToFullDateFormat = (date: Moment): string => {
  return date.format('MMMM Do YYYY, h:mm:ss a')
}

export const momentToDayFormat = (date: Moment, isLikeMoment = false): Moment | string => {
  return isLikeMoment ? moment(date.format('YYYY-MM-DD')) : date.format('YYYY-MM-DD')
}

export const dateToDayFormat = (date: Date, isLikeMoment = false): Moment | string => {
  return isLikeMoment
    ? moment(moment(date.toLocaleString()).format('YYYY-MM-DD'))
    : moment(date.toLocaleString()).format('YYYY-MM-DD')
}

export const formatDateToFullView = (date: Date): string => {
  return moment(date).format('MMMM Do YYYY, h:mm')
}
