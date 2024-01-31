import { Platform } from 'react-native'
// eslint-disable-next-line import/no-named-default
import { Modal as ModalWebUI } from './index.web'

// @ts-ignore
export const Modal: typeof ModalWebUI = () => {
  throw new Error(`Modal is not implemented on ${Platform.OS}`)
}
