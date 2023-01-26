import { gql } from 'graphql-request'

const BirthdayFragment = gql`
  fragment BirthdayFragment on Birthdays {
    type: __typename
    identifier: sys {
      id
    }
    title: title
    date
  }
`

export default BirthdayFragment
