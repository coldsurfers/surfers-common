import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationHookOptions,
  useMutation,
} from '@apollo/client'
import { UpdateConcertData, UpdateConcertInput } from '../gql/schema'

export const UPDATE_CONCERT_POSTER_MUTATION = gql`
  mutation UpdateConcert($input: UpdateConcertInput!) {
    updateConcert(input: $input) {
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

export default function useUpdateConcertMutation(
  options?: MutationHookOptions<
    { updateConcert: UpdateConcertData },
    {
      input: UpdateConcertInput
    },
    DefaultContext,
    ApolloCache<any>
  >
) {
  return useMutation<
    {
      updateConcert: UpdateConcertData
    },
    {
      input: UpdateConcertInput
    }
  >(UPDATE_CONCERT_POSTER_MUTATION, options)
}
