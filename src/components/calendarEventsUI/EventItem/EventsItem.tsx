import { Notification } from '@domain/types'
import { Typography } from 'antd'
import './EventsItem.scss'

const { Text } = Typography

export const EventsItem = <T extends Notification>({
  eventItem,
}: {
  eventItem: T
}): JSX.Element => {
  const type = () => {
    if (eventItem.type === 'Meeting') {
      return 'meeting'
    } else if (eventItem.type === 'Vacation') {
      return 'vacation'
    } else if (eventItem.type === 'Reminder') {
      return 'reminder'
    } else if (eventItem.type === 'Birthdays') {
      return 'birthday'
    }
  }
  return (
    <li>
      <Text className={`item item__${type()}`}>{eventItem.title}</Text>
    </li>
  )
}
