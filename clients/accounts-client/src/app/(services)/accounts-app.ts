import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { storageName } from '../../lib/constants'

interface AccountsAppStoreState {
  redirectURI: string | null
  clientId: string | null
}

interface AccountsAppStoreAction {
  // eslint-disable-next-line no-unused-vars
  setRedirectURI: (redirectURI: string) => void
  // eslint-disable-next-line no-unused-vars
  setClientId: (clientId: string) => void
}

export type AccountsAppStore = AccountsAppStoreState & AccountsAppStoreAction

export const useAccountsAppStore = create<AccountsAppStore>()(
  persist(
    (set) => ({
      redirectURI: null,
      clientId: null,
      setRedirectURI: (redirectURI) =>
        set(() => ({
          redirectURI,
        })),
      setClientId: (clientId) =>
        set(() => ({
          clientId,
        })),
    }),
    {
      name: storageName,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
