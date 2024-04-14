'use client'

import LoginButton from '@/ui/Button/LoginButton'
import { signIn } from 'next-auth/react'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useSignUpStore } from '@/stores/SignUpStore'
import SignUpFormEmail from './components/SignUpFormEmail'
import SignUpFormPassword from './components/SignUpFormPassword'
import SignUpFormUserInfo from './components/SignUpFormUserInfo'
import SignUpFormTermsAndConditions from './components/SignUpFormTermsAndConditions/SignUpFormTermsAndConditions'
import { useEffectOnce } from 'react-use'
import { EmailSignUpActionParams } from '../../../actions/signup'
import useSignUpRoute from './useSignUpRoute'
import { match } from 'ts-pattern'
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

const StepSchema = z.number()

enum StepEnum {
  EMAIL = 1,
  PASSWORD,
  TERMS_AND_CONDITIONS,
}

export default function SignUpForm() {
  const { initializeStepRoute, increaseStepRoute, stepSearchParam } =
    useSignUpRoute()

  const step = useMemo<StepEnum | null>(() => {
    if (stepSearchParam === null) {
      return null
    }
    const validation = StepSchema.safeParse(+stepSearchParam)
    if (!validation.success) {
      return null
    }

    return match(validation.data)
      .when(
        (value) =>
          value >= StepEnum.EMAIL && value <= StepEnum.TERMS_AND_CONDITIONS,
        (payload) => payload
      )
      .otherwise(() => null)
  }, [stepSearchParam])

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

  useEffectOnce(() => {
    match(step)
      .with(null, () => {
        initializeStepRoute()
      })
      .with(1, () => {
        if (!email) {
          initializeStepRoute()
        }
      })
      .with(2, () => {
        if (!password) {
          initializeStepRoute()
        }
      })
      .with(3, () => {
        if (!username) {
          initializeStepRoute()
        }
      })
      .exhaustive()
  })

  return (
    <Wrapper>
      <TopTitle>{TITLE_MESSAGE}</TopTitle>
      {match(step)
        .with(null, () => (
          <SignUpFormEmail
            initialEmailValue={email}
            onValidationSuccess={(validEmail) => {
              setEmail(validEmail)
              increaseStepRoute()
            }}
            onValidationError={() => {
              setErrorMessage('Invalid Email')
            }}
            onEmailInputChange={() => {
              setErrorMessage('')
            }}
          />
        ))
        .with(1, () => (
          <SignUpFormPassword
            initialPasswordValue={password}
            onValidationSuccess={(validPassword) => {
              setPassword(validPassword)
              increaseStepRoute()
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
        ))
        .with(2, () => (
          <SignUpFormUserInfo
            initialUsernameValue={username}
            onValidationSuccess={(validUsername) => {
              setUsername(validUsername)
              increaseStepRoute()
            }}
            onValidationError={() => {
              setErrorMessage('Invalid username')
            }}
            onUsernameInputChange={(e) => {
              setErrorMessage('')
            }}
          />
        ))
        .with(3, () => (
          <SignUpFormTermsAndConditions
            initialTermsAndConditions={termsAndConditions}
            onUserCheckedTermsAndConditions={setTermsAndConditions}
            onValidationError={() => {
              setErrorMessage('You have to check all mandatory terms')
            }}
            onSubmit={() => {
              setErrorMessage('')
              const needData: EmailSignUpActionParams = {
                email,
                password,
                passwordConfirm: password,
              }
              console.log(needData)
              // TODO: send data to server
            }}
          />
        ))
        .exhaustive()}
      <Divider />
      <LoginButton
        onClick={onClickGoogleLoginButton}
        fullWidth
      >{`${LOGIN_PRE_MESSAGE} Google`}</LoginButton>
      {errorMessage}
    </Wrapper>
  )
}
