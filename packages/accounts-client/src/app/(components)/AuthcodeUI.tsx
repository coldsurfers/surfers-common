'use client'

import {
  EmailAuthCodeForm,
  EmailAuthCodeFormRefHandle,
} from '@coldsurfers/hotsurf'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import accountsKit from '../../lib/accountsKit'
import { useSignInStore } from '../(stores)/signInStore'

export const AuthcodeUI = () => {
  const { email } = useSignInStore()
  const { push } = useRouter()
  const formRef = useRef<EmailAuthCodeFormRefHandle>(null)
  const onPressAuthCodeButton = useCallback(async () => {
    const inputValue = formRef.current?.currentInputValue()
    if (inputValue && !!email) {
      try {
        await accountsKit.fetchConfirmAuthcode({
          authcode: inputValue.authcode,
          email,
        })
        push(`/signin/password`)
      } catch (e) {
        console.error(e)
      }
    }
  }, [email, push])

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
