import { BadgeProps, Badge } from 'antd'
import { INotification } from '../../../domain/types'
import './EventsItem.scss'

export const EventsItem = <T extends INotification>({
  eventItem,
}: {
  eventItem: T
}): JSX.Element => {
  return <Badge status={'default' as BadgeProps['status']} text={eventItem.title} />
}
