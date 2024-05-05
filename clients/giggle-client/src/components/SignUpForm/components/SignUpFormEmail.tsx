import Button from '@/components/base/Button'
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
  initialEmailValue,
  onValidationSuccess,
  onValidationError,
  onEmailInputChange,
}: {
  initialEmailValue?: string
  onValidationSuccess?: (validEmail: string) => void
  onValidationError?: () => void
  onEmailInputChange?: (e: any) => void
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ values: { email: initialEmailValue ?? '' } })
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const validation = InputsEmailSchema.safeParse(data.email)
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
        placeholder="Email"
        {...register('email', {
          onChange: onEmailInputChange,
        })}
      />
      <Button fullWidth additionalStyles={{ marginTop: '1rem' }}>
        {EMAIL_NEXT_MESSAGE}
      </Button>
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

export default SignUpFormEmail
