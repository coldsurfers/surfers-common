import Button from '@/ui/Button/Button'
import TextInput from '@/ui/TextInput/TextInput'
import { CredentialsPasswordSchema } from '@/libs/types'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { z } from 'zod'

const EMAIL_NEXT_MESSAGE = 'Next'

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
    <EmailForm onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        type="password"
        placeholder="password"
        {...register('password', {
          onChange: onPasswordInputChange,
        })}
      />
      <Button
        fullWidth
        additionalStyles={{
          marginTop: '1rem',
        }}
      >
        {EMAIL_NEXT_MESSAGE}
      </Button>
    </EmailForm>
  )
}

const EmailForm = styled.form``

export default SignUpFormPassword
