import React, { useEffect, useState } from 'react'
import { defineNotificationsByTypeByDay } from '../../utils/functions/defineNotificationsByTypeByDay'
import { IEventsCollections, ICalendarCell } from '../../domain/types'
import { EVENTS_OPERATIONS, EVENTS } from '../../constants'
import { EventsList } from '../calendarEventsUI'
import { ModalWindow } from '../core/ModalWindow'
import { Button } from '../core/Button'
import { getItemById } from '../../utils/services/http.service'
import { Popover } from 'antd'
import { EventsDayList } from '../calendarEventsUI/EventsDayList'

export const CalendarCellWithEvents = ({
  data,
  cellDate,
  removeEvent,
  clickUpdate,
}) => {
  // const operation = eventID ? EVENTS_OPERATIONS.update : EVENTS_OPERATIONS.create
const collections = defineNotificationsByTypeByDay(data, cellDate)
  const content = 
  Object.keys(collections).map((eventsCollection, index) => (
    <EventsDayList
      collection={collections[eventsCollection]}
      handleRemoveEvent={removeEvent}
      handleUpdateEvent={clickUpdate}
      key={index}
    />
  ))

  return (
    <Popover
    placement='right'
    title={'events'}
    content={content}
  >
    <div className='events'>
      {Object.keys(collections).map((eventsCollection, index) => (
        <EventsList
          collection={collections[eventsCollection]}
          key={index}
        />
      ))}
    </div>
    </Popover>
  )
}
