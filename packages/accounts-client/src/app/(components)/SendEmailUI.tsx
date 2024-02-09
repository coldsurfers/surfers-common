'use client'

import { SendEmailForm, SendEmailFormRefHandle } from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import { useSignInStore } from '../(stores)/signInStore'
import { useFetchSendAccountEmail } from '../(react-query)/accounts/useFetchSendAccountEmail'

export const SendEmailUI = () => {
  const { setEmail } = useSignInStore()
  const { push } = useRouter()
  const { mutate: mutateFetchSendAccountEmail } = useFetchSendAccountEmail({
    onSuccess: () => {
      push(`/signin/authcode`)
    },
  })
  const formRef = useRef<SendEmailFormRefHandle>(null)
  const onPressSendEmailButton = useCallback(async () => {
    const inputValue = formRef.current?.currentInputValue()
    if (inputValue) {
      mutateFetchSendAccountEmail({
        email: inputValue.email,
      })
      setEmail(inputValue.email)
    }
  }, [mutateFetchSendAccountEmail, setEmail])

  return (
    <FormLayout>
      <SendEmailForm
        ref={formRef}
        formTitle="이메일 인증하기"
        onPressSendEmailButton={onPressSendEmailButton}
      />
    </FormLayout>
  )
}
