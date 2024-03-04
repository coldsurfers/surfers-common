'use client'

import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import '@coldsurfers/hotsurf/global-light-only.css'
import ApolloProviderRegistry from './registry/ApolloProviderRegistry'
import Header from '../ui/Header'
import RegistryProvider from './registry/RegistryProvider'
import StyledComponentsRegistry from './registry/StyledComponentsRegistry'
import StyleSheetRegistry from './registry/StyleSheetRegistry'

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
        <RegistryProvider
          registries={[
            ApolloProviderRegistry,
            StyledComponentsRegistry,
            StyleSheetRegistry,
          ]}
        >
          {pathname?.includes('/auth') ? null : <Header />}
          <Suspense>{children}</Suspense>
        </RegistryProvider>
      </body>
    </html>
  )
}
