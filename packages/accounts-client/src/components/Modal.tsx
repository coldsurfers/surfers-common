import { PropsWithChildren } from 'react'
import { Modal as RNModal, View } from 'react-native'

interface ModalProps {
  visible?: boolean
}

export const Modal = ({
  children,
  visible = false,
}: PropsWithChildren<ModalProps>) => (
  <>
    <RNModal visible={visible} style={{ flex: 1 }} transparent>
      <View
        style={{
          position: 'absolute',
          zIndex: 99,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </RNModal>
  </>
)
