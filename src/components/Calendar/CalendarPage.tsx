import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Calendar, notification, message } from 'antd'
import { useContentful } from 'src/hooks/useContentful'
import { GET_BIRTHDAYS } from '../../constants/graphQL'
import moment, { Moment } from 'moment'
import './CalendarPage.scss'
import 'antd/dist/antd.css'

moment.updateLocale('en', { week: { dow: 1 } })

interface BirthdayItem {
  name: string
  date: Date
}

export const CalendarPage = () => {
  const [birthdays, setBirthdays] = useState<{ name: string; date: Date }[]>([])
  const { request } = useContentful()
  const newBirthdaysList: BirthdayItem[] = []

  function shareOnFacebook() {
    const navUrl = `https://www.facebook.com/sharer/sharer.php?u=https://itra-course-work.herokuapp.com/?kcscmksnkc `
    window.open(navUrl, '_blank')
  }

  function shareOnVK(item: string) {
    const navUrl = `http://vk.com/share.php?url=${window.location.href}&title=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnTelegram(item: string) {
    const navUrl = `https://t.me/share/url?url=${
      window.location.href
    }&text=Today is ${encodeURIComponent(item)}`
    window.open(navUrl, '_blank')
  }

  function shareOnViber(item: string) {
    const navUrl = `viber://forward?text=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnWhatsApp(item: string) {
    const navUrl = `whatsapp://send?text=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnEmail(item: string) {
    const navUrl = `mailto:?subject=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  function shareOnSMS(item: string) {
    const navUrl = `sms:?body=Today is ${item}`
    window.open(navUrl, '_blank')
  }

  const getNotificationBody = useCallback((item: string): JSX.Element => {
    return (
      <div className='notification'>
        <div className='notification__message'>Today is {item}</div>
        <div className='notification__buttons'>
          <button className='notification__btn__share'>Share</button>
          <div className='notification__sprites'>
            <button
              data-tooltip='facebook'
              className='notification__btn notification__btn__facebook'
              onClick={shareOnFacebook}
            ></button>
            <button
              data-tooltip='vk'
              className='notification__btn notification__btn__vk'
              onClick={() => shareOnVK(item)}
            ></button>
            <button
              data-tooltip='sms'
              className='notification__btn notification__btn__sms'
              onClick={() => shareOnSMS(item)}
            />
            <button
              data-tooltip='email'
              className='notification__btn notification__btn__email'
              onClick={() => shareOnEmail(item)}
            />
            <button
              data-tooltip='telegram'
              className='notification__btn notification__btn__telegram'
              onClick={() => shareOnTelegram(item)}
            />
            <button
              data-tooltip='viber'
              className='notification__btn notification__btn__viber'
              onClick={() => shareOnViber(item)}
            />
            <button
              data-tooltip='whatsapp'
              className='notification__btn notification__btn__whatsapp'
              onClick={() => shareOnWhatsApp(item)}
            />
          </div>
        </div>
      </div>
    )
  }, [])

  const openNotification = useCallback(
    (item: string) => {
      const args = {
        message: 'Notification',
        description: getNotificationBody(item),
        duration: 0,
      }
      notification.open(args)
    },
    [getNotificationBody],
  )

  const showMessage = (msg: string) => {
    message.error(msg)
  }

  const getBirthdays = useCallback(async () => {
    try {
      const fetchBirthdays = await request({ query: GET_BIRTHDAYS })
      const fetchBirthdaysFormat = JSON.parse(fetchBirthdays).data.birthdaysCollection.items.map(
        (item: { name: string; date: string }) => ({
          ...item,
          date: new Date(item.date).toISOString(),
        }),
      )
      return setBirthdays(fetchBirthdaysFormat)
    } catch (error) {
      showMessage(error.message)
    }
  }, [request])

  useEffect(() => {
    getBirthdays()
  }, [])

  const valueToISOString = (item: Moment) => {
    return moment(item.format('YYYY-MM-DD')).toISOString()
  }

  const getListData = (value: Moment): BirthdayItem[] => {
    const listData: BirthdayItem[] = []
    birthdays.forEach((element: BirthdayItem) => {
      console.log(valueToISOString(value))
      if (element.date.toString() === valueToISOString(value)) {
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
    birthdays.forEach((item: BirthdayItem) => {
      if (item.date.toString() === valueToISOString(moment())) {
        if (todayBirthdaysList !== null) {
          if (
            todayBirthdaysList.find((element: { name: string; date: Date }) => {
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

  const dateCellRender = (value: Moment): JSX.Element => {
    const listData: BirthdayItem[] = getListData(value)
    return (
      <ul className='events'>
        {listData.length
          ? listData.map((item: BirthdayItem) => (
              <li key={item.name}>
                <p>{item.name}</p>
                <div className='nav__icon'></div>
              </li>
            ))
          : ''}
      </ul>
    )
  }

  return (
    <div className='calendar'>
      <Calendar dateCellRender={dateCellRender} className='calendar__item' />
    </div>
  )
}
