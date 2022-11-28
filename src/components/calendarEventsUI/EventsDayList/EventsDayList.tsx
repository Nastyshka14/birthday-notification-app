import React from 'react'
import { INotification } from '../../../domain/types'
import { EVENTS_OPERATIONS } from '../../../constants'
import { EventsItem } from '../EventItem'
import { EventRecord } from '../EventRecord'
import { Button } from '../../core/Button'
import { Popover } from 'antd'
import './EventsDayList.scss'

export const EventsDayList = <T extends INotification>({
  collection,
  handleRemoveEvent,
  handleUpdateEvent,
}): JSX.Element => {

  return (
    <>
      <ul className='events-list'>
        {collection.map((eventItem: INotification) => ( 
          <React.Fragment key={eventItem.identifier.id}>
            <EventsItem eventItem={eventItem} />
            <Button
              type={EVENTS_OPERATIONS.delete}
              onClick={() => handleRemoveEvent(eventItem.identifier.id)}
            />
            <Button
              type={EVENTS_OPERATIONS.update}
              onClick={() => handleUpdateEvent(eventItem.identifier.id)}
            />
          </React.Fragment>
        ))}
      </ul>   

    </>
  )
}