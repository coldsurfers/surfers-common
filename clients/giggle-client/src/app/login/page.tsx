'use client'

import { useCallback } from 'react'
import { signIn } from 'next-auth/react'
import styled from 'styled-components'
import LoginButton from '@/ui/Button/LoginButton'

const TITLE_MESSAGE = 'Log in to Giggle'
const LOGIN_PRE_MESSAGE = 'Continue with'
const EMAIL_LOGIN_MESSAGE = 'Log In'

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 32rem;
`

const TopTitle = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`

const GoogleLoginButton = styled(LoginButton)`
  width: 100%;
`

const Divider = styled.div`
  height: 1px;
  color: gray;
`

const EmailLoginForm = styled.form``
const EmailLoginSubmitButton = styled.button``
const EmailLoginForgotPasswordMessage = styled.p``

export default function LoginPage() {
  const onClickGoogleLoginButton = useCallback(() => signIn('google'), [])

  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      <LoginButton
        onClick={onClickGoogleLoginButton}
        fullWidth
      >{`${LOGIN_PRE_MESSAGE} Google`}</LoginButton>
      <Divider />
      <EmailLoginForm>
        <LoginButton
          withScale
          fullWidth
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
          {EMAIL_LOGIN_MESSAGE}
        </LoginButton>
      </EmailLoginForm>
    </Wrapper>
  )
}
