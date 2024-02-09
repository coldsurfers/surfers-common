'use client'

import {
  LoginForm,
  LoginFormRefHandle,
  Spinner,
  Toast,
} from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { FormLayout } from './FormLayout'
import { useFetchSignIn } from '../(react-query)/accounts/useFetchSignIn'

export function LoginUI({ redirectURI }: { redirectURI: string }) {
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<LoginFormRefHandle>(null)
  const { mutate: mutateFetchSignIn, isPending: isPendingMutateFetchSignIn } =
    useFetchSignIn({
      onSuccess: (data) => {
        if (data.success) {
          const { auth_token: authToken } = data.data
          window.location.assign(
            `${redirectURI}?access_token=${authToken.access_token}&refresh_token=${authToken.refresh_token}`
          )
        } else {
          const { status } = data.error
          switch (status) {
            case 400:
            case 404:
              setErrorMessage('이메일 혹은 비밀번호가 일치하지 않습니다')
              break
            case 403:
              setErrorMessage('생성되지 않은 계정입니다')
              break
            default:
              break
          }
        }
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
    <>
      <FormLayout>
        <LoginForm
          ref={formRef}
          formTitle="ColdSurf Accounts"
          onPressLoginButton={onPressLoginButton}
          onPressCreateAccountButtonUI={onPressCreateAccountButtonUI}
        />
        {isPendingMutateFetchSignIn && <Spinner />}
      </FormLayout>
      {errorMessage && (
        <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0 }}>
          <Toast
            type="error"
            message={errorMessage}
            onPress={() => setErrorMessage('')}
          />
        </View>
      )}
    </>
  )
}
