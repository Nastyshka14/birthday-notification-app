import { gql } from 'graphql-request'
import BirthdayFragment from './fragments/BirthdayFragment'
import MeetingFragment from './fragments/MeetingFragment'
import VacationFragment from './fragments/VacationFragment'
import ReminderFragment from './fragments/ReminderFragment'
const graphqlRequest = gql`{
    birthdaysCollection {
      items {
        ...BirthdayFragment
      }
    }
    meetingCollection {
      items {
        ...MeetingFragment
      }
    }
    vacationCollection {
      items {
        ...VacationFragment
      }
    }
    reminderCollection {
      items {
        ...ReminderFragment
      }
    }
  }
  ${BirthdayFragment}
  ${MeetingFragment}
  ${VacationFragment}
  ${ReminderFragment}
`

export default graphqlRequest
