import React from 'react'

import { IEventsList, INotification } from '@domain/types'
import { EventsItem } from '@components/calendarEventsUI/EventItem'
import './EventsList.scss'

export const EventsList = ({ collection }: IEventsList): JSX.Element => {
  return (
    <>
      <ul className='events'>
        {collection.map((eventItem: INotification) => (
          <React.Fragment key={eventItem.identifier.id}>
            <EventsItem eventItem={eventItem} />
          </React.Fragment>
        ))}
      </ul>
    </>
  )
}
