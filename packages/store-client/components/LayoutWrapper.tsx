'use client'

import { PropsWithChildren } from 'react'
import styled from '@emotion/styled'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, signIn } from 'next-auth/react'
import { Session } from 'next-auth/types'
import { LoginModal } from '@coldsurfers/accounts-ui'
import { ModalPortal } from '@coldsurfers/surfers-ui'
import Header from './Header'
import Footer from './Footer'
import { useLoginModalStore } from '@/stores/loginModalStore'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
`

const ChildrenWrapper = styled.div`
  flex: 1;
`

export const queryClient = new QueryClient({})

export default function LayoutWrapper({
  children,
  session,
}: PropsWithChildren<{
  session?: Session | null
}>) {
  const { isOpen, close } = useLoginModalStore()
  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Container>
            <Header />
            <ChildrenWrapper>{children}</ChildrenWrapper>
            <Footer />
            <LoginModal
              isOpen={isOpen}
              onClickBackground={close}
              // eslint-disable-next-line no-void
              onClickGoogleLogin={async () => void (await signIn('google'))}
            />
          </Container>
        </QueryClientProvider>
      </SessionProvider>
      <ModalPortal.Pillar />
    </>
  )
}
