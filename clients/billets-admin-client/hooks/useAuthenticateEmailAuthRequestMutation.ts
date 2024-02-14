import { gql, useMutation } from '@apollo/client'
import { AuthenticateEmailAuthRequestData } from '../gql/schema'

const Mutation = gql`
  mutation AuthenticateEmailAuthRequest(
    $input: AuthenticateEmailAuthRequestInput!
  ) {
    authenticateEmailAuthRequest(input: $input) {
      ... on EmailAuthRequest {
        authenticated
        createdAt
        email
        id
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useAuthenticateEmailAuthRequestMutation() {
  return useMutation<
    {
      authenticateEmailAuthRequest: AuthenticateEmailAuthRequestData
    },
    {
      input: {
        email: string
        authcode: string
      }
    }
  >(Mutation)
}
