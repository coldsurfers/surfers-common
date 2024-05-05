'use client'

import { startTransition, useCallback, useState } from 'react'
import styled from 'styled-components'
import LoginButton from '@/ui/Button/LoginButton'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import log from '@/libs/log'
import { BRANDING_NAME } from '@/libs/constants'
import { signIn } from 'next-auth/react'
import { emailSignInAction } from '../../actions/login'
import * as ReactAuth from 'next-auth/react'
import Button from './base/Button'

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
  margin-top: 1rem;
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

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('')
  const googleSignIn = useCallback(async () => {
    await signIn('google', { redirect: false })
  }, [])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    startTransition(() => {
      emailSignInAction({
        ...data,
        provider: 'credentials',
      })
        .then((result) => {
          if (result.isError) {
            setErrorMessage('Error Has Been Occurred')
            return
          }
          log('success!')
          ReactAuth.signIn('credentials', { redirect: true, ...data })
        })
        .catch((e) => {
          log(`email sign in error ${e}`)
        })
    })
  }

  const onClickGoogleLoginButton = useCallback(googleSignIn, [googleSignIn])

  if (process.env.NODE_ENV === 'development') {
    log(watch('email')) // watch input value by passing the name of it
    log(watch('password')) // watch input value by passing the name of it
  }

  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      <Button
        fullWidth
        onClick={onClickGoogleLoginButton}
      >{`${LOGIN_PRE_MESSAGE} Google`}</Button>
      <Divider />
      <EmailLoginForm onSubmit={handleSubmit(onSubmit)}>
        <TextInput type="email" placeholder="Email" {...register('email')} />
        <TextInput
          placeholder="Password"
          {...register('password')}
          type="password"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
        />
        <Button fullWidth additionalStyles={{ marginBottom: '1rem' }}>
          {EMAIL_LOGIN_MESSAGE}
        </Button>
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
      {errorMessage && errorMessage}
    </Wrapper>
  )
}
