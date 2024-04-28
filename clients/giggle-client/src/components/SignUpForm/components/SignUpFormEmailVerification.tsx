'use client'

import { useSignUpStore } from '@/stores/SignUpStore'
import { sendSignUpAuthCodeTemplateEmail } from '../../../../actions/signup'
import { useEffectOnce } from 'react-use'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import LoginButton from '@/ui/Button/LoginButton'
import { useCallback, useRef, useState } from 'react'
import { z } from 'zod'
import LoadingOverlay from '@/components/base/LoadingOverlay'
import { match } from 'ts-pattern'

const EMAIL_NEXT_MESSAGE = 'Next'

const EmailVerificationCodeSchema = z.string().max(6).min(6)

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
      const zodValidation = EmailVerificationCodeSchema.safeParse(
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
    sendSignUpAuthCodeTemplateEmail(email).then((response) => {
      setIsLoading(false)
      if (response.isError) {
        match(response.error)
          .with('ALREADY_AUTHENTICATED', () => {
            setMessage('Already verified email')
          })
          .with('UNKNOWN_ERROR', () => {
            setMessage('Unknown error')
          })
          .exhaustive()
        return
      }
      authcodeRef.current = response.data.authcode
      setMessage(
        `Email Verification code has been sent to your email!\nDon't for get to check your spams too.`
      )
    })
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
