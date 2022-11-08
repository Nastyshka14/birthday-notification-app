import React, { useState } from 'react'
import { INotification } from '../../../domain/types'
import { isEventWithIDExist, deleteEventByID } from '../../../utils/services/http.service'
import { EVENTS_OPERATIONS } from '../../../constants'
import { EventsItem } from '../EventItem'
import { Button } from '../../core/Button'
import { UpdateEventForm } from '../../calendarEventsOperations/UpdateEventForm'
import { ModalWindow } from '../../core/ModalWindow'
import './EventsList.scss'

export const EventsList = <T extends INotification>({
  collection,
}: {
  collection: Array<T>
}): JSX.Element => {
  /**
   *
   * TODO: replace alerts with modal window component
   */

  const [listOfEvents, setListOfEvents] = useState<Array<T>>(collection)
  const [isUpdateEventDialog, setUpdateEventDialog] = useState<boolean>(false)
  const [eventID, setEventID] = useState<string>(null)

  const handleUpdateEvent = (id: string) => {
    setEventID(id)
    setUpdateEventDialog(true)
    alert('display update event form')
  }

  const handleRemoveEvent = async (id: string): Promise<void> => {
    const isEvent = await isEventWithIDExist(id)
    const isDeleted = isEvent && deleteEventByID(id)


    if (isDeleted) {
      const deletedElement: T = listOfEvents.find(
        (eventItem: T): boolean => eventItem.identifier.id === id,
      )
      const deletedItemPos = listOfEvents.indexOf(deletedElement)

      collection.splice(deletedItemPos, 1)
      setListOfEvents(listOfEvents.filter((eventItem) => eventItem.identifier.id !== id))
      alert('no event with this ID')
    }
  }

  return (

    <>
      <ul className='events-list'>
        {listOfEvents.map((eventItem: INotification) => (
          <React.Fragment key={eventItem.identifier.id}>
            <EventsItem eventItem={eventItem} />
            <Button
              type={EVENTS_OPERATIONS.update}
              onClick={() => handleUpdateEvent(eventItem.identifier.id)}
            />
            <Button
              type={EVENTS_OPERATIONS.delete}
              onClick={() => handleRemoveEvent(eventItem.identifier.id)}
            />
          </React.Fragment>
        ))}
      </ul>

      {isUpdateEventDialog && eventID && (
        <ModalWindow>
          <UpdateEventForm eventID={eventID} />
        </ModalWindow>
      )}
    </>
  )
}
