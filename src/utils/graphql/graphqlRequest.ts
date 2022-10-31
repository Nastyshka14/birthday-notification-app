import { gql } from 'graphql-request'
import BirthdayFragment from './fragments/BirthdayFragment'
import MeetingFragment from './fragments/MeetingFragment'
import VacationFragment from './fragments/VacationFragment'

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
  }
  ${BirthdayFragment}
  ${MeetingFragment}
  ${VacationFragment}
`

export default graphqlRequest
