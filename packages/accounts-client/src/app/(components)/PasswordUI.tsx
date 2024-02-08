'use client'

import { SetPasswordForm, SetPasswordFormRefHandle } from '@coldsurfers/hotsurf'
import { useCallback, useRef } from 'react'
import { FormLayout } from './FormLayout'
import accountsKit from '../../lib/accountsKit'
import { useSignInStore } from '../(stores)/signInStore'

export const PasswordUI = ({ redirectURI }: { redirectURI: string }) => {
  const formRef = useRef<SetPasswordFormRefHandle>(null)
  const { email } = useSignInStore()
  const onPressSetPasswordButton = useCallback(async () => {
    try {
      const inputValue = formRef.current?.currentInputValue()
      if (!inputValue || !email) {
        throw Error('!!!')
      }
      const result = await accountsKit.fetchSignIn({
        provider: 'coldsurf',
        email,
        password: inputValue.password,
        provider_token: '',
      })
      const { auth_token: authToken } = result
      window.location.assign(
        `${redirectURI}?access_token=${authToken.access_token}&refresh_token=${authToken.refresh_token}`
      )
    } catch (e) {
      console.error(e)
    }
  }, [redirectURI, email])

  return (
    <FormLayout>
      <SetPasswordForm
        ref={formRef}
        formTitle="패스워드 설정하기"
        onPressSetPasswordButton={onPressSetPasswordButton}
      />
    </FormLayout>
  )
}
