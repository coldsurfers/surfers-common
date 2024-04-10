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
import SignUpFormTermsAndConditions from './components/SignUpFormTermsAndConditions'

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
  const stepSearchParam = searchParams.get('step')
  const { setErrorMessage, errorMessage } = useSignUpStore((state) => ({
    errorMessage: state.errorMessage,
    setErrorMessage: state.setErrorMessage,
  }))

  const { email, password, username, termsAndConditions } = useSignUpStore(
    (state) => ({
      email: state.email,
      password: state.password,
      username: state.username,
      termsAndConditions: state.termsAndConditions,
    })
  )
  const { setEmail, setPassword, setUsername, setTermsAndConditions } =
    useSignUpStore((state) => ({
      setEmail: state.setEmail,
      setPassword: state.setPassword,
      setUsername: state.setUsername,
      setTermsAndConditions: state.setTermsAndConditions,
    }))

  const onClickGoogleLoginButton = useCallback(() => signIn('google'), [])

  useEffect(() => {
    const isValidStepSearchParam =
      stepSearchParam !== null && !isNaN(+stepSearchParam)
    if (!isValidStepSearchParam) {
      router.replace('/signup')
      return
    }
    const step = +stepSearchParam
    if (step === 1) {
      if (!email) {
        router.replace('/signup')
        return
      }
    }
    if (step === 2) {
      if (!password) {
        router.replace('/signup')
        return
      }
    }
    if (step === 3) {
      if (!username) {
        router.replace('/signup')
        return
      }
    }
    // useEffectOnce
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      {stepSearchParam === null && (
        <SignUpFormEmail
          initialEmailValue={email}
          onValidationSuccess={(validEmail) => {
            setEmail(validEmail)
            router.push(`/signup?step=1`)
          }}
          onValidationError={() => {
            setErrorMessage('Invalid Email')
          }}
          onEmailInputChange={() => {
            setErrorMessage('')
          }}
        />
      )}
      {stepSearchParam && +stepSearchParam === 1 && (
        <SignUpFormPassword
          initialPasswordValue={password}
          onValidationSuccess={(validPassword) => {
            setPassword(validPassword)
            router.push(`/signup?step=2`)
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
      {stepSearchParam && +stepSearchParam === 2 && (
        <SignUpFormUserInfo
          initialUsernameValue={username}
          onValidationSuccess={(validUsername) => {
            setUsername(validUsername)
            router.push(`/signup?step=3`)
          }}
          onValidationError={() => {
            setErrorMessage('Invalid username')
          }}
          onUsernameInputChange={(e) => {
            setErrorMessage('')
          }}
        />
      )}
      {stepSearchParam && +stepSearchParam === 3 && (
        <SignUpFormTermsAndConditions
          initialTermsAndConditions={termsAndConditions}
          onUserCheckedTermsAndConditions={setTermsAndConditions}
          onSubmit={() => {
            // TODO: send data to server
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
