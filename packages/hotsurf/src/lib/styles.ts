import { StyleSheet } from 'react-native'
import { variables } from './tokens/ts/variables'

// eslint-disable-next-line import/prefer-default-export
export const buttonBackgroundColorStyles = StyleSheet.create({
  transparent: {
    backgroundColor: 'transparent',
  },
  transparentDarkGray: {
    backgroundColor: variables.palette.black,
    opacity: 0.5,
  },
  white: {
    backgroundColor: variables.palette.white,
  },
  pink: {
    backgroundColor: variables.palette.pink,
  },
})
