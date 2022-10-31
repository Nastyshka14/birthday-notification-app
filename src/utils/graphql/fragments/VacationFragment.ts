import { gql } from 'graphql-request'

const VacationFragment = gql`
  fragment VacationFragment on Vacation {
    type: __typename
    identifier: sys {
      id
    }
    title
    description
    start
    end
  }
`

export default VacationFragment
