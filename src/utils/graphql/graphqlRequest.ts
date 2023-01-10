import { gql } from 'graphql-request'

import BirthdayFragment from '@utils/graphql/fragments/BirthdayFragment'
import MeetingFragment from '@utils/graphql/fragments/MeetingFragment'
import ReminderFragment from '@utils/graphql/fragments/ReminderFragment'
import VacationFragment from '@utils/graphql/fragments/VacationFragment'

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
