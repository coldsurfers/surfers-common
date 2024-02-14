import { PostAccountsSignInCtrlBodySchemaType } from '@coldsurfers/accounts-schema'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import accountsKit from '../../../lib/accountsKit'

export type FetchSignInVariables = PostAccountsSignInCtrlBodySchemaType

export const fetchSignIn = (vars: FetchSignInVariables) =>
  accountsKit.fetchSignIn(vars)

type FetchSignInData = Awaited<ReturnType<typeof fetchSignIn>>

export function useFetchSignIn({
  ...options
}: Omit<
  UseMutationOptions<FetchSignInData, unknown, FetchSignInVariables>,
  'mutationFn'
> = {}) {
  return useMutation<FetchSignInData, unknown, FetchSignInVariables>({
    ...options,
    mutationFn: fetchSignIn,
  })
}
