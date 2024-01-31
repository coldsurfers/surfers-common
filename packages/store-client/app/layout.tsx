/* eslint-disable import/no-extraneous-dependencies */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import GlobalStyle from '@coldsurfers/store-client/components/GlobalStyle'
import LayoutWrapper from '../components/LayoutWrapper'
import { auth } from '../libs/auth'
import StyledComponentsRegistry from './registry/StyledComponentsRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Store | ColdSurf',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <head>
        <GlobalStyle />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <LayoutWrapper session={session}>{children}</LayoutWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
