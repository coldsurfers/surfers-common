import { gql, useMutation } from '@apollo/client'
import { EmailAuthRequest } from '../gql/schema'

const Mutation = gql`
  mutation CreateEmailAuthRequest($input: CreateEmailAuthRequestInput!) {
    createEmailAuthRequest(input: $input) {
      authenticated
      createdAt
      email
      id
    }
  }
`

export default function useCreateEmailAuthRequestMutation() {
  return useMutation<
    {
      createEmailAuthRequest: EmailAuthRequest
    },
    {
      input: {
        email: string
      }
    }
  >(Mutation)
}
