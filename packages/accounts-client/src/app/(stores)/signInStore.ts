import { create } from 'zustand'

interface SignInStore {
  email: string | null
  // eslint-disable-next-line no-unused-vars
  setEmail: (email: string) => void
}

export const useSignInStore = create<SignInStore>((set) => ({
  email: null,
  setEmail: (email) =>
    set(() => ({
      email,
    })),
}))
