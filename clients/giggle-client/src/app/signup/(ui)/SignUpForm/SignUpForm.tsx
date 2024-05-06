'use client'

import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSignUpStore } from '@/stores/SignUpStore'
import { useEffectOnce } from 'react-use'
import useSignUpRoute from './hooks/useSignUpRoute'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { StepEnum } from './types'
import SignUpProcessEmailVerification from '../SignUpProcess/SignUpProcessEmailVerification'
import SignUpProcessEmail from '../SignUpProcess/SignUpProcessEmail'
import SignUpProcessPassword from '../SignUpProcess/SignUpProcessPassword'
import SignUpProcessUserInfo from '../SignUpProcess/SignUpProcessUserInfo'
import SignUpProcessTermsAndConditions from '../SignUpProcess/SignUpProcessTermsAndConditions'
import { ResultReturnType } from '@/libs/types'
import { API_AUTH_GET_GOOGLE_ERROR_CODE } from '@/app/api/auth/google/types'
import httpRequest from '@/libs/httpRequest'
import Button from '../../../../ui/Button/Button'
import TopTitleFormLayout from '@/ui/Forms/TopTitleFormLayout'

const TITLE_MESSAGE = `Sign up to start finding venues`

const LOGIN_PRE_MESSAGE = 'Sign up with'

const Divider = styled.div`
  height: 1px;
  background: black;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const StepSchema = z.number()

export default function SignUpForm() {
  const [authUrl, setAuthUrl] = useState('')
  const { initializeStepRoute, stepSearchParam } = useSignUpRoute()

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
          value >= StepEnum.EMAIL && value <= StepEnum.EMAIL_VERIFICATION,
        (payload) => payload
      )
      .otherwise(() => null)
  }, [stepSearchParam])

  const { email, password, username, termsAndConditions } = useSignUpStore(
    (state) => ({
      email: state.email,
      password: state.password,
      username: state.username,
      termsAndConditions: state.termsAndConditions,
    })
  )

  useEffectOnce(() => {
    httpRequest(`/api/auth/google`, {
      method: 'GET',
    }).then(async (response) => {
      const responseJson = (await response.json()) as ResultReturnType<
        {
          authUrl: string
        },
        API_AUTH_GET_GOOGLE_ERROR_CODE
      >
      if (responseJson.data) {
        setAuthUrl(responseJson.data.authUrl)
      }
    })
  })

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
      .with(4, () => {
        if (
          !termsAndConditions?.collectionData ||
          !termsAndConditions.termsAndConditions
        ) {
          initializeStepRoute()
        }
      })
      .exhaustive()
  })

  return (
    <TopTitleFormLayout title={TITLE_MESSAGE}>
      {match(step)
        .with(null, () => <SignUpProcessEmail />)
        .with(1, () => <SignUpProcessPassword />)
        .with(2, () => <SignUpProcessUserInfo />)
        .with(3, () => <SignUpProcessTermsAndConditions />)
        .with(4, () => <SignUpProcessEmailVerification />)
        .exhaustive()}
      {step === null && <Divider />}
      {step === null && (
        <Button
          fullWidth
          href={authUrl}
        >{`${LOGIN_PRE_MESSAGE} Google`}</Button>
      )}
    </TopTitleFormLayout>
  )
}
