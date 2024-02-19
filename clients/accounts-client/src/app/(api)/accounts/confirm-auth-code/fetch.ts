import { PatchAccountsAuthcodeCtrlBodySchemaType } from '@coldsurfers/accounts-schema'
import accountsKit from '../../../../lib/accountsKit'

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

export type FetchConfirmAuthcodeReturnType = Awaited<
  ReturnType<typeof fetchConfirmAuthcode>
>
