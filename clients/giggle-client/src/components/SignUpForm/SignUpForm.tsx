'use client'

import LoginButton from '@/ui/Button/LoginButton'
import { signIn } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSignUpStore } from '@/stores/SignUpStore'
import SignUpFormEmail from './components/SignUpFormEmail'
import SignUpFormPassword from './components/SignUpFormPassword'
import SignUpFormUserInfo from './components/SignUpFormUserInfo'

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
  const searchParams = useSearchParams()
  const { step, increaseStep, initializeStep, setErrorMessage, errorMessage } =
    useSignUpStore((state) => ({
      initializeStep: state.initializeStep,
      increaseStep: state.increaseStep,
      setErrorMessage: state.setErrorMessage,
      errorMessage: state.errorMessage,
      step: state.step,
    }))

  const onClickGoogleLoginButton = useCallback(() => signIn('google'), [])

  useEffect(() => {
    // detect initial search param of "step"
    const stepSearchParam = searchParams.get('step')
    if (`${step}` !== stepSearchParam) {
      initializeStep()
      return
    }
    // useEffectOnce intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // increase step
    if (typeof step !== 'number') return
    router.push(`/signup?step=${step}`)
  }, [router, step])

  useEffect(() => {
    // initialize step
    if (step === null) {
      router.replace('/signup')
    }
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
          onValidationSuccess={() => {
            increaseStep()
          }}
          onValidationError={() => {
            setErrorMessage(
              'Password should have at least one letter and number. Min 8, Max 32'
            )
          }}
          onPasswordInputChange={(e) => {
            setErrorMessage('')
          }}
        />
      )}
      {step === 2 && (
        <SignUpFormUserInfo
          onValidationSuccess={() => {
            increaseStep()
          }}
          onValidationError={() => {
            setErrorMessage('Invalid username')
          }}
          onUsernameInputChange={(e) => {
            setErrorMessage('')
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
