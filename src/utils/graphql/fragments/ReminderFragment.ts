import { gql } from 'graphql-request'

const ReminderFragment = gql`
  fragment ReminderFragment on Reminder {
    type: __typename
    identifier: sys {
      id
    }
    title
    description
    date
    time
  }
`;

export default ReminderFragment
