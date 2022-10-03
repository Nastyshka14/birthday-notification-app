import { IBirthday } from '../../../domain/types'
import './Birthday.scss'

export const Birthday = ({ data: birthdays }: { data: Array<IBirthday> }): JSX.Element | null => {
  return birthdays.length > 0 && (
    <ul className='birthdays-list calendar-events__list'>
      {birthdays.map((birthday: IBirthday) => (
        <li className='birthdays-list__item' key={birthday.title}>
          {birthday.title}
        </li>
      ))
      }
    </ul>
  )
}
