/* eslint-disable import/no-extraneous-dependencies */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import GlobalStyle from '@coldsurfers/store-client/components/GlobalStyle'
import { cookies } from 'next/headers'
import LayoutWrapper from '../components/LayoutWrapper'
import { auth } from '../libs/auth'
import StyledComponentsRegistry from '../registry/StyledComponentsRegistry'
import StyleSheetRegistry from '../registry/StyleSheetRegistry'
import { AuthStoreProvider } from '../registry/AuthStoreRegistry/AuthStoreRegistry'
import RegistryProvider from '../registry/RegistryProvider'

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
  const accessToken = cookies().get('@coldsurfers/store.access_token')?.value
  const refreshToken = cookies().get('@coldsurfers/store.refresh_token')?.value

  return (
    <html lang="en">
      <head>
        <GlobalStyle />
      </head>
      <body className={inter.className}>
        <RegistryProvider
          registries={[StyledComponentsRegistry, StyleSheetRegistry]}
        >
          <AuthStoreProvider
            accessToken={accessToken}
            refreshToken={refreshToken}
          >
            <LayoutWrapper session={session}>{children}</LayoutWrapper>
          </AuthStoreProvider>
        </RegistryProvider>
      </body>
    </html>
  )
}
