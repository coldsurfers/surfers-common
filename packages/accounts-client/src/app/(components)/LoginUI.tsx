'use client'

import { LoginForm, LoginFormRefHandle, Spinner } from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import { useFetchSignIn } from '../(react-query)/accounts/useFetchSignIn'

export function LoginUI({ redirectURI }: { redirectURI: string }) {
  const formRef = useRef<LoginFormRefHandle>(null)
  const { mutate: mutateFetchSignIn, isPending: isPendingMutateFetchSignIn } =
    useFetchSignIn({
      onSuccess: ({ auth_token: authToken }) => {
        window.location.assign(
          `${redirectURI}?access_token=${authToken.access_token}&refresh_token=${authToken.refresh_token}`
        )
      },
    })
  const { push } = useRouter()
  const onPressLoginButton = useCallback(async () => {
    const inputValue = formRef.current?.currentInputValue()
    if (!inputValue) {
      throw Error('!!!')
    }
    mutateFetchSignIn({
      provider: 'coldsurf',
      provider_token: '',
      email: inputValue.email,
      password: inputValue.password,
    })
  }, [mutateFetchSignIn])

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
      {isPendingMutateFetchSignIn && <Spinner />}
    </FormLayout>
  )
}
