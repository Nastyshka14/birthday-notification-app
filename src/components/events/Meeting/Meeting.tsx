import { Popover } from 'antd'
import { IMeeting } from '../../../domain/types'
import './Meeting.scss'

export const Meeting = ({ data: meetings }: { data: Array<IMeeting> }): JSX.Element | null => {
  return (
    meetings?.length > 0 && (
      <ul className='meetings-list calendar-events__list'>
        {meetings.map((meeting: IMeeting) => (
          <li className='meetings-list__item' key={meeting.title + meeting.start.toString()}>
            <Popover placement='right' title={'Meeting'} content={meeting.title}>
              <h3>{meeting.title}</h3>
              <p>{meeting?.description && meeting.description}</p>
            </Popover>
          </li>
        ))}
      </ul>
    )
  )
}
