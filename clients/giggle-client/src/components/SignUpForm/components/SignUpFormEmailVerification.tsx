'use client'

import { useSignUpStore } from '@/stores/SignUpStore'
import { useEffectOnce } from 'react-use'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import LoginButton from '@/ui/Button/LoginButton'
import { useCallback, useRef, useState } from 'react'
import LoadingOverlay from '@/components/base/LoadingOverlay'
import { match } from 'ts-pattern'
import {
  CredentialsEmailVerificationCodeSchema,
  ResultReturnType,
} from '@/libs/types'
import httpRequest from '@/libs/httpRequest'
import { ApiPostAuthVerificationErrorCode } from '@/app/api/auth/verification/types'

const EMAIL_NEXT_MESSAGE = 'Next'

type Inputs = {
  verificationCode: string
}

const SignUpFormEmailVerification = ({
  onVerificationCodeInputChange,
  onValidationError,
  onValidationSuccess,
}: {
  onValidationSuccess?: () => void
  onValidationError?: (
    reason: 'ZodValidation' | 'VerificationCodeNotCorrect'
  ) => void
  onVerificationCodeInputChange?: (e: any) => void
}) => {
  const email = useSignUpStore((state) => state.email)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const authcodeRef = useRef<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    values: {
      verificationCode: '',
    },
  })

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const zodValidation = CredentialsEmailVerificationCodeSchema.safeParse(
        data.verificationCode
      )
      if (!zodValidation.success) {
        onValidationError && onValidationError('ZodValidation')
        return
      }
      if (authcodeRef.current !== zodValidation.data) {
        onValidationError?.('VerificationCodeNotCorrect')
        return
      }
      onValidationSuccess && onValidationSuccess()
    },
    [onValidationError, onValidationSuccess]
  )

  useEffectOnce(() => {
    if (!email) return

    setIsLoading(true)

    const fetch = async () => {
      setIsLoading(true)
      try {
        const response = await httpRequest('/api/auth/verification', {
          method: 'POST',
          body: JSON.stringify({
            emailTo: email,
          }),
        })
        const responseJson = (await response.json()) as ResultReturnType<
          string,
          ApiPostAuthVerificationErrorCode
        >
        if (responseJson.isError) {
          match(responseJson.error)
            .with('ALREADY_AUTHENTICATED', () => {
              setMessage('Already verified email')
            })
            .with('INVALID_BODY', () => {
              setMessage('Invalid Email')
            })
            .with('UNKNOWN_ERROR', () => {
              setMessage('Unknown error')
            })
            .with(undefined, () => {
              // do nothing
            })
            .exhaustive()
          return
        }
        if (responseJson.data) {
          authcodeRef.current = responseJson.data
        }
        setMessage(
          `Email Verification code has been sent to your email!\nDon't for get to check your spams too.`
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetch()
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          placeholder="Verification Code"
          {...register('verificationCode', {
            onChange: onVerificationCodeInputChange,
          })}
        />
        <EmailNextButton withScale fullWidth>
          {EMAIL_NEXT_MESSAGE}
        </EmailNextButton>
        {message}
      </form>
      <LoadingOverlay isLoading={isLoading} />
    </>
  )
}

const TextInput = styled.input`
  padding: 1rem;
  border-radius: 3px;
  border: 1px solid black;
  width: 100%;
  font-size: 0.85rem;
  font-weight: 600;
`

const EmailNextButton = styled(LoginButton)`
  margin-top: 1rem;
`

export default SignUpFormEmailVerification
