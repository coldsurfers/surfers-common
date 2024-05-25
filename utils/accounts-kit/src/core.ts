/* eslint-disable class-methods-use-this */
import {
  PatchAccountsAuthcodeCtrlBodySchemaType,
  PatchAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsAuthcodeCtrlBodySchemaType,
  PostAccountsAuthcodeCtrlResponseSchemaType,
  PostAccountsSignInCtrlBodySchemaType,
  PostAccountsSignInCtrlResponseSchemaType,
} from '@coldsurfers/accounts-schema'
import HttpRequest from './lib/HttpRequest'
import {
  FetchConfirmAuthcodeReturnType,
  FetchSendAccountEmailReturnType,
  FetchSignInReturnType,
} from './types'

class AccountsKit {
  async fetchSignIn(
    body: PostAccountsSignInCtrlBodySchemaType
  ): Promise<FetchSignInReturnType> {
    const res = await new HttpRequest().request('/accounts/signin', {
      body: JSON.stringify(body),
      method: 'POST',
    })
    if (!res.ok) {
      return {
        success: false,
        error: {
          status: res.status,
        },
      }
    }
    return {
      success: true,
      data: (await res.json()) as PostAccountsSignInCtrlResponseSchemaType,
    }
  }

  async fetchSendAccountEmail(
    body: PostAccountsAuthcodeCtrlBodySchemaType
  ): Promise<FetchSendAccountEmailReturnType> {
    const res = await new HttpRequest().request('/accounts/authcode', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return {
        success: false,
        error: {
          status: res.status,
        },
      }
    }

    return {
      success: true,
      data: (await res.json()) as PostAccountsAuthcodeCtrlResponseSchemaType,
    }
  }

  async fetchConfirmAuthcode(
    body: PatchAccountsAuthcodeCtrlBodySchemaType
  ): Promise<FetchConfirmAuthcodeReturnType> {
    const res = await new HttpRequest().request('/accounts/authcode', {
      method: 'PATCH',
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return {
        success: false,
        error: {
          status: res.status,
        },
      }
    }

    return {
      success: true,
      data: (await res.json()) as PatchAccountsAuthcodeCtrlResponseSchemaType,
    }
  }
}

export default AccountsKit
