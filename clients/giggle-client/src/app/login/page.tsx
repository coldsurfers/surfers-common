'use client'

import { useCallback } from 'react'
import { signIn } from 'next-auth/react'
import styled from 'styled-components'
import LoginButton from '@/ui/Button/LoginButton'
import Link from 'next/link'

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

const Divider = styled.div`
  height: 1px;
  background: black;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const EmailLoginForm = styled.form``
const EmailLoginForgotPasswordMessage = styled.p`
  text-decoration: underline;
`

const TextInput = styled.input`
  padding: 1rem;
  border-radius: 3px;
  border: 1px solid black;
  width: 100%;
  font-size: 0.85rem;
  font-weight: 600;
`

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
        <TextInput placeholder="Email" />
        <TextInput
          placeholder="Password"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
        />
        <LoginButton withScale fullWidth style={{ marginBottom: '1rem' }}>
          {EMAIL_LOGIN_MESSAGE}
        </LoginButton>
      </EmailLoginForm>
      <Link href="/password-reset">
        <EmailLoginForgotPasswordMessage>
          Forgot your password?
        </EmailLoginForgotPasswordMessage>
      </Link>
    </Wrapper>
  )
}
