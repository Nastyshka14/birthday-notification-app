import React from 'react'
import { Notification } from '../../components/Notification/Notification'
import { IBirthdayItem } from '../../domain/types/Birthday'
import { getBirthdaysData } from '../../api/utils/getBirthdaysData'
import { Calendar, Popover, BadgeProps, Badge } from 'antd'
import moment, { Moment } from 'moment'
import './CalendarPage.scss'
import 'antd/dist/antd.css'

moment.updateLocale('en', { week: { dow: 1 } })

export const CalendarPage = (): JSX.Element => {
  const { getNotificationBody, shareSocials } = Notification()
  const { getListData } = getBirthdaysData()

  const content = (value: Moment): JSX.Element => {
    const listData: IBirthdayItem[] = getListData(value)
    return (
      <ul className='content'>
        {listData.length
          ? listData.map((item: IBirthdayItem): JSX.Element => (
              <div className='content__component'>
                <li className='content__item' key={item.name + item.date.toString()}>
                  <div className='content__item-name'>
                    <span className='content__item-text'>{item.name}</span>
                    {!window.cordova ? <Popover
                      placement='right'
                      content={getNotificationBody(item.name)}
                      trigger='click'
                    >
                      <button className='content__item-btn'></button>
                    </Popover> : <button className='content__item-btn' onClick={() => shareSocials(item.name)}></button>}
                  </div>
                </li>
              </div>
            ))
          : ''}
      </ul>
    )
  }
  const title = (value: Moment): JSX.Element => {
    return (
      <div className='title'>
        <p className='title__day'>{value.format('D MMM')}</p>
        <p className='title__week'>{value.format('dddd')}</p>
      </div>
    )
  }

  const dateCellRender = (value: Moment): JSX.Element => {
    const listData: IBirthdayItem[] = getListData(value)
    return (
      <Popover title={title(value)} placement='bottomRight' content={content(value)} trigger='click'>
        <ul className='events'>
          {listData.length
            ? listData.map((item: IBirthdayItem):JSX.Element => (
                <div>
                  <li key={item.name}>
                    <Badge status={'default' as BadgeProps['status']} text={item.name} />
                  </li>
                </div>
              ))
            : ''}
        </ul>
      </Popover>
    )
  }
  
  return (
    <div className='calendar'>
      <Calendar dateCellRender={dateCellRender} className='calendar__item' />
    </div>
  )
}
