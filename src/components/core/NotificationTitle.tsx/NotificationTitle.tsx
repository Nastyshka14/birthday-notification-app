import moment from 'moment'
import './NotificationTitle.scss'

 export const NotificationTitle = (): JSX.Element => {
    return (
      <div className='message'>
        <p className='message__text'>{moment().format('D MMM')}</p>
        <p className='message__text'>{moment().format('dddd')}</p>
      </div>
    )
  }
  