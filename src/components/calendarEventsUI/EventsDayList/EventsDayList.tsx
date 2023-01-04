import React from 'react'
import moment from 'moment'
import { IEventsDayList, INotification } from '@domain/types'
import MarkdownEditor from '@uiw/react-markdown-editor'
import { Popover, Badge, BadgeProps } from 'antd'
import './EventsDayList.scss'

export const EventsDayList = ({
  collection,
  handleRemoveEvent,
  handleUpdateEvent,
}: IEventsDayList): JSX.Element => {
  
  const color = (value: string): string => {
    if (value === 'Birthdays') {
      return '#91caff'
    }
    if (value === 'Meeting') {
      return '#d3adf7'
    }
    if (value === 'Vacation') {
      return '#ffadd2'
    }
    if (value === 'Reminder') {
      return '#b7eb8f'
    }
  }

  return (
    <div>
      <ul className='events'>
        {collection.map(<T extends INotification>(eventItem: T ): JSX.Element => (
          <Popover
            placement='right'
            title={
              <>
                <Badge.Ribbon text={eventItem.type} color={color(eventItem.type)}>
                  <div className='popover__badge'></div>
                </Badge.Ribbon>
                <div className='popover__title'>{eventItem.title}</div>
              </>
            }
            content={
              <div className='content__item'>
                {eventItem.type === 'Reminder' && (
                  <MarkdownEditor.Markdown source={eventItem.description} />
                )}
                {eventItem.type === 'Meeting' ||
                  eventItem.type === 'Vacation' && (<p className='content__item--description'>{eventItem.description}</p>)}

                <p className='content__item--date'>
                  {eventItem.type === 'Meeting' ||
                    eventItem.type === 'Vacation' &&
                      (moment(eventItem.start).format('D MMM') +
                        ' - ' +
                        moment(eventItem.end).format('D MMM'))}
                  {eventItem.type === 'Reminder' && moment(eventItem.date).format('D MMM HH:mm')}
                </p>
                <div className='content__item--buttons'>
                  <button
                    className='content__item--edit-btn'
                    onClick={() => handleUpdateEvent(eventItem.identifier.id)}
                  />
                  <button
                    className='content__item--delete-btn'
                    onClick={() => handleRemoveEvent(eventItem.identifier.id)}
                  />
                </div>
              </div>
            }
          >
            <div className='list'>
              <li className='list__item'>
                <Badge
                  status={'default' as BadgeProps['status']}
                  title={eventItem.title}
                  text={eventItem.title}
                  color={color(eventItem.type)}
                />
                {eventItem.type === 'Meeting' ||
                  (eventItem.type === 'Vacation' && (
                    <p className='list__item--date'>
                      {moment(eventItem.start).format('D MMM') +
                        ' - ' +
                        moment(eventItem.end).format('D MMM')}
                    </p>
                  ))}
                {eventItem.type === 'Reminder' && (
                  <p className='list__item--date'>{moment(eventItem.date).format('D MMM HH:mm')}</p>
                )}
              </li>
            </div>
          </Popover>
        ))}
      </ul>
    </div>
  )
}
