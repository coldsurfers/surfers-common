'use client'

import StyledComponentsRegistry from './StyledComponentsRegistry'
import { combineProviders } from 'react-combine-provider'
import { PropsWithChildren } from 'react'

const Providers = combineProviders([StyledComponentsRegistry])

export default function GlobalProviders({ children }: PropsWithChildren) {
  return <Providers>{children}</Providers>
}
