import { CredentialsUsernameSchema } from '@/libs/types'
import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'
import FormError from '@/ui/Forms/FormError'
import TextInput from '@/ui/TextInput/TextInput'
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const InputsSchema = z.object({
  username: CredentialsUsernameSchema,
})

type Inputs = z.TypeOf<typeof InputsSchema>

const SignUpFormUserInfo = ({
  initialUsernameValue,
  onValidationSuccess,
  onValidationError,
  onUsernameInputChange,
}: {
  initialUsernameValue?: string
  onValidationSuccess?: (validUsername: string) => void
  onValidationError?: () => void
  onUsernameInputChange?: (e: any) => void
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    values: {
      username: initialUsernameValue ?? '',
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
      onValidationSuccess && onValidationSuccess(validation.data.username)
    },
    [onValidationError, onValidationSuccess]
  )

  return (
    <BottomCTAFormLayout onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        placeholder="Username"
        {...register('username', {
          onChange: onUsernameInputChange,
        })}
      />
      <ErrorMessage
        errors={errors}
        name="username"
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

export default SignUpFormUserInfo
