'use client'

import { View } from 'react-native'
import { Text } from '@coldsurfers/hotsurf'

export function Header() {
  return (
    <View style={{ padding: 20 }}>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
          ColdSurfers | Home
        </Text>
      </View>
    </View>
  )
}
