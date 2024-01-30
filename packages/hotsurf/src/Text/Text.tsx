import React, { memo } from 'react'
import { StyleSheet, Text as RNText, TextProps } from 'react-native'

interface Props extends TextProps {
  weight?: 'thin' | 'light' | 'regular' | 'medium' | 'bold'
}

const Text = ({ children, weight = 'regular', style, ...others }: Props) => {
  const fontFamilySet = {
    thin: styles.thin,
    light: styles.light,
    regular: styles.regular,
    medium: styles.medium,
    bold: styles.bold,
  }
  return (
    <RNText {...others} style={[fontFamilySet[weight], style]}>
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  thin: {
    fontFamily: 'NotoSansKR-Thin',
  },
  light: {
    fontFamily: 'NotoSansKR-Light',
  },
  regular: {
    fontFamily: 'NotoSansKR-Regular',
  },
  medium: {
    fontFamily: 'NotoSansKR-Medium',
  },
  bold: {
    fontFamily: 'NotoSansKR-Bold',
  },
})

export default memo(Text)
