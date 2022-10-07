import { gql } from 'graphql-request'

const MeetingFragment = gql`
  fragment MeetingFragment on Meeting {
    type: __typename
    identifier: sys {
      id
    }
    title
    description
    start
    end
}`

export default MeetingFragment
