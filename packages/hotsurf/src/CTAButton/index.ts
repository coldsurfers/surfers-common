import { Platform } from 'react-native'
import { CTAButton as CTAButtonWebUI } from './index.web'

// @ts-ignore
export const CTAButton: typeof CTAButtonWebUI = () => {
  throw new Error(`CTAButton is not implemented on ${Platform.OS}`)
}
