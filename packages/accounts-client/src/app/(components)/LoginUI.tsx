'use client'

import { LoginForm, LoginFormRefHandle } from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import accountsKit from '../../lib/accountsKit'

export function LoginUI({ redirectURI }: { redirectURI: string }) {
  const formRef = useRef<LoginFormRefHandle>(null)
  const { push } = useRouter()
  const onPressLoginButton = useCallback(async () => {
    try {
      const inputValue = formRef.current?.currentInputValue()
      if (!inputValue) {
        throw Error('!!!')
      }
      const result = await accountsKit.fetchSignIn({
        provider: 'coldsurf',
        provider_token: '',
        email: inputValue.email,
        password: inputValue.password,
      })
      const { auth_token: authToken } = result
      window.location.assign(
        `${redirectURI}?access_token=${authToken.access_token}&refresh_token=${authToken.refresh_token}`
      )
    } catch (e) {
      console.error(e)
    }
  }, [redirectURI])

  const onPressCreateAccountButtonUI = useCallback(() => {
    push(`/signin/email?after=${redirectURI}`)
  }, [push, redirectURI])

  return (
    <FormLayout>
      <LoginForm
        ref={formRef}
        formTitle="ColdSurf Accounts"
        onPressLoginButton={onPressLoginButton}
        onPressCreateAccountButtonUI={onPressCreateAccountButtonUI}
      />
    </FormLayout>
  )
}
