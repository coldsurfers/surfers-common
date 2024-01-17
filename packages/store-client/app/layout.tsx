/* eslint-disable import/no-extraneous-dependencies */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import GlobalStyle from '@coldsurfers/store-client/components/GlobalStyle'
import LayoutWrapper from '../components/LayoutWrapper'
import { auth } from '../libs/auth'

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
        <LayoutWrapper session={session}>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
