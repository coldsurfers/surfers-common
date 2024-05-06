import { ChangeEvent, useCallback, useState } from 'react'
import SignUpFormEmailVerification from '../SignUpForm/SignUpFormEmailVerification'
import { useSignUpStore } from '@/stores/SignUpStore'
import { match } from 'ts-pattern'
import LoadingOverlay from '../../../../ui/LoadingOverlay/LoadingOverlay'
import {
  EmailSignUpActionParams,
  emailSignUpAction,
  googleSignUpAction,
} from '../../../../../actions/signup'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { emailSignInAction } from '../../../../../actions/login'

const SignUpProcessEmailVerification = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { errorMessage, email, password, emailVerificationCode, meta } =
    useSignUpStore((state) => ({
      email: state.email,
      password: state.password,
      emailVerificationCode: state.emailVerificationCode,
      errorMessage: state.errorMessage,
      meta: state.meta,
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
      if (meta.provider === 'google' && meta.accessToken) {
        const googleSignUpResponse = await googleSignUpAction({
          accessToken: meta.accessToken,
        })
        if (googleSignUpResponse.isError) return

        const googleSignInResponse = await emailSignInAction({
          ...needData,
          provider: 'google',
          accessToken: meta.accessToken,
        })
        if (googleSignInResponse.isError && googleSignInResponse.error) {
          setErrorMessage(googleSignInResponse.error)
          return
        }
        await signIn('credentials', {
          redirect: true,
          ...needData,
          provider: 'google',
          accessToken: meta.accessToken,
        })
        router.push('/')
      } else {
        const emailSignUpResponse = await emailSignUpAction(needData)
        if (emailSignUpResponse.isError) {
          setErrorMessage(emailSignUpResponse.errorCode)
          return
        }
        const emailSignInResponse = await emailSignInAction({
          ...needData,
          provider: 'credentials',
        })
        if (emailSignInResponse.isError && emailSignInResponse.error) {
          setErrorMessage(emailSignInResponse.error)
          return
        }
        await signIn('credentials', {
          redirect: true,
          ...needData,
        })
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [
    email,
    emailVerificationCode,
    meta.accessToken,
    meta.provider,
    password,
    router,
    setErrorMessage,
  ])

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
