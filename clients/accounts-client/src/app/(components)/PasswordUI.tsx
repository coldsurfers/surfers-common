'use client'

import {
  SetPasswordForm,
  SetPasswordFormRefHandle,
  Spinner,
  Toast,
} from '@coldsurfers/hotsurf'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { FormLayout } from './FormLayout'
import { useSendEmailStore } from '../(services)/send-email'
import { useFetchSignIn } from '../(api)/accounts/sign-in/query'
import { useAccountsAppStore } from '../(services)/accounts-app'
import { CommonAccountErrorCode } from '../(types)/CommonAccountErrorCode'
import { REDIRECT_TYPE } from '../../lib/constants'
import { createRedirectURI } from '../../lib/utils'

export const PasswordUI = () => {
  const redirectURI = useAccountsAppStore((state) => state.redirectURI)
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<SetPasswordFormRefHandle>(null)
  const email = useSendEmailStore((state) => state.email)
  const { mutate: mutateFetchSignIn, isPending: isPendingMutateFetchSignIn } =
    useFetchSignIn({
      onSuccess: (response) => {
        if (response.success) {
          const { auth_token: authToken } = response.data
          if (!redirectURI) {
            throw Error(CommonAccountErrorCode.REDIRECT_URI_NOT_EXISTING)
          }
          window.location.assign(
            createRedirectURI({
              redirectURI,
              accessToken: authToken.access_token,
              refreshToken: authToken.refresh_token,
              redirectType: REDIRECT_TYPE.SIGN_UP,
            })
          )
        } else {
          const { status } = response.error
          switch (status) {
            case 400:
              setErrorMessage('8자 이상 32자 이하의 패스워드를 입력해주세요')
              break
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
    <>
      <FormLayout>
        <SetPasswordForm
          ref={formRef}
          formTitle="패스워드 설정하기"
          onPressSetPasswordButton={onPressSetPasswordButton}
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
