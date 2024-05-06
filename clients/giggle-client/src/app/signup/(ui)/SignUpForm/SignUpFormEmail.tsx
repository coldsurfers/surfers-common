import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'
import TextInput from '@/ui/TextInput/TextInput'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ErrorMessage } from '@hookform/error-message'
import FormError from '@/ui/Forms/FormError'

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
  } = useForm<Inputs>({
    values: { email: initialEmailValue ?? '' },
    criteriaMode: 'all',
  })
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
          required: 'Invalid Email!',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Entered value does not match email format',
          },
        })}
      />
      <ErrorMessage
        errors={errors}
        name="email"
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

export default SignUpFormEmail
