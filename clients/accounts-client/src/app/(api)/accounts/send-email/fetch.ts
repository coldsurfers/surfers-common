import { PostAccountsAuthcodeCtrlBodySchemaType } from '@coldsurfers/accounts-schema'
import accountsKit from '../../../../lib/accountsKit'

export type FetchSendAccountEmailVariables =
  PostAccountsAuthcodeCtrlBodySchemaType

export const fetchSendAccountEmail = (vars: FetchSendAccountEmailVariables) =>
  accountsKit.fetchSendAccountEmail(vars)

export type FetchSendAccountEmailReturnType = Awaited<
  ReturnType<typeof fetchSendAccountEmail>
>
