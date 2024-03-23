'use client'

import log from '@/libs/log'
import LoginButton from '@/ui/Button/LoginButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'

const TITLE_MESSAGE = `Sign up to start finding venues`
const EMAIL_NEXT_MESSAGE = 'Next'

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
  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      <EmailForm onSubmit={handleSubmit(onSubmit)}>
        <TextInput type="email" placeholder="Email" {...register('email')} />
        <LoginButton withScale fullWidth style={{ marginTop: '1rem' }}>
          {EMAIL_NEXT_MESSAGE}
        </LoginButton>
      </EmailForm>
    </Wrapper>
  )
}
