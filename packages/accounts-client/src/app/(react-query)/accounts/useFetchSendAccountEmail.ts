/* eslint-disable no-empty-pattern */

import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { PostAccountsAuthcodeCtrlBodySchemaType } from '@coldsurfers/accounts-schema'
import accountsKit from '../../../lib/accountsKit'

export type FetchSendAccountEmailVariables =
  PostAccountsAuthcodeCtrlBodySchemaType

export const fetchSendAccountEmail = (vars: FetchSendAccountEmailVariables) =>
  accountsKit.fetchSendAccountEmail(vars)

type FetchSendAccountEmailData = Awaited<
  ReturnType<typeof fetchSendAccountEmail>
>

export function useFetchSendAccountEmail({
  ...options
}: Omit<
  UseMutationOptions<
    FetchSendAccountEmailData,
    unknown,
    FetchSendAccountEmailVariables
  >,
  'mutationFn'
> = {}) {
  return useMutation<
    FetchSendAccountEmailData,
    unknown,
    FetchSendAccountEmailVariables
  >({
    ...options,
    mutationFn: fetchSendAccountEmail,
  })
}
