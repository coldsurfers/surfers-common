import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationHookOptions,
  useMutation,
} from '@apollo/client'
import { CreateConcertPosterData } from '../gql/schema'

const Mutation = gql`
  mutation CreateConcertPoster($input: CreateConcertPosterInput!) {
    createConcertPoster(input: $input) {
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

export default function useCreateConcertPosterMutation(
  options?: MutationHookOptions<
    { createConcertPoster: CreateConcertPosterData },
    { input: { imageURL: string; concertId: number } },
    DefaultContext,
    ApolloCache<any>
  >
) {
  return useMutation<
    {
      createConcertPoster: CreateConcertPosterData
    },
    {
      input: {
        imageURL: string
        concertId: number
      }
    }
  >(Mutation, options)
}
