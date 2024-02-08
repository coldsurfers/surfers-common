'use client'

import { PasswordUI } from '../../(components)/PasswordUI'
import { useAccountsAppStore } from '../../(stores)/accountsAppStore'
import { CommonAccountErrorCode } from '../../(types)/CommonAccountErrorCode'

const SignInPasswordPage = () => {
  const { redirectURI } = useAccountsAppStore()
  if (!redirectURI) {
    throw Error(CommonAccountErrorCode.REDIRECT_URI_NOT_EXISTING)
  }
  return <PasswordUI redirectURI={redirectURI} />
}

export default SignInPasswordPage
