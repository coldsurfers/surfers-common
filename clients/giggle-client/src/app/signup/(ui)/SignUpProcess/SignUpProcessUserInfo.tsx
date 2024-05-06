import { useSignUpStore } from '@/stores/SignUpStore'
import SignUpFormUserInfo from '../SignUpForm/SignUpFormUserInfo'
import useSignUpRoute from '../SignUpForm/hooks/useSignUpRoute'

const SignUpProcessUserInfo = () => {
  const { increaseStepRoute } = useSignUpRoute()
  const { username, errorMessage } = useSignUpStore((state) => ({
    username: state.username,
    errorMessage: state.errorMessage,
  }))
  const { setUsername, setErrorMessage } = useSignUpStore((state) => ({
    setUsername: state.setUsername,
    setErrorMessage: state.setErrorMessage,
  }))
  return (
    <>
      <SignUpFormUserInfo
        initialUsernameValue={username}
        onValidationSuccess={(validUsername) => {
          setUsername(validUsername)
          increaseStepRoute()
        }}
        onValidationError={() => {
          setErrorMessage('Invalid username')
        }}
        onUsernameInputChange={(e) => {
          setErrorMessage('')
        }}
      />
      {errorMessage}
    </>
  )
}

export default SignUpProcessUserInfo
