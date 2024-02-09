import {
  PatchAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsSignInCtrlResponseSchemaType,
} from '@coldsurfers/accounts-schema'

export type CommonFetchError = {
  status: number
}

export type FetchSignInReturnType =
  | {
      success: false
      error: CommonFetchError
    }
  | {
      success: true
      data: PostAccountsSignInCtrlResponseSchemaType
    }

export type FetchSendAccountEmailReturnType =
  | {
      success: false
      error: CommonFetchError
    }
  | {
      success: true
      data: PostAccountsAuthcodeCtrlResponseSchemaType
    }

export type FetchConfirmAuthcodeReturnType =
  | {
      success: false
      error: CommonFetchError
    }
  | {
      success: true
      data: PatchAccountsAuthcodeCtrlResponseSchemaType
    }
