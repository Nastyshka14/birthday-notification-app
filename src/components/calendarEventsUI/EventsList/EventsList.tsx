import React from 'react'

import { EventsListProps, Notification } from '@domain/types'
import { EventsItem } from '@components/calendarEventsUI/EventItem'
import './EventsList.scss'

export const EventsList = ({ collection }: EventsListProps): JSX.Element => {
  return (
    <>
      <ul className='events'>
        {collection.map((eventItem: Notification) => (
          <React.Fragment key={eventItem.identifier.id}>
            <EventsItem eventItem={eventItem} />
          </React.Fragment>
        ))}
      </ul>
    </>
  )
}
