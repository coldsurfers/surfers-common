'use client'

import {
  EmailAuthCodeForm,
  EmailAuthCodeFormRefHandle,
} from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import { useSignInStore } from '../(stores)/signInStore'
import { useFetchConfirmAuthcode } from '../(react-query)/accounts/useFetchConfirmAuthCode'

export const AuthcodeUI = () => {
  const { email } = useSignInStore()
  const { push } = useRouter()
  const { mutate: mutateFetchConfirmAuthcode } = useFetchConfirmAuthcode({
    onSuccess: () => {
      push(`/signin/password`)
    },
  })
  const formRef = useRef<EmailAuthCodeFormRefHandle>(null)
  const onPressAuthCodeButton = useCallback(async () => {
    const inputValue = formRef.current?.currentInputValue()
    if (inputValue && !!email) {
      mutateFetchConfirmAuthcode({
        authcode: inputValue.authcode,
        email,
      })
    }
  }, [email, mutateFetchConfirmAuthcode])

  return (
    <FormLayout>
      <EmailAuthCodeForm
        ref={formRef}
        formTitle="인증번호"
        onPressAuthCodeButton={onPressAuthCodeButton}
      />
    </FormLayout>
  )
}
