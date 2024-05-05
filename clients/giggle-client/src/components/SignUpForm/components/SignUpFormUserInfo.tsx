import Button from '@/components/base/Button'
import TextInput from '@/components/base/TextInput'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { z } from 'zod'

const EMAIL_NEXT_MESSAGE = 'Next'

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
    <EmailForm onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        placeholder="Username"
        {...register('username', {
          onChange: onUsernameInputChange,
        })}
      />
      <Button fullWidth additionalStyles={{ marginTop: '1rem' }}>
        {EMAIL_NEXT_MESSAGE}
      </Button>
    </EmailForm>
  )
}

const EmailForm = styled.form``

export default SignUpFormUserInfo
