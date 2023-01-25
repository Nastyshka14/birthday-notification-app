import moment from 'moment'

import { DatePicker, DatePickerProps, Input, Modal, Select, TimePicker } from 'antd'
import { EVENTS, EVENTS_OPERATIONS } from '@constants/eventVariants'
import { IModalWindow, ISection } from '@domain/types'
import MarkdownEditor from '@uiw/react-markdown-editor'
import './ModalWindow.scss'

const { Option } = Select

const typeOptions = Object.values(EVENTS).map((item) => (
  <Option value={item.toLocaleLowerCase()} label={item.toLocaleLowerCase()} key={item}>
    {item[0].toUpperCase() + item.slice(1)}
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
  handleEndInput,
  handleChange,
  handleTextInput,
  handleTimeInput,
  handleTimePickerInput,
  title,
  type,
  description,
  date,
  end,
  time,
  timePicker,
}: IModalWindow): JSX.Element => {
  const getTypeLayout = (option: boolean): JSX.Element => {
    return (
      <Select
        bordered={false}
        onChange={handleTypeInput}
        disabled={option}
        value={type}
        className='modal__section-select'
      >
        {typeOptions}
      </Select>
    )
  }

  const titleLayout = (
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
  )

  const descriptionLayout = (
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
  )

  const timeNotificationLayout = (
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
  )

  const markdownLayout = (
    <div className='modal__section--markdown'>
      <div className='modal__section-img modal__section--description-img' />
      <div>
        <MarkdownEditor value={description} onChange={handleMarkdownInput} />
      </div>
    </div>
  )

  const getDateLayout = (date: Date, handleDateInput: (value: DatePickerProps['value']) => void, option: boolean, time: boolean | {format: string}, format: string, disabledDate) => {
    return (
      <DatePicker
        bordered={false}
        value={moment(date)}
        onChange={handleDateInput}
        disabled={option}
        showTime={time}
        format={format}
        disabledDate={disabledDate}
      />
    )
  }

  const getDurationLayout = (option: boolean): JSX.Element => {
    const format = 'HH:mm'
    return (
      <TimePicker
        format={format}
        disabled={option}
        bordered={false}
        placeholder='Duration'
        value={timePicker}
        onChange={handleTimePickerInput}
      />
    )
  }

  const getSectionLayout: ISection = (date, duration, end) => {
    return (
      <div className='modal__section'>
        <div className='modal__section-img modal__section--date-img' />
        <div className='modal__section--input'>
          {date}
          {duration}
          {end}
        </div>
      </div>
    )
  }

  const disabledDate = (current: Date) => {
    return current && current < date
  };

  return (
    <Modal
      title={operation === EVENTS_OPERATIONS.update ? 'Update event' : 'New event'}
      open={openMod}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <div className='modal__section'>
        <div className='modal__section-img modal__section--type-img' />
        <div className='modal__section--type-input'>
          {operation === EVENTS_OPERATIONS.update ? getTypeLayout(true) : getTypeLayout(false)}
        </div>
      </div>

      {(type === EVENTS.vacation && (
        <div className='modal__main'>
          {titleLayout}
          {descriptionLayout}
          {getSectionLayout(
            getDateLayout(date, handleDateInput, false, false, 'YYYY-MM-DD', false),
            getDurationLayout(true),
            getDateLayout(end, handleEndInput, false, false, 'YYYY-MM-DD', disabledDate),
          )}
        </div>
      )) ||
        (type === EVENTS.meeting && (
          <div className='modal__main'>
            {titleLayout}
            {descriptionLayout}
            {getSectionLayout(
              getDateLayout(date, handleDateInput, false, { format: 'HH:mm' }, 'YYYY-MM-DD HH:mm', false),
              getDurationLayout(false),
              getDateLayout(end, handleEndInput, true, { format: 'HH:mm' }, 'YYYY-MM-DD HH:mm', false),
            )}
          </div>
        )) ||
        (type === EVENTS.birthday && (
          <div className='modal__main'>
            {titleLayout}
            {getSectionLayout(
              getDateLayout(date, handleDateInput, false, false, 'YYYY-MM-DD', false),
              null,
              null,
            )}
          </div>
        )) ||
        (type === EVENTS.reminder && (
          <div className='modal__main'>
            {titleLayout}
            {getSectionLayout(
              getDateLayout(date, handleChange, false, { format: 'HH:mm' }, 'YYYY-MM-DD HH:mm', false),
              null,
              null,
            )}
            {markdownLayout}
            {timeNotificationLayout}
          </div>
        ))}
    </Modal>
  )
}
