'use client'

import {
  EmailAuthCodeForm,
  EmailAuthCodeFormRefHandle,
  Spinner,
  Toast,
} from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { FormLayout } from './FormLayout'
import { useFetchConfirmAuthcode } from '../(react-query)/accounts/useFetchConfirmAuthCode'
import { useSignInStore } from '../(stores)/signInStore'

export const AuthcodeUI = () => {
  const email = useSignInStore((state) => state.email)
  const [errorMessage, setErrorMessage] = useState('')
  const { push } = useRouter()
  const {
    mutate: mutateFetchConfirmAuthcode,
    isPending: isPendingFetchConfirmAuthcode,
  } = useFetchConfirmAuthcode({
    onSuccess: (response) => {
      if (response.success) {
        push(`/signin/password`)
      } else {
        const { status } = response.error
        switch (status) {
          case 400:
            setErrorMessage('정확한 인증코드를 입력해 주세요')
            break
          case 401:
            setErrorMessage('인증코드가 일치하지 않습니다')
            break
          default:
            break
        }
      }
    },
  })
  const formRef = useRef<EmailAuthCodeFormRefHandle>(null)
  const onPressAuthCodeButton = useCallback(() => {
    const inputValue = formRef.current?.currentInputValue()
    if (inputValue && !!email) {
      mutateFetchConfirmAuthcode({
        authcode: inputValue.authcode,
        email,
      })
    }
  }, [email, mutateFetchConfirmAuthcode])

  return (
    <>
      <FormLayout>
        <EmailAuthCodeForm
          ref={formRef}
          formTitle="인증번호"
          onPressAuthCodeButton={onPressAuthCodeButton}
        />
        {isPendingFetchConfirmAuthcode && <Spinner />}
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
