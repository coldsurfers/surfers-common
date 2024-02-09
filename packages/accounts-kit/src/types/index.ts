import {
  PatchAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsSignInCtrlResponseSchemaType,
} from '@coldsurfers/accounts-schema'

export type CommonFetchError = {
  status: number
}

export type FetchSignInReturnType = Promise<
  | {
      success: false
      error: CommonFetchError
    }
  | {
      success: true
      data: PostAccountsSignInCtrlResponseSchemaType
    }
>

export type FetchSendAccountEmailReturnType = Promise<
  | {
      success: false
      error: CommonFetchError
    }
  | {
      success: true
      data: PostAccountsAuthcodeCtrlResponseSchemaType
    }
>

export type FetchConfirmAuthcodeReturnType = Promise<
  | {
      success: false
      error: CommonFetchError
    }
  | {
      success: true
      data: PatchAccountsAuthcodeCtrlResponseSchemaType
    }
>
