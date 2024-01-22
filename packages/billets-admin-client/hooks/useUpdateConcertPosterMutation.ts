import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationHookOptions,
  useMutation,
} from '@apollo/client'
import { UpdateConcertPosterData } from '../gql/schema'

const Mutation = gql`
  mutation UpdateConcertPoster($input: UpdateConcertPosterInput!) {
    updateConcertPoster(input: $input) {
      ... on ConcertPoster {
        id
        imageURL
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useUpdateConcertPosterMutation(
  options?: MutationHookOptions<
    { updateConcertPoster: UpdateConcertPosterData },
    { input: { id: number; imageURL: string } },
    DefaultContext,
    ApolloCache<any>
  >
) {
  return useMutation<
    {
      updateConcertPoster: UpdateConcertPosterData
    },
    {
      input: {
        id: number
        imageURL: string
      }
    }
  >(Mutation, options)
}
