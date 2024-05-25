import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { storageName } from '../../lib/constants'

interface SendEmailStoreState {
  email: string | null
}

interface SendEmailStoreAction {
  // eslint-disable-next-line no-unused-vars
  setEmail: (email: string) => void
}

type SendEmailStore = SendEmailStoreState & SendEmailStoreAction

export const useSendEmailStore = create<SendEmailStore>()(
  persist(
    (set) => ({
      email: null,
      setEmail: (email) => set(() => ({ email })),
    }),
    {
      name: storageName,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
