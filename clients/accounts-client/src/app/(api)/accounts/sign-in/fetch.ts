import { PostAccountsSignInCtrlBodySchemaType } from '@coldsurfers/accounts-schema'
import accountsKit from '../../../../lib/accountsKit'

export type FetchSignInVariables = PostAccountsSignInCtrlBodySchemaType

export const fetchSignIn = (vars: FetchSignInVariables) =>
  accountsKit.fetchSignIn(vars)

export type FetchSignInReturnType = Awaited<ReturnType<typeof fetchSignIn>>
