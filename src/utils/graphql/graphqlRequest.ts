import { gql } from 'graphql-request'
import BirthdayFragment from '@utils/graphql/fragments/BirthdayFragment'
import MeetingFragment from '@utils/graphql/fragments/MeetingFragment'
import VacationFragment from '@utils/graphql/fragments/VacationFragment'
import ReminderFragment from '@utils/graphql/fragments/ReminderFragment'
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
