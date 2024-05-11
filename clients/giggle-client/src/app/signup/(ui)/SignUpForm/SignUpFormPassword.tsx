import TextInput from '@/ui/TextInput/TextInput'
import { CredentialsPasswordSchema } from '@/libs/types'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'
import { ErrorMessage } from '@hookform/error-message'
import FormError from '@/ui/Forms/FormError'
import { zodResolver } from '@hookform/resolvers/zod'

const InputsSchema = z.object({
  password: CredentialsPasswordSchema,
})

type Inputs = z.TypeOf<typeof InputsSchema>

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
      onValidationSuccess && onValidationSuccess(validation.data.password)
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
      <ErrorMessage
        errors={errors}
        name="password"
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

export default SignUpFormPassword
