import { IVacation } from '../../../domain/types'
import  './Vacation.scss'

export const Vacation = ({ data: vacations }: { data: Array<IVacation> }): JSX.Element | null => {
  return vacations?.length > 0 && (
    <ul className='vacations-list'>
      {vacations.map((vacation: IVacation) => (
        <li className='vacations-list__item' key={vacation.start.toString()}>{vacation.title}</li>
      ))}
    </ul>
  )
}
