import { Platform } from 'react-native'
import { LoginModal as LoginModalWebUI } from './index.web'

// @ts-ignore
export const LoginModal: typeof LoginModalWebUI = () => {
  throw new Error(`LoginModal is not implemented on ${Platform.OS}`)
}
