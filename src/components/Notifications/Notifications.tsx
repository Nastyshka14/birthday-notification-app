import { INotification } from '../../domain/types'
import { SocialNetLinks } from '../SocialNetLinks'
import './Notifications.scss'

interface INotificationComponent {
  (notifications: string): JSX.Element
}

export const Notifications: INotificationComponent = (notifications) => {
  const notificationsAsArr: Array<INotification> = JSON.parse(notifications)

  return (
    <ul className='notification-list'>
      {notificationsAsArr.map((notification) => {
        return (
          <div className='notification-item'>
            <h5 className='notification-item__title'>{notification.title}</h5>
            <SocialNetLinks message={notification.title} />
          </div>
        )
      })}
    </ul>
  )
}
