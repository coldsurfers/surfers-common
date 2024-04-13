import LoginButton from '@/ui/Button/LoginButton'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { z } from 'zod'

const EMAIL_NEXT_MESSAGE = 'Next'

// https://regexr.com/3bfsi
// min 8, max 32, at least one letter and one number
const InputsPasswordSchema = z
  .string()
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,32}$/)

type Inputs = {
  password: z.TypeOf<typeof InputsPasswordSchema>
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
      const validation = InputsPasswordSchema.safeParse(data.password)
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

export default SignUpFormPassword
