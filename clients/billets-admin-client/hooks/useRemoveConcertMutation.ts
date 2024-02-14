import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationHookOptions,
  useMutation,
} from '@apollo/client'
import { RemoveConcertData } from '../gql/schema'

const REMOVE_CONCERT_MUTATION = gql`
  mutation RemoveConcert($input: RemoveConcertInput!) {
    removeConcert(input: $input) {
      ... on RemovedConcert {
        id
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useRemoveConcertMutation(
  options?: MutationHookOptions<
    { removeConcert: RemoveConcertData },
    { input: { id: number } },
    DefaultContext,
    ApolloCache<any>
  >
) {
  return useMutation<
    {
      removeConcert: RemoveConcertData
    },
    {
      input: {
        id: number
      }
    }
  >(REMOVE_CONCERT_MUTATION, options)
}
