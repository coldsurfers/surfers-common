'use client'

import { SendEmailForm, SendEmailFormRefHandle } from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import accountsKit from '../../lib/accountsKit'
import { useSignInStore } from '../(stores)/signInStore'

export const SendEmailUI = () => {
  const { setEmail } = useSignInStore()
  const formRef = useRef<SendEmailFormRefHandle>(null)
  const { push } = useRouter()
  const onPressSendEmailButton = useCallback(async () => {
    const inputValue = formRef.current?.currentInputValue()
    if (inputValue) {
      try {
        await accountsKit.fetchSendAccountEmail({
          email: inputValue.email,
        })
        setEmail(inputValue.email)
        push(`/signin/authcode`)
      } catch (e) {
        console.error(e)
      }
    }
  }, [push, setEmail])

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
