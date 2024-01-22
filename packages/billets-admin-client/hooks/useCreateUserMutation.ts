import { gql, useMutation } from '@apollo/client'
import { CreateUserData } from '../gql/schema'

const Mutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ... on User {
        createdAt
        email
        id
        isAdmin
      }
      ... on HttpError {
        code
        message
      }
    }
  }
`

export default function useCreateUserMutation() {
  return useMutation<
    {
      createUser: CreateUserData
    },
    {
      input: {
        email: string
        password: string
        passwordConfirm: string
      }
    }
  >(Mutation)
}
