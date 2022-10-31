import React, { useState, useEffect, useRef } from 'react'
import { Calendar } from 'antd'
import moment, { Moment } from 'moment'
import graphqlRequest from '../../utils/graphql/graphqlRequest'
import getData from '../../utils/services/api'
import { IDataFromServer } from '../../domain/types'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { filterNotificationsForToday } from 'src/utils/functions/filterNotificationsForToday'
import { CalendarCellWithEvents } from '../CalendarCellWithEvents'
import 'antd/dist/antd.css'
import './CalendarPage.scss'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = () => {
  const [data, setData] = useState<IDataFromServer | null>(null)
  const runsCounterRef = useRef(0)

  useEffect(() => {
    if (runsCounterRef.current === 0) {
      getData(graphqlRequest).then((data: IDataFromServer): void => {
        setData(data)
      })
    }
// export const CalendarPage = (): JSX.Element => {
//   const { getNotificationBody, shareSocials } = Notification()
//   const { getListData } = getBirthdaysData()

//   const content = (value: Moment): JSX.Element => {
//     const listData: IBirthdayItem[] = getListData(value)
//     return (
//       <ul className='content'>
//         {listData.length
//           ? listData.map((item: IBirthdayItem): JSX.Element => (
//               <div className='content__component'>
//                 <li className='content__item' key={item.name + item.date.toString()}>
//                   <div className='content__item-name'>
//                     <span className='content__item-text'>{item.name}</span>
//                     {!window.cordova ? <Popover
//                       placement='right'
//                       content={getNotificationBody(item.name)}
//                       trigger='click'
//                     >
//                       <button className='content__item-btn'></button>
//                     </Popover> : <button className='content__item-btn' onClick={() => shareSocials(item.name)}></button>}
//                   </div>
//                 </li>
//               </div>
//             ))
//           : ''}
//       </ul>
//     )
//   }
//   const title = (value: Moment): JSX.Element => {
//     return (
//       <div className='title'>
//         <p className='title__day'>{value.format('D MMM')}</p>
//         <p className='title__week'>{value.format('dddd')}</p>
//       </div>
//     )
//   }

    runsCounterRef.current++

    return () => setData(null)
  }, [])

  useEffect(() => {
    if (data) {
      const notificationsForToday = defineNotificationsByTypeByDay(data, moment(new Date()))
      let isNotification = false

      for (const eventCollection in notificationsForToday) {
        if ((isNotification = notificationsForToday[eventCollection].length > 0)) {
          break
        }
      }

      if (isNotification) {
        filterNotificationsForToday(notificationsForToday)
      }
    }
  }, [data])

  const dateCellRender = (dateCell: Moment): JSX.Element | null => {
    return data && <CalendarCellWithEvents data={data} cellDate={dateCell} />
  }
  
  return (
    <div className='calendar__wrapper'>
      <Calendar dateCellRender={dateCellRender} className='calendar' />
    </div>
  )
}
