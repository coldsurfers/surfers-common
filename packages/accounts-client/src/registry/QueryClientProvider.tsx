'use client'

import { PropsWithChildren } from 'react'
import {
  QueryClientProvider as QCProvider,
  QueryClient,
} from '@tanstack/react-query'

export const queryClient = new QueryClient()

export function QueryClientProvider({ children }: PropsWithChildren) {
  return <QCProvider client={queryClient}>{children}</QCProvider>
}
