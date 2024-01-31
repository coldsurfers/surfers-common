import { Platform } from 'react-native'
import { ModalPortal as ModalPortalWebUI } from './index.web'

// @ts-ignore
export const ModalPortal: typeof ModalPortalWebUI = () => {
  throw new Error(`ModalPortal is not implemented on ${Platform.OS}`)
}
