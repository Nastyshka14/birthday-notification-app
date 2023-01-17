import moment from 'moment'

import { DatePicker, Input, Modal, Select } from 'antd'
import { EVENTS } from '@constants/eventVariants'
import { IModalWindow } from '@domain/types'
import MarkdownEditor from '@uiw/react-markdown-editor'
import './ModalWindow.scss'

const { Option } = Select

const typeOptions = Object.values(EVENTS).map((item) => (
  <Option value={item.toLocaleLowerCase()} label={item.toLocaleLowerCase()} key={item}>
    {item}
  </Option>
))

export const ModalWindow = ({
  handleOk,
  openMod,
  handleCancel,
  operation,
  handleMarkdownInput,
  handleTypeInput,
  handleDateInput,
  handleStartInput,
  handleEndInput,
  handleChange,
  handleTextInput,
  handleTimeInput,
  title,
  type,
  description,
  date,
  start,
  end,
  time,
}: IModalWindow): JSX.Element => {
  return (
    <Modal
      title={operation === 'update' ? 'Update event' : 'New event'}
      open={openMod}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <div className='modal__section'>
        <div className='modal__section-img modal__section--type-img' />
        <div className='modal__section--type-input'>
          {operation === 'update' ? (
            <Select
              bordered={false}
              onChange={handleTypeInput}
              disabled
              value={type}
              className='modal__section-select'
            >
              {typeOptions}
            </Select>
          ) : (
            <Select bordered={false} onChange={handleTypeInput} value={type} className='modal__section-select'>
              {typeOptions}
            </Select>
          )}
        </div>
      </div>

      {((type?.toLocaleLowerCase() === EVENTS.vacation.toLocaleLowerCase() ||
        type?.toLocaleLowerCase() === EVENTS.meeting.toLocaleLowerCase()) && (
        <div className='modal__main'>
          <div className='modal__section'>
            <div className='modal__section-img modal__section--title-img' />
            <div className='modal__section--input'>
              <Input
                bordered={false}
                value={title}
                name='title'
                onChange={handleTextInput}
                placeholder='Add title'
              />
            </div>
          </div>
          <div className='modal__section'>
            <div className='modal__section-img modal__section--description-img' />
            <div className='modal__section--input'>
              <Input
                bordered={false}
                value={description}
                name='description'
                onChange={handleTextInput}
                placeholder='Add description'
              />
            </div>
          </div>
          <div className='modal__section'>
            <div className='modal__section-img modal__section--date-img' />
            <div className='modal__section--date-group'>
              <div className='modal__section--start-input'>
                <DatePicker
                  bordered={false}
                  value={moment(start)}
                  name='start'
                  onChange={handleStartInput}
                />
              </div>
              <div className='modal__section--end' />
              <div className='modal__section--end-input'>
                <DatePicker
                  bordered={false}
                  value={moment(end)}
                  name='end'
                  onChange={handleEndInput}
                />
              </div>
            </div>
          </div>
        </div>
      )) ||
        (type?.toLocaleLowerCase() === EVENTS.birthday.toLocaleLowerCase() && (
          <div className='modal__main'>
            <div className='modal__section'>
              <div className='modal__section-img modal__section--title-img' />
              <div className='modal__section--input'>
                <Input
                  bordered={false}
                  value={title}
                  name='title'
                  onChange={handleTextInput}
                  placeholder='Add title'
                />
              </div>
            </div>
            <div className='modal__section'>
              <div className='modal__section-img modal__section--date-img' />
              <div className='modal__section--input'>
                <DatePicker bordered={false} value={moment(date)} onChange={handleDateInput} />
              </div>
            </div>
          </div>
        )) ||
        (type?.toLocaleLowerCase() === EVENTS.reminder.toLocaleLowerCase() && (
          <div className='modal__main'>
            <div className='modal__section'>
              <div className='modal__section-img modal__section--title-img' />
              <div className='modal__section--input'>
                <Input
                  bordered={false}
                  value={title}
                  name='title'
                  onChange={handleTextInput}
                  placeholder='Add title'
                />
              </div>
            </div>
            <div className='modal__section'>
              <div className='modal__section-img modal__section--date-img' />
              <div className='modal__section--input'>
                <DatePicker
                  bordered={false}
                  value={moment(date)}
                  showTime={{ format: 'HH:mm' }}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='modal__section--markdown'>
              <div className='modal__section-img modal__section--description-img' />
              <div>
                <MarkdownEditor value={description} onChange={handleMarkdownInput} />
              </div>
            </div>
            <div className='modal__section'>
              <div className='modal__section--time-img' />
              <div className='modal__section--time-input'>
                Notify in
                <Select
                  bordered={false}
                  value={time.toString()}
                  onChange={handleTimeInput}
                  options={[
                    {
                      value: '30',
                      label: '30',
                    },
                  ]}
                />
                minutes.
              </div>
            </div>
          </div>
        ))}
    </Modal>
  )
}
