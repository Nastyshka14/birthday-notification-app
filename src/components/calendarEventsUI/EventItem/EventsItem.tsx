import { Popover } from 'antd'
import { INotification } from '../../../domain/types'
import { EVENTS } from '../../../constants'
import { EventRecord } from '../EventRecord'
import './EventsItem.scss'

export const EventsItem = <T extends INotification>({
  eventItem,
}: {
  eventItem: T
}): JSX.Element => {
  const eventStyles: Array<string> = []

  if (eventItem.type === EVENTS.birthday) {
    eventStyles.push('item--birthday')
  }

  if (eventItem.type === EVENTS.meeting) {
    eventStyles.push('item--meeting')
  }

  if (eventItem.type === EVENTS.vacation) {
    eventStyles.push('item--vacation')
  }

  return (
    <Popover
      placement='right'
      title={eventItem.type}
      content={<EventRecord eventRecord={eventItem} />}
    >
      <li className={`item ${eventStyles.join(' ')}`}>
        <h3 className='item__title'>{eventItem.title}</h3>
      </li>
    </Popover>
  )
}
