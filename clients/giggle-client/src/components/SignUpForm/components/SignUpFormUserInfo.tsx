import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'
import TextInput from '@/ui/TextInput/TextInput'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

// https://regexr.com/3cg7r
// instagram style username schema
const UsernameSchema = z.string().regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)

type Inputs = {
  username: z.TypeOf<typeof UsernameSchema>
}

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
  })
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      const validation = UsernameSchema.safeParse(data.username)
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
        placeholder="Username"
        {...register('username', {
          onChange: onUsernameInputChange,
        })}
      />
    </BottomCTAFormLayout>
  )
}

export default SignUpFormUserInfo
