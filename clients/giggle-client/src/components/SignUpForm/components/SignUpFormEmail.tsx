import LoginButton from '@/ui/Button/LoginButton'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { z } from 'zod'

const EMAIL_NEXT_MESSAGE = 'Next'

const InputsEmailSchema = z.string().email()

type Inputs = {
  email: z.TypeOf<typeof InputsEmailSchema>
}

const SignUpFormEmail = ({
  onValidationSuccess,
  onValidationError,
  onEmailInputChange,
}: {
  onValidationSuccess?: () => void
  onValidationError?: () => void
  onEmailInputChange?: (e: any) => void
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const validation = InputsEmailSchema.safeParse(data.email)
      if (!validation.success) {
        onValidationError && onValidationError()
        return
      }
      onValidationSuccess && onValidationSuccess()
    },
    [onValidationError, onValidationSuccess]
  )
  return (
    <EmailForm onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        placeholder="Email"
        {...register('email', {
          onChange: onEmailInputChange,
        })}
      />
      <EmailNextButton withScale fullWidth>
        {EMAIL_NEXT_MESSAGE}
      </EmailNextButton>
    </EmailForm>
  )
}

const EmailForm = styled.form``

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

export default SignUpFormEmail
