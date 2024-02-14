'use client'

import { createGlobalStyle } from 'styled-components'
import { usePathname } from 'next/navigation'
import GlobalStylesRegistry from './registry/GlobalStylesRegistry'
import '../styles/global.css'
import ApolloProviderRegistry from './registry/ApolloProviderRegistry'
import Header from '../ui/Header'

const GlobalStyle = createGlobalStyle``

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ApolloProviderRegistry>
          <GlobalStylesRegistry>
            <>
              {pathname?.includes('/auth') ? null : <Header />}
              {children}
              <GlobalStyle />
            </>
          </GlobalStylesRegistry>
        </ApolloProviderRegistry>
      </body>
    </html>
  )
}
