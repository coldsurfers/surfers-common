'use client'

import styled from 'styled-components'
import { MouseEventHandler, useCallback, useRef } from 'react'
import { Button } from '..'
import { Modal } from '../Modal/index.web'
import { ModalPortal } from '../ModalPortal/index.web'

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

export function LoginModal({
  isOpen = false,
  onClickGoogleLogin,
  onClickBackground,
}: Props) {
  const modalBackgroundRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line no-underscore-dangle
  const _onClickBackground = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (modalBackgroundRef.current?.isEqualNode(e.target as Node)) {
        onClickBackground?.(e)
      }
    },
    [onClickBackground]
  )
  return (
    isOpen && (
      <ModalPortal>
        <Modal.Background
          ref={modalBackgroundRef}
          onClickBackground={_onClickBackground}
        >
          <CustomModal>
            <ModalTitle>ColdSurf Store</ModalTitle>
            <Button text="Google Login" onPress={onClickGoogleLogin} />
          </CustomModal>
        </Modal.Background>
      </ModalPortal>
    )
  )
}