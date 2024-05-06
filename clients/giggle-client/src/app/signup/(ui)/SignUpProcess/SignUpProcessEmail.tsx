import { useSignUpStore } from '@/stores/SignUpStore'
import SignUpFormEmail from '../SignUpForm/SignUpFormEmail'
import useSignUpRoute from '../SignUpForm/hooks/useSignUpRoute'

const SignUpProcessEmail = () => {
  const { increaseStepRoute } = useSignUpRoute()
  const { email, errorMessage } = useSignUpStore((state) => ({
    email: state.email,
    errorMessage: state.errorMessage,
  }))
  const { setEmail, setErrorMessage } = useSignUpStore((state) => ({
    setEmail: state.setEmail,
    setErrorMessage: state.setErrorMessage,
  }))
  return (
    <>
      <SignUpFormEmail
        initialEmailValue={email}
        onValidationSuccess={(validEmail) => {
          setEmail(validEmail)
          increaseStepRoute()
        }}
        onValidationError={() => {
          setErrorMessage('Invalid Email')
        }}
        onEmailInputChange={() => {
          setErrorMessage('')
        }}
      />
      {errorMessage}
    </>
  )
}

export default SignUpProcessEmail
