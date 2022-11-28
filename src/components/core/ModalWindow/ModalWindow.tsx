import { Modal } from 'antd'
import { InputText } from '../InputText'
import { Select } from '../Select'
import { InputDate } from '../InputDate'
import { Button } from '../Button'
import { EVENTS_OPERATIONS, EVENTS } from '../../../constants'

export const ModalWindow = ({ openMod, handleCancel, operation, type, handleEventTypeSelection, title, description, date, start, end, handleInput, handleSubmit, handleUpdate}) => {
  return (
    <Modal title={operation} open={openMod} onCancel={handleCancel}>
    <div className={`${operation}-event-form`}>
      <Select
        value={type && type.toLocaleLowerCase()}
        data={Object.values(EVENTS)}
        onChange={handleEventTypeSelection}
      />

      <InputText value={title} label={'Title'} name='title' onChange={handleInput} />

      {(type && type.toLocaleLowerCase() === EVENTS.vacation.toLocaleLowerCase()) ||
      type.toLocaleLowerCase() === EVENTS.meeting.toLocaleLowerCase() ? (
        <>
          <InputText
            value={description}
            label={'Description'}
            name='description'
            onChange={handleInput}
          />
          <InputDate value={start} label='Date from' name='start' onChange={handleInput} />
          <InputDate value={end} label='Date to' name='end' onChange={handleInput} />
        </>
      ) : (
        <InputDate value={date} label='Date' name='date' onChange={handleInput} />
      )}
      <Button onClick={operation === EVENTS_OPERATIONS.create ? handleSubmit : handleUpdate} />
    </div>
  </Modal>
  )
}
