import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationHookOptions,
  useMutation,
} from '@apollo/client'
import { LoginData } from '../gql/schema'

const Mutation = gql`
  mutation Mutation($input: LoginInput!) {
    login(input: $input) {
      ... on UserWithToken {
        token
        user {
          createdAt
          email
          id
          isAdmin
        }
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useLoginMutation(
  options?: MutationHookOptions<
    { login: LoginData },
    { input: { email: string; password: string } },
    DefaultContext,
    ApolloCache<any>
  >
) {
  return useMutation<
    {
      login: LoginData
    },
    {
      input: {
        email: string
        password: string
      }
    }
  >(Mutation, options)
}
