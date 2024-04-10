'use client'

import LoginButton from '@/ui/Button/LoginButton'
import { signIn } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useSignUpStore } from '@/stores/SignUpStore'
import SignUpFormEmail from './components/SignUpFormEmail'
import SignUpFormPassword from './components/SignUpFormPassword'
import { z } from 'zod'

const TITLE_MESSAGE = `Sign up to start finding venues`

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

const Divider = styled.div`
  height: 1px;
  background: black;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

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

  const onClickGoogleLoginButton = useCallback(() => signIn('google'), [])

  useEffect(() => {
    if (typeof step !== 'number') return
    router.push(`/signup?step=${step}`)
  }, [router, step])

  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      {step === null && (
        <SignUpFormEmail
          onValidationSuccess={() => {
            increaseStep()
          }}
          onValidationError={() => {
            setErrorMessage('Invalid Email')
          }}
          onEmailInputChange={() => {
            setErrorMessage('')
          }}
        />
      )}
      {step === 1 && (
        <SignUpFormPassword
          onPasswordInputChange={(e) => {
            // https://regexr.com/3bfsi
            // min 8, max 32, at least one letter and one number
            const passwordSchema = z
              .string()
              .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,32}$/)
            const validation = passwordSchema.safeParse(e.target.value)
            if (!validation.success) {
              console.log(validation.error)
            }
          }}
        />
      )}
      <Divider />
      <LoginButton
        onClick={onClickGoogleLoginButton}
        fullWidth
      >{`${LOGIN_PRE_MESSAGE} Google`}</LoginButton>
      {errorMessage}
    </Wrapper>
  )
}
