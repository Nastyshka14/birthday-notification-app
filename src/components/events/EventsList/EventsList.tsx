import { INotification } from '../../../domain/types'
import { EventsItem } from '../EventItem'
import './EventsList.scss'

export const EventsList = <T extends INotification>({
  collection,
}: {
  collection: Array<T>
}): JSX.Element => (
  <ul className='events-list'>
    {collection.map((eventItem: INotification) => (
      <EventsItem eventItem={eventItem} key={eventItem.identifier.id} />
    ))}
  </ul>
)
