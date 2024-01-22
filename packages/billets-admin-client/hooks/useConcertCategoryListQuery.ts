import {
  gql,
  OperationVariables,
  QueryHookOptions,
  useQuery,
} from '@apollo/client'
import { ConcertCategoryListData } from '../gql/schema'

export const CONCERT_CATEGORY_LIST_QUERY = gql`
  query ConcertCategoryList {
    concertCategoryList {
      ... on ConcertCategoryList {
        list {
          id
          title
        }
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useConcertCategoryListQuery(
  options?: QueryHookOptions<
    { concertCategoryList: ConcertCategoryListData },
    OperationVariables
  >
) {
  return useQuery<{
    concertCategoryList: ConcertCategoryListData
  }>(CONCERT_CATEGORY_LIST_QUERY, options)
}
