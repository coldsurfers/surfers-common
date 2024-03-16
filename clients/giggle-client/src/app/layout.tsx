import './globals.css'
import { Metadata } from 'next'
import GlobalProviders from '@/components/GlobalProviders'
import HeaderContainer from '@/components/HeaderContainer'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/libs/auth'

export const metadata: Metadata = {
  title: 'Giggle Official Website',
  description: 'Giggle is another gig platform based on artists and venues!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <GlobalProviders>
            <HeaderContainer />
            {children}
          </GlobalProviders>
        </SessionProvider>
      </body>
    </html>
  )
}
