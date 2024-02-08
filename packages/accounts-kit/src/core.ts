/* eslint-disable class-methods-use-this */
import {
  PostAccountsSignInCtrlBodySchemaType,
  PostAccountsSignInCtrlResponseSchemaType,
} from '@coldsurfers/accounts-schema'
import HttpRequest from './lib/HttpRequest'

class AccountsKit {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor() {}

  async fetchSignIn(
    body: PostAccountsSignInCtrlBodySchemaType
  ): Promise<PostAccountsSignInCtrlResponseSchemaType> {
    const res = await new HttpRequest().request('/accounts/signin', {
      body: JSON.stringify(body),
      method: 'POST',
    })
    return (await res.json()) as PostAccountsSignInCtrlResponseSchemaType
  }

  async fetchSendAccountEmail(body: { email: string }) {
    const res = await new HttpRequest().request('/accounts/authcode', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return (await res.json()) as {}
  }

  async fetchConfirmAuthcode(body: { authcode: string; email: string }) {
    const res = await new HttpRequest().request('/accounts/authcode', {
      method: 'PATCH',
      body: JSON.stringify(body),
    })

    return (await res.json()) as {}
  }
}

export default AccountsKit
