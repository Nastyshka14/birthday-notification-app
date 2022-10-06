import { useEffect, useState, useCallback } from 'react'
import { useContentful } from '../../hooks/useContentful'
import { GET_BIRTHDAYS } from '../../constants/graphQL'
import { IBirthdayItem, IGetBirthdaysData } from '../../domain/types/Birthday'
import { Notification } from '../../components/Notification/Notification'
import moment, { Moment } from 'moment'
import '../../components/Calendar/CalendarPage.scss'
import 'antd/dist/antd.css'

export const getBirthdaysData = (): IGetBirthdaysData => {
  const [birthdays, setBirthdays] = useState<IBirthdayItem[]>([])
  const { request } = useContentful()
  const { openNotification } = Notification()
  const newBirthdaysList: IBirthdayItem[] = []

  const getBirthdays = useCallback(async (): Promise<void> => {
    const fetchBirthdays = await request({ query: GET_BIRTHDAYS })
    const fetchBirthdaysFormat = JSON.parse(fetchBirthdays).data.birthdaysCollection.items.map(
      (item: { name: string; date: Date }) => ({
        ...item,
        date: valueToString(item.date),
      }),
    )
    setBirthdays(fetchBirthdaysFormat)
  }, [])

  useEffect(() => {
    getBirthdays()
  }, [])

  const valueToString = (item: Moment | Date): string => {
    return moment(item).format('YYYY-MM-DD').toString()
  }

  const getListData = (value: Moment): IBirthdayItem[] => {
    const listData: IBirthdayItem[] = []
    birthdays.forEach((element: IBirthdayItem) => {
      if (valueToString(element.date) === valueToString(value)) {
        listData.push(element)
      }
    })
    return listData || []
  }

  const pushItem = useCallback(
    (itemName: string, itemDate: Date) => {
      newBirthdaysList.push({ name: itemName, date: itemDate })
      openNotification(itemName)
      localStorage.setItem('todayBirthdaysList', JSON.stringify(newBirthdaysList))
    },
    [newBirthdaysList, openNotification],
  )

  const getReminder = useCallback(() => {
    const todayBirthdaysList = JSON.parse(localStorage.getItem('todayBirthdaysList'))
    birthdays.forEach((item: IBirthdayItem) => {
      if (valueToString(item.date) === valueToString(moment())) {
        if (todayBirthdaysList !== null) {
          if (
            todayBirthdaysList.find((element: IBirthdayItem) => {
              return element.name !== item.name && element.date !== item.date
            })
          ) {
            JSON.parse(localStorage.getItem('todayBirthdaysList'))
            pushItem(item.name, item.date)
          }
        } else {
          pushItem(item.name, item.date)
        }
      }
    })
  }, [birthdays, newBirthdaysList, pushItem])

  useEffect(() => {
    getReminder()
  }, [getReminder])

  return { getListData, getBirthdays }
}
