'use client'

import log from '@/libs/log'
import LoginButton from '@/ui/Button/LoginButton'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'

const TITLE_MESSAGE = `Sign up to start finding venues`
const EMAIL_NEXT_MESSAGE = 'Next'
const LOGIN_PRE_MESSAGE = 'Sign up with'

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 32rem;
`

const TopTitle = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`

const EmailForm = styled.form``

const TextInput = styled.input`
  padding: 1rem;
  border-radius: 3px;
  border: 1px solid black;
  width: 100%;
  font-size: 0.85rem;
  font-weight: 600;
`

const Divider = styled.div`
  height: 1px;
  background: black;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const EmailNextButton = styled(LoginButton)`
  margin-top: 1rem;
`

type Inputs = {
  email: string
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => log(data)
  const onClickGoogleLoginButton = useCallback(() => signIn('google'), [])
  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      <EmailForm onSubmit={handleSubmit(onSubmit)}>
        <TextInput type="email" placeholder="Email" {...register('email')} />
        <EmailNextButton withScale fullWidth>
          {EMAIL_NEXT_MESSAGE}
        </EmailNextButton>
      </EmailForm>
      <Divider />
      <LoginButton
        onClick={onClickGoogleLoginButton}
        fullWidth
      >{`${LOGIN_PRE_MESSAGE} Google`}</LoginButton>
    </Wrapper>
  )
}
