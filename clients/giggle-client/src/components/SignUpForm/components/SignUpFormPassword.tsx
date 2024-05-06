import TextInput from '@/ui/TextInput/TextInput'
import { CredentialsPasswordSchema } from '@/libs/types'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { z } from 'zod'
import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'

type Inputs = {
  password: z.TypeOf<typeof CredentialsPasswordSchema>
}

const SignUpFormPassword = ({
  initialPasswordValue,
  onValidationSuccess,
  onValidationError,
  onPasswordInputChange,
}: {
  initialPasswordValue?: string
  onValidationSuccess?: (validPassword: string) => void
  onValidationError?: () => void
  onPasswordInputChange?: (e: any) => void
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    values: {
      password: initialPasswordValue ?? '',
    },
  })
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const validation = CredentialsPasswordSchema.safeParse(data.password)
      if (!validation.success) {
        onValidationError && onValidationError()
        return
      }
      onValidationSuccess && onValidationSuccess(validation.data)
    },
    [onValidationError, onValidationSuccess]
  )
  return (
    <BottomCTAFormLayout onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        type="password"
        placeholder="password"
        {...register('password', {
          onChange: onPasswordInputChange,
        })}
      />
    </BottomCTAFormLayout>
  )
}

export default SignUpFormPassword
