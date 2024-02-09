import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { storageName } from '../../lib/constants'

interface SignInStore {
  email: string | null
  // eslint-disable-next-line no-unused-vars
  setEmail: (email: string) => void
}

export const useSignInStore = create<SignInStore>()(
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
