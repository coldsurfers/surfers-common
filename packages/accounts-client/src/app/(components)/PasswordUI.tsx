'use client'

import {
  SetPasswordForm,
  SetPasswordFormRefHandle,
  Spinner,
} from '@coldsurfers/hotsurf'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import { useSignInStore } from '../(stores)/signInStore'
import { useFetchSignIn } from '../(react-query)/accounts/useFetchSignIn'

export const PasswordUI = ({ redirectURI }: { redirectURI: string }) => {
  const formRef = useRef<SetPasswordFormRefHandle>(null)
  const { email } = useSignInStore()
  const { mutate: mutateFetchSignIn, isPending: isPendingMutateFetchSignIn } =
    useFetchSignIn({
      onSuccess: ({ auth_token: authToken }) => {
        window.location.assign(
          `${redirectURI}?access_token=${authToken.access_token}&refresh_token=${authToken.refresh_token}`
        )
      },
    })
  const onPressSetPasswordButton = useCallback(async () => {
    const inputValue = formRef.current?.currentInputValue()
    if (!inputValue || !email) {
      throw Error('!!!')
    }
    mutateFetchSignIn({
      provider: 'coldsurf',
      email,
      password: inputValue.password,
      provider_token: '',
    })
  }, [email, mutateFetchSignIn])

  return (
    <FormLayout>
      <SetPasswordForm
        ref={formRef}
        formTitle="패스워드 설정하기"
        onPressSetPasswordButton={onPressSetPasswordButton}
      />
      {isPendingMutateFetchSignIn && <Spinner />}
    </FormLayout>
  )
}
