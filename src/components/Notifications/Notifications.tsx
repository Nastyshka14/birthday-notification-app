import { Popover } from 'antd'
import { INotification, INotificationComponent } from '@domain/types'
import { EventRecord } from '@components/calendarEventsUI/EventRecord'
import { SocialNetLinks } from '@components/SocialNetLinks'
import './Notifications.scss'

export const Notifications: INotificationComponent = (notifications) => (
  <ul className='notification-list'>
    {notifications.map((notification) => {
      return (
        <li className='notification-list__item' key={notification.identifier.id}>
          <EventRecord eventRecord={notification} />
          <Popover
            placement='bottomRight'
            content={<SocialNetLinks message={notification.title} />}
            trigger='click'
          >
            <div className='notification-list_item-share-btn' />
          </Popover>
        </li>
      )
    })}
  </ul>
)
