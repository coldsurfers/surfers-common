import { useSignUpStore } from '@/stores/SignUpStore'
import SignUpFormPassword from '../SignUpForm/SignUpFormPassword'
import useSignUpRoute from '../SignUpForm/hooks/useSignUpRoute'

const SignUpProcessPassword = () => {
  const { increaseStepRoute } = useSignUpRoute()
  const { password, errorMessage } = useSignUpStore((state) => ({
    password: state.password,
    errorMessage: state.errorMessage,
  }))
  const { setPassword, setErrorMessage } = useSignUpStore((state) => ({
    setPassword: state.setPassword,
    setErrorMessage: state.setErrorMessage,
  }))
  return (
    <>
      <SignUpFormPassword
        initialPasswordValue={password}
        onValidationSuccess={(validPassword) => {
          setPassword(validPassword)
          increaseStepRoute()
        }}
        onValidationError={() => {
          setErrorMessage(
            'Password should have at least one letter and number. Min 8, Max 32'
          )
        }}
        onPasswordInputChange={(e) => {
          setErrorMessage('')
        }}
      />
      {errorMessage}
    </>
  )
}

export default SignUpProcessPassword
