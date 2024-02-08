import { create } from 'zustand'

interface AccountsAppStore {
  redirectURI: string | null
  clientId: string | null
  // eslint-disable-next-line no-unused-vars
  setRedirectURI: (redirectURI: string) => void
  // eslint-disable-next-line no-unused-vars
  setClientId: (clientId: string) => void
}

export const useAccountsAppStore = create<AccountsAppStore>((set) => ({
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
}))
