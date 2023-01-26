import React from 'react'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { EventsList } from '../calendarEventsUI'
import { EventsDayList } from '../calendarEventsUI/EventsDayList'
import { Popover, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './CalendarCellWithEvents.scss'
import { ICalendarCell } from 'src/domain/types'

export const CalendarCellWithEvents = ({ data, cellDate, removeEvent, clickUpdate, showModal }: ICalendarCell): JSX.Element => {
  const collections = defineNotificationsByTypeByDay(data, cellDate)
  const content = Object.keys(collections).map((eventsCollection: string): JSX.Element => (
    <div>
      {collections[eventsCollection].length !== 0 && (
        <EventsDayList
          collection={collections[eventsCollection]}
          handleRemoveEvent={removeEvent}
          handleUpdateEvent={clickUpdate}
        />
      )}
    </div>
  ))

  const title = (): JSX.Element => {
    return (
      <div className='title'>
        <div className='title__date'>
          <p className='title__day'>{cellDate.format('D MMM')}</p>
          <p className='title__week'>{cellDate.format('dddd')}</p>
        </div>
        <Button className='title__btn' icon={<PlusOutlined />} onClick={showModal} type='primary' ghost />
      </div>
    )
  }

  return (
    <Popover placement='right' title={title()} content={content}>
      <div>
        {Object.keys(collections).map((eventsCollection: string, index: number): JSX.Element => (
          <EventsList collection={collections[eventsCollection]} key={index} />
        ))}
      </div>
    </Popover>
  )
}
