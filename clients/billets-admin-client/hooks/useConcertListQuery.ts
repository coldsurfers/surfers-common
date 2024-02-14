import { gql, QueryHookOptions, useQuery } from '@apollo/client'
import { ConcertListData } from '../gql/schema'

export const CONCERT_LIST_QUERY = gql`
  query ConcertList($page: Int!, $limit: Int!, $orderBy: ConcertListOrderBy!) {
    concertList(page: $page, limit: $limit, orderBy: $orderBy) {
      ... on ConcertListWithPagination {
        list {
          list {
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
        }
        pagination {
          current
          count
        }
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useConcertListQuery(
  options?: QueryHookOptions<
    { concertList: ConcertListData },
    {
      page: number
      limit: number
      orderBy: {
        createdAt: 'asc' | 'desc'
      }
    }
  >
) {
  return useQuery<
    {
      concertList: ConcertListData
    },
    {
      page: number
      limit: number
      orderBy: {
        createdAt: 'asc' | 'desc'
      }
    }
  >(CONCERT_LIST_QUERY, options)
}
