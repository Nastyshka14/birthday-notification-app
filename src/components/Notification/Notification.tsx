import { useCallback } from 'react'
import { Sprites } from '../Sprites/Sprites'
import { notification, Popover } from 'antd'
import { INotification } from 'src/domain/types/Notification'
import moment from 'moment'
import './Notification.scss'


export const Notification = (): INotification => {
  const getNotificationBody = (item: string): JSX.Element => {
    return (
      <div className='notification'>
        <Sprites item={item} />
      </div>
    )
  }

 const shareSocials = (item: string) => {
    window.plugins.socialsharing.shareWithOptions({
      message: `Today is ${item}`
    })
  }

  const description = (item: string): JSX.Element => {
    return (
      <div className='description'>
        <span className='description__text'>Today is {item}</span>
        {!window.cordova ? 
        <Popover placement='bottomRight' content={getNotificationBody(item)} trigger='click'>
          <button className='description__btn'></button>
        </Popover> :  <button className='description__btn' onClick={() => shareSocials(item)}></button>}
      </div>
    )
  }

  const message = (): JSX.Element => {
    return (
      <div className='message'>
        <p className='message__text'>{moment().format('D MMM dddd')}</p>
      </div>
    )
  }

  const openNotification = useCallback(
    (item: string) => {
      notification.open({
        message: message(),
        description: description(item),
        duration: 0,
        icon: <div className='notification__icon' />,
      })
    },
    [getNotificationBody],
  )

  return { openNotification, getNotificationBody, shareSocials }
}
