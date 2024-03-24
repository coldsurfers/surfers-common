'use client'

import { useCallback } from 'react'
import styled from 'styled-components'
import LoginButton from '@/ui/Button/LoginButton'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import log from '@/libs/log'
import { BRANDING_NAME } from '@/libs/constants'

const TITLE_MESSAGE = `Log in to ${BRANDING_NAME}`
const LOGIN_PRE_MESSAGE = 'Continue with'
const EMAIL_LOGIN_MESSAGE = 'Log In'
const DONT_HAVE_AN_ACCOUNT_MESSAGE = `Don't have an account?`
const SIGN_UP_MESSAGE = 'Sign up for ColdSurf'

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
const EmailLoginText = styled.p``
const EmailLoginUnderlineText = styled.p`
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

type Inputs = {
  email: string
  password: string
}

export default function LoginForm({ login }: { login: () => Promise<void> }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => log(data)
  const onClickGoogleLoginButton = useCallback(async () => {
    await login()
  }, [login])

  if (process.env.NODE_ENV === 'development') {
    log(watch('email')) // watch input value by passing the name of it
    log(watch('password')) // watch input value by passing the name of it
  }

  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      <LoginButton
        onClick={onClickGoogleLoginButton}
        fullWidth
      >{`${LOGIN_PRE_MESSAGE} Google`}</LoginButton>
      <Divider />
      <EmailLoginForm onSubmit={handleSubmit(onSubmit)}>
        <TextInput type="email" placeholder="Email" {...register('email')} />
        <TextInput
          placeholder="Password"
          {...register('password')}
          type="password"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
        />
        <LoginButton withScale fullWidth style={{ marginBottom: '1rem' }}>
          {EMAIL_LOGIN_MESSAGE}
        </LoginButton>
      </EmailLoginForm>
      <Link href="/password-reset">
        <EmailLoginUnderlineText>Forgot your password?</EmailLoginUnderlineText>
      </Link>
      <Divider />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <EmailLoginText>{DONT_HAVE_AN_ACCOUNT_MESSAGE}</EmailLoginText>
        <Link href="/signup">
          <EmailLoginUnderlineText style={{ marginLeft: '1rem' }}>
            {SIGN_UP_MESSAGE}
          </EmailLoginUnderlineText>
        </Link>
      </div>
    </Wrapper>
  )
}
