'use client'

import {
  SendEmailForm,
  SendEmailFormRefHandle,
  Spinner,
  Toast,
} from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { FormLayout } from './FormLayout'
import { useFetchSendAccountEmail } from '../(react-query)/accounts/useFetchSendAccountEmail'
import { useSignInStore } from '../(stores)/signInStore'

export const SendEmailUI = () => {
  const { setEmail } = useSignInStore()
  const [errorMessage, setErrorMessage] = useState('')
  const { push } = useRouter()
  const formRef = useRef<SendEmailFormRefHandle>(null)

  const {
    mutate: mutateFetchSendAccountEmail,
    isPending: isPendingMutateFetchSendAccountEmail,
  } = useFetchSendAccountEmail({
    onSuccess: (response) => {
      if (response.success) {
        push(`/signin/authcode`)
      } else {
        const { status } = response.error
        switch (status) {
          case 400:
            setErrorMessage('정확한 이메일을 입력해 주세요')
            break
          case 409:
            setErrorMessage('이미 인증된 이메일입니다')
            break
          default:
            break
        }
      }
    },
  })

  const onPressSendEmailButton = useCallback(() => {
    const inputValue = formRef.current?.currentInputValue()
    if (inputValue) {
      mutateFetchSendAccountEmail({
        email: inputValue.email,
      })
      setEmail(inputValue.email)
    }
  }, [mutateFetchSendAccountEmail, setEmail])

  return (
    <>
      <FormLayout>
        <SendEmailForm
          ref={formRef}
          formTitle="이메일 인증하기"
          onPressSendEmailButton={onPressSendEmailButton}
        />
        {isPendingMutateFetchSendAccountEmail && <Spinner />}
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
