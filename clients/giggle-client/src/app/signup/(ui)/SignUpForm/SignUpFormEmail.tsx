import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'
import TextInput from '@/ui/TextInput/TextInput'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ErrorMessage } from '@hookform/error-message'
import FormError from '@/ui/Forms/FormError'
import { zodResolver } from '@hookform/resolvers/zod'
import { CredentialsEmailSchema } from '@/libs/types'

const InputsSchema = z.object({
  email: CredentialsEmailSchema,
})

type Inputs = z.TypeOf<typeof InputsSchema>

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
    resolver: zodResolver(InputsSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const validation = InputsSchema.safeParse(data)
      if (!validation.success) {
        onValidationError && onValidationError()
        return
      }
      onValidationSuccess && onValidationSuccess(validation.data.email)
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
