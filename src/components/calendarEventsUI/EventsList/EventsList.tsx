import React from 'react'
import { INotification } from '../../../domain/types'
import { EVENTS_OPERATIONS } from '../../../constants'
import { EventsItem } from '../EventItem'
import { EventRecord } from '../EventRecord'
import { Button } from '../../core/Button'
import { Popover } from 'antd'
import './EventsList.scss'
import { EventsDayList } from '../EventsDayList'

export const EventsList = <T extends INotification>({
  collection,
}): JSX.Element => {

  return (
    <>
      <ul className='events-list'>
        {collection.map((eventItem: INotification) => ( 
          <React.Fragment key={eventItem.identifier.id}>
            <EventsItem eventItem={eventItem} />
          </React.Fragment>
        ))}
      </ul>   

    </>
  )
}
