import { Popover } from 'antd'
import { INotificationComponent } from '../../domain/types'
import { EventRecord } from '../calendarEventsUI'
import { SocialNetLinks } from '../SocialNetLinks'
import './Notifications.scss'

export const Notifications: INotificationComponent = (notifications) => (
  <ul className='notification-list'>
    {notifications
      .filter((item) => item.type !== 'Reminder')
      .map((notification) => {
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
      {notifications
      .filter((item) => item.type === 'Reminder')
      .map((notification) => {
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
