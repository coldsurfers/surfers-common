import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationHookOptions,
  useMutation,
} from '@apollo/client'
import { CreateConcertData, CreateConcertInput } from '../gql/schema'

const Mutation = gql`
  mutation CreateConcert($input: CreateConcertInput!) {
    createConcert(input: $input) {
      ... on Concert {
        id
        artist
        title
        location
        date
        posters {
          id
          imageURL
        }
        tickets {
          id
          openDate
          seller
          sellingURL
          ticketPrices {
            id
            title
            price
            priceCurrency
          }
        }
        createdAt
        updatedAt
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useCreateConcertMutation(
  options?: MutationHookOptions<
    { createConcert: CreateConcertData },
    {
      input: CreateConcertInput
    },
    DefaultContext,
    ApolloCache<any>
  >
) {
  return useMutation<
    {
      createConcert: CreateConcertData
    },
    {
      input: CreateConcertInput
    }
  >(Mutation, options)
}
