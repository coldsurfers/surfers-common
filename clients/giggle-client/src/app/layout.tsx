import './globals.css'
import { Metadata } from 'next'
import GlobalProviders from '@/libs/GlobalProviders'
import HeaderContainer from '@/app/(ui)/HeaderContainer'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/libs/auth'
import { BRANDING_NAME } from '@/libs/constants'
import { ThemeProvider } from 'next-themes'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: `${BRANDING_NAME} Official Website`,
  description: `${BRANDING_NAME} is another gig platform based on artists and venues!`,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const theme = cookies().get('theme')?.value === 'dark' ? 'dark' : 'light'
  console.log(theme)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-black">
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            <GlobalProviders>
              <HeaderContainer />
              {children}
            </GlobalProviders>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
