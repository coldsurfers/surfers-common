'use client'

import { useTheme } from 'next-themes'
import { memo, useLayoutEffect } from 'react'

const ThemeLayoutEffector = () => {
  const { setTheme, systemTheme } = useTheme()
  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      setTheme(systemTheme?.includes('dark') ? 'dark' : 'light')
    }
  }, [setTheme, systemTheme])

  return null
}

export default memo(ThemeLayoutEffector)
