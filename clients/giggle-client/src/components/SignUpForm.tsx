'use client'

import LoginButton from '@/ui/Button/LoginButton'
import { signIn } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useSignUpStore } from '@/stores/SignUpStore'
import { z } from 'zod'

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

const InputsEmailSchema = z.string().email()

type Inputs = {
  email: z.TypeOf<typeof InputsEmailSchema>
}

export default function SignUpForm() {
  const router = useRouter()
  const { increaseStep, decreaseStep, setErrorMessage } = useSignUpStore(
    (state) => ({
      increaseStep: state.increaseStep,
      decreaseStep: state.decreaseStep,
      setErrorMessage: state.setErrorMessage,
    })
  )
  const step = useSignUpStore((state) => state.step)
  const errorMessage = useSignUpStore((state) => state.errorMessage)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const validation = InputsEmailSchema.safeParse(data.email)
      if (!validation.success) {
        setErrorMessage('Invalid Email')
        return
      }
      // TODO: go to password setup page
      increaseStep()
    },
    [increaseStep, setErrorMessage]
  )
  const onClickGoogleLoginButton = useCallback(() => signIn('google'), [])

  useEffect(() => {
    router.push(`/signup?step=${step}`)
  }, [router, step])

  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      <EmailForm onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          placeholder="Email"
          {...register('email', {
            onChange: (e) => {
              setErrorMessage('')
            },
          })}
        />
        <EmailNextButton withScale fullWidth>
          {EMAIL_NEXT_MESSAGE}
        </EmailNextButton>
      </EmailForm>
      <Divider />
      <LoginButton
        onClick={onClickGoogleLoginButton}
        fullWidth
      >{`${LOGIN_PRE_MESSAGE} Google`}</LoginButton>
      {errorMessage}
    </Wrapper>
  )
}
