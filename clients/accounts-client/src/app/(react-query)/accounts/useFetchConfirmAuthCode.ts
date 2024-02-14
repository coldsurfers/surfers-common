import { PatchAccountsAuthcodeCtrlBodySchemaType } from '@coldsurfers/accounts-schema'
import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import accountsKit from '../../../lib/accountsKit'

export type FetchConfirmAuthcodeVariables =
  PatchAccountsAuthcodeCtrlBodySchemaType

export const fetchConfirmAuthcode = ({
  authcode,
  email,
}: FetchConfirmAuthcodeVariables) =>
  accountsKit.fetchConfirmAuthcode({
    authcode,
    email,
  })

type FetchConfirmAuthcodeData = Awaited<ReturnType<typeof fetchConfirmAuthcode>>

export function useFetchConfirmAuthcode({
  ...options
}: Omit<
  UseMutationOptions<
    FetchConfirmAuthcodeData,
    unknown,
    FetchConfirmAuthcodeVariables
  >,
  'mutationFn'
> = {}) {
  return useMutation<
    FetchConfirmAuthcodeData,
    unknown,
    FetchConfirmAuthcodeVariables
  >({
    ...options,
    mutationFn: fetchConfirmAuthcode,
  })
}
