import { Popover } from 'antd'
import { INotification } from '../../domain/types'
import { EventRecord } from '../calendarEventsUI'
import { SocialNetLinks } from '../SocialNetLinks'
import './Notifications.scss'

interface INotificationComponent {
  (notifications: Array<INotification>): JSX.Element
}
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