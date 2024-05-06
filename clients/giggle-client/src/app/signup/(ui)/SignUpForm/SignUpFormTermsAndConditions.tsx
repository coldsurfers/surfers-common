import { SignUpTermsAndConditions } from '@/stores/SignUpStore'
import { FormEventHandler, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SignUpFormTermsAndConditionsBox from './SignUpFormTermsAndConditionsBox'
import BottomCTAFormLayout from '@/ui/Forms/BottomCTAFormLayout'

type TermsAndConditionsStateEach = {
  title: string
  url: string
  checked: boolean
  isMandatory: boolean
}
type TermsAndConditionsState = {
  'data-collection': TermsAndConditionsStateEach
  'terms-of-use': TermsAndConditionsStateEach
}
const SignUpFormTermsAndConditions = ({
  initialTermsAndConditions,
  onValidationError,
  onUserCheckedTermsAndConditions,
  onSubmit,
}: {
  initialTermsAndConditions?: SignUpTermsAndConditions
  onValidationError?: () => void
  onUserCheckedTermsAndConditions?: (state: SignUpTermsAndConditions) => void
  onSubmit?: () => void
}) => {
  const [termsAndConditions, setTermsAndConditions] =
    useState<TermsAndConditionsState>({
      'data-collection': {
        title:
          'Collection and use of required personal information (mandatory)',
        url: 'https://coldsurf.io/legal/collectionanduseofpersonalinformation',
        checked: initialTermsAndConditions
          ? initialTermsAndConditions.collectionData
          : false,
        isMandatory: true,
      },
      'terms-of-use': {
        title: 'ColdSurf terms and conditions of use (mandatory)',
        url: 'https://coldsurf.io/legal/end-user-agreement',
        checked: initialTermsAndConditions
          ? initialTermsAndConditions.termsAndConditions
          : false,
        isMandatory: true,
      },
    })
  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      const isAllMandatoryChecked = Object.keys(termsAndConditions).every(
        (key) => {
          const currKey = key as keyof typeof termsAndConditions
          if (
            termsAndConditions[currKey].isMandatory &&
            !termsAndConditions[currKey].checked
          ) {
            return false
          }
          return true
        }
      )
      if (!isAllMandatoryChecked) {
        onValidationError?.()
        return
      }

      onSubmit?.()
    },
    [onSubmit, onValidationError, termsAndConditions]
  )

  useEffect(() => {
    onUserCheckedTermsAndConditions?.({
      collectionData: termsAndConditions['data-collection'].checked,
      termsAndConditions: termsAndConditions['terms-of-use'].checked,
    })
  }, [onUserCheckedTermsAndConditions, termsAndConditions])

  return (
    <BottomCTAFormLayout onSubmit={handleSubmit}>
      {Object.keys(termsAndConditions).map((key) => {
        const targetKey = key as keyof typeof termsAndConditions
        const target = termsAndConditions[targetKey]
        return (
          <SignUpFormTermsAndConditionsBox
            key={key}
            title={target.title}
            url={target.url}
            onChange={(checked) => {
              const nextState = {
                ...termsAndConditions,
              }
              nextState[targetKey].checked = checked
              setTermsAndConditions(nextState)
            }}
          />
        )
      })}
    </BottomCTAFormLayout>
  )
}

const EmailForm = styled.form``

export default SignUpFormTermsAndConditions
