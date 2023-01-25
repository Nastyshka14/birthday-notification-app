import moment from 'moment'

import { DatePicker, Input, Modal, Select, TimePicker } from 'antd'
import { EVENTS } from '@constants/eventVariants'
import { IModalWindow } from '@domain/types'
import MarkdownEditor from '@uiw/react-markdown-editor'
import './ModalWindow.scss'

import { DownloadOutlined } from '@ant-design/icons';

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
  handleStartInput,
  handleEndInput,
  handleChange,
  handleTextInput,
  handleTimeInput,
  handleTimePickerInput,
  title,
  type,
  description,
  date,
  start,
  end,
  time,
  timePicker,
}): JSX.Element => {
  const getType = (answer: boolean) => {
    return (
      <Select
        bordered={false}
        onChange={handleTypeInput}
        disabled={answer}
        value={type}
        className='modal__section-select'
      >
        {typeOptions}
      </Select>
    )
  }

  const getTitle = () => {
    return (
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
  }
  const getDescription = () => {
    return (
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
  }
  const getBirthdayDate = () => {
    return (
      <div className='modal__section'>
        <div className='modal__section-img modal__section--date-img' />
        <div className='modal__section--input'>
          <DatePicker bordered={false} value={moment(date)} onChange={handleDateInput} />
        </div>
      </div>
    )
  }

  const getReminderDate = () => {
    return (
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
    )
  }
  const getTime = () => {
    return (
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
  }
  const getMarkdown = () => {
    return (
      <div className='modal__section--markdown'>
        <div className='modal__section-img modal__section--description-img' />
        <div>
          <MarkdownEditor value={description} onChange={handleMarkdownInput} />
        </div>
      </div>
    )
  }
  const getStartEnd = () => {
    return (
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
            <DatePicker bordered={false} value={moment(end)} name='end' onChange={handleEndInput} />
          </div>
        </div>
      </div>
    )
  }

  const getDuration = () => {
    const format = 'HH:mm'
    return <TimePicker format={format} disabled={false} />
  }

  const getMeetingDate = () => {
    const format = 'HH:mm'
    return (
    <div className='modal__section'>
      <div className='modal__section-img modal__section--date-img' />
      <div className='modal__section--input'>
          <DatePicker
            bordered={false}
            value={moment(start)}
            showTime={{ format: 'HH:mm' }}
            onChange={handleStartInput}
            format="YYYY-MM-DD HH:mm"
          />
      <TimePicker format={format} disabled={false} bordered={false} placeholder='Duration' value={timePicker} onChange={handleTimePickerInput} />
      {/* <DatePicker
            bordered={false}
            value={moment(end)}
            showTime={{ format: 'HH:mm' }}
            onChange={handleEndInput}
            format="YYYY-MM-DD HH:mm"
            disabled={true}
          /> */}
      </div>
    </div>)
  }

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
          {operation === 'update' ? getType(true) : getType(false)}
        </div>
      </div>

      {(type === EVENTS.vacation && (
        <div className='modal__main'>
          {getTitle()}
          {getDescription()}
          {getStartEnd()}
        </div>
      )) ||
        (type === EVENTS.meeting && (
          <div className='modal__main'>
            {getTitle()}
            {getDescription()}
            {getMeetingDate()}
          </div>
        )) ||
        (type === EVENTS.birthday && (
          <div className='modal__main'>
            {getTitle()}
            {getBirthdayDate()}
          </div>
        )) ||
        (type === EVENTS.reminder && (
          <div className='modal__main'>
            {getTitle()}
            {getReminderDate()}
            {getMarkdown()}
            {getTime()}
          </div>
        ))}
    </Modal>
  )
}
