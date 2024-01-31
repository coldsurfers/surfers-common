import { Platform } from 'react-native'
import type {
  LoginForm as LoginFormWebUI,
  LoginFormRefHandle,
} from './index.web'

// @ts-ignore
export const LoginForm: typeof LoginFormWebUI = () => {
  throw new Error(`LoginForm is not implemented on ${Platform.OS}`)
}

export type { LoginFormRefHandle }
