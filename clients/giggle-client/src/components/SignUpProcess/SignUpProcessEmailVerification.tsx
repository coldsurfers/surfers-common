import { ChangeEvent, useCallback, useState } from 'react'
import SignUpFormEmailVerification from '../SignUpForm/components/SignUpFormEmailVerification'
import { useSignUpStore } from '@/stores/SignUpStore'
import { match } from 'ts-pattern'
import LoadingOverlay from '../base/LoadingOverlay'
import {
  EmailSignUpActionParams,
  emailSignUpAction,
} from '../../../actions/signup'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { emailSignInAction } from '../../../actions/login'

const SignUpProcessEmailVerification = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { errorMessage, email, password, emailVerificationCode } =
    useSignUpStore((state) => ({
      email: state.email,
      password: state.password,
      emailVerificationCode: state.emailVerificationCode,
      errorMessage: state.errorMessage,
    }))
  const { setEmailVerificationCode, setErrorMessage } = useSignUpStore(
    (state) => ({
      setEmailVerificationCode: state.setEmailVerificationCode,
      setErrorMessage: state.setErrorMessage,
    })
  )
  const handleVerificationCodeInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEmailVerificationCode(e.target.value)
    },
    [setEmailVerificationCode]
  )

  const handleSignUpFormEmailValidationError = useCallback(
    (reason: 'ZodValidation' | 'VerificationCodeNotCorrect') => {
      match(reason)
        .with('ZodValidation', () => {
          setErrorMessage('Email verification code should be 6 digit number')
        })
        .with('VerificationCodeNotCorrect', () => {
          setErrorMessage('Email verification code is not correct')
        })
        .exhaustive()
    },
    [setErrorMessage]
  )

  const handleSignUpSubmit = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')
    const needData: EmailSignUpActionParams = {
      email,
      password,
      passwordConfirm: password,
      verificationCode: emailVerificationCode,
    }
    try {
      const response = await emailSignUpAction(needData)
      if (response.isError) {
        setErrorMessage(response.errorCode)
        return
      }
      const signInResponse = await emailSignInAction({
        ...needData,
      })
      if (signInResponse.isError) {
        setErrorMessage(signInResponse.error)
        return
      }
      await signIn('credentials', {
        redirect: true,
        ...needData,
      })
      router.push('/')
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [email, emailVerificationCode, password, router, setErrorMessage])

  return (
    <>
      <SignUpFormEmailVerification
        onVerificationCodeInputChange={handleVerificationCodeInputChange}
        onValidationError={handleSignUpFormEmailValidationError}
        onValidationSuccess={handleSignUpSubmit}
      />
      {errorMessage}
      <LoadingOverlay isLoading={isLoading} />
    </>
  )
}

export default SignUpProcessEmailVerification
