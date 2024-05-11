import { useSignUpStore } from '@/stores/SignUpStore'
import SignUpFormTermsAndConditions from '../SignUpForm/SignUpFormTermsAndConditions'
import { useCallback } from 'react'
import useSignUpRoute from '../SignUpForm/hooks/useSignUpRoute'
import FormError from '@/ui/Forms/FormError'

const SignUpProcessTermsAndConditions = () => {
  const { increaseStepRoute } = useSignUpRoute()
  const { termsAndConditions, errorMessage } = useSignUpStore((state) => ({
    termsAndConditions: state.termsAndConditions,
    errorMessage: state.errorMessage,
  }))
  const { setTermsAndConditions, setErrorMessage } = useSignUpStore(
    (state) => ({
      setTermsAndConditions: state.setTermsAndConditions,
      setErrorMessage: state.setErrorMessage,
    })
  )

  const handleSignUpFormTermsAndConditionsValidationError = useCallback(() => {
    setErrorMessage('You have to check all mandatory terms')
  }, [setErrorMessage])

  return (
    <>
      <SignUpFormTermsAndConditions
        initialTermsAndConditions={termsAndConditions}
        onUserCheckedTermsAndConditions={setTermsAndConditions}
        onValidationError={handleSignUpFormTermsAndConditionsValidationError}
        onSubmit={() => {
          setErrorMessage('')
          increaseStepRoute()
        }}
      />
      {errorMessage && <FormError>{errorMessage}</FormError>}
    </>
  )
}

export default SignUpProcessTermsAndConditions
