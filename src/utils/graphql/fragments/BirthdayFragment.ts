import { gql } from 'graphql-request'

const BirthdayFragment = gql`
  fragment BirthdayFragment on Birthdays {
    type: __typename
    identifier: sys {
      id
    }
    title: name
    date
  }
`;

export default BirthdayFragment
