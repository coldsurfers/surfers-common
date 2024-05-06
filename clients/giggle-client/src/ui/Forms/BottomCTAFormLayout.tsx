import { FormEventHandler, PropsWithChildren, memo } from 'react'
import Button from '../Button/Button'
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay'

const BottomCTAFormLayout = ({
  bottomCTAButtonText = 'Next',
  children,
  onSubmit,
  isLoading,
}: PropsWithChildren<{
  onSubmit?: FormEventHandler<HTMLFormElement>
  bottomCTAButtonText?: string
  isLoading?: boolean
}>) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <Button fullWidth additionalStyles={{ marginTop: '1rem' }}>
        {bottomCTAButtonText}
      </Button>
      <LoadingOverlay isLoading={!!isLoading} />
    </form>
  )
}

export default memo(BottomCTAFormLayout)
