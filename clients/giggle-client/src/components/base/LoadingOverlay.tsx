import { memo } from 'react'
import SyncLoader from 'react-spinners/SyncLoader'
import styled from 'styled-components'

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null
  return (
    <Wrapper>
      <SyncLoader loading={isLoading} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default memo(LoadingOverlay)
