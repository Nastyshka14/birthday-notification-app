import { gql } from 'graphql-request'

const VacationFragment = gql`
  fragment VacationFragment on Vacation {
    type: __typename
    identifier: sys {
      id
    }
    title
    description
    date
    end
  }
`

export default VacationFragment
