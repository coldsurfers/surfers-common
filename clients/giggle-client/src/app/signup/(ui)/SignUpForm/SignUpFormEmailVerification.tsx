'use client'

import { useSignUpStore } from '@/stores/SignUpStore'
import { useEffectOnce } from 'react-use'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useCallback, useRef, useState } from 'react'
import { match } from 'ts-pattern'
import {
  CredentialsEmailVerificationCodeSchema,
  ResultReturnType,
} from '@/libs/types'
import httpRequest from '@/libs/httpRequest'
import { ApiPostAuthVerificationErrorCode } from '@/app/api/auth/verification/types'
import TextInput from '@/ui/TextInput/TextInput'
import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@hookform/error-message'
import FormError from '@/ui/Forms/FormError'

const InputsSchema = z.object({
  verificationCode: CredentialsEmailVerificationCodeSchema,
})

type Inputs = z.TypeOf<typeof InputsSchema>

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
    criteriaMode: 'all',
    resolver: zodResolver(InputsSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const zodValidation = InputsSchema.safeParse(data)
      if (!zodValidation.success) {
        onValidationError && onValidationError('ZodValidation')
        return
      }
      if (authcodeRef.current !== zodValidation.data.verificationCode) {
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
    <BottomCTAFormLayout
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <TextInput
        placeholder="Verification Code"
        {...register('verificationCode', {
          onChange: onVerificationCodeInputChange,
        })}
      />
      {message}
      <ErrorMessage
        errors={errors}
        name="verificationCode"
        render={({ messages }) => {
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type} className="mt-4 mb-4">
                <FormError>{message}</FormError>
              </div>
            ))
          )
        }}
      />
    </BottomCTAFormLayout>
  )
}

export default SignUpFormEmailVerification
