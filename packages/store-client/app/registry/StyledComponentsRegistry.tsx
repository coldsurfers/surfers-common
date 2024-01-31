'use client'

import React, { useState, PropsWithChildren } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
// import { AppRegistry } from 'react-native'

const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

export default function StyledComponentsRegistry({
  children,
}: PropsWithChildren) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()

    // const Child = () => <>{children}</>

    // try {
    //   AppRegistry.registerComponent('name', () => Child)
    // } catch (e) {
    //   console.error(e)
    // }

    // const { getStyleElement } = AppRegistry.getApplication('name')

    return (
      <>
        {/* {getStyleElement()} */}
        {styles}
        <style dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />
      </>
    )
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {/* @ts-ignore */}
      {children}
    </StyleSheetManager>
  )
}
