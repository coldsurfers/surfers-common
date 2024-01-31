import { Platform } from 'react-native'
import { BottomSticky as BottomStickyWebUI } from './index.web'

export const BottomSticky: typeof BottomStickyWebUI = () => {
  throw new Error(`BottomSticky is not implemented on ${Platform.OS}`)
}
