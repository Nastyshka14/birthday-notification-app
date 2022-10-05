import { Popover } from 'antd'
import { IVacation } from '../../../domain/types'
import './Vacation.scss'

export const Vacation = ({ data: vacations }: { data: Array<IVacation> }): JSX.Element | null => {
  return (
    vacations?.length > 0 && (
      <ul className='vacations-list  calendar-events__list'>
        {vacations.map((vacation: IVacation) => (
          <li className='vacations-list__item' key={vacation.start.toString()}>
            <Popover placement='right' title={'Vacation'} content={vacation.title}>
              {vacation.title}
            </Popover>
          </li>
        ))}
      </ul>
    )
  )
}
