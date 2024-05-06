import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'
import TextInput from '@/ui/TextInput/TextInput'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

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
    <BottomCTAFormLayout onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        placeholder="Email"
        {...register('email', {
          onChange: onEmailInputChange,
        })}
      />
    </BottomCTAFormLayout>
  )
}

export default SignUpFormEmail
