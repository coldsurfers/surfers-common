import {
  gql,
  OperationVariables,
  QueryHookOptions,
  useQuery,
} from '@apollo/client'
import { MeData } from '../gql/schema'

export const ME_QUERY = gql`
  query Me {
    me {
      ... on User {
        id
        email
        isAdmin
        createdAt
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useMeQuery(
  options?: QueryHookOptions<{ me: MeData }, OperationVariables>
) {
  return useQuery<{
    me: MeData
  }>(ME_QUERY, options)
}
