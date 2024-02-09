'use client'

import { useEffect } from 'react'
import { PasswordUI } from '../../(components)/PasswordUI'
import { useAccountsAppStore } from '../../(stores)/accountsAppStore'
import { CommonAccountErrorCode } from '../../(types)/CommonAccountErrorCode'

const SignInPasswordPage = () => {
  const { redirectURI } = useAccountsAppStore()
  useEffect(() => {
    if (!redirectURI) {
      throw Error(CommonAccountErrorCode.REDIRECT_URI_NOT_EXISTING)
    }
  }, [redirectURI])

  if (!redirectURI) {
    return null
  }
  return <PasswordUI redirectURI={redirectURI} />
}

export default SignInPasswordPage
