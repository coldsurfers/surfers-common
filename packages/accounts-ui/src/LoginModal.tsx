'use client'

import styled from '@emotion/styled'
import { MouseEventHandler, useRef } from 'react'
import Modal from './Modal'
import ModalPortal from './ModalPortal'
import Button from './Button'

const CustomModal = styled(Modal.Container)`
  width: 350px;
  display: flex;
  flex-direction: column;
`

const ModalTitle = styled.h2`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 18px;
`

interface Props {
  isOpen?: boolean
  onClickGoogleLogin?: () => Promise<void>
  onClickBackground?: MouseEventHandler<HTMLDivElement>
}

export default function LoginModal({
  isOpen = false,
  onClickGoogleLogin,
  onClickBackground,
}: Props) {
  const modalBackgroundRef = useRef<HTMLDivElement>(null)
  return (
    isOpen && (
      <ModalPortal>
        <Modal.Background
          ref={modalBackgroundRef}
          onClickBackground={onClickBackground}
        >
          <CustomModal>
            <ModalTitle>ColdSurf Store</ModalTitle>
            <Button onClick={onClickGoogleLogin}>Google Login</Button>
          </CustomModal>
        </Modal.Background>
      </ModalPortal>
    )
  )
}
