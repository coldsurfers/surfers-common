import { gql, QueryHookOptions, useQuery } from '@apollo/client'
import { ConcertData } from '../gql/schema'

export const CONCERT_QUERY = gql`
  query Concert($concertId: Int!) {
    concert(id: $concertId) {
      ... on Concert {
        id
        artist
        title
        location
        date
        concertCategory {
          id
          title
        }
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

export default function useConcertQuery(
  options: QueryHookOptions<
    { concert: ConcertData },
    {
      concertId: number
    }
  >
) {
  return useQuery<
    { concert: ConcertData },
    {
      concertId: number
    }
  >(CONCERT_QUERY, options)
}
