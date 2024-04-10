import { create } from 'zustand'

interface SignUpStoreState {
  errorMessage: string
  email: string
  password: string
  username: string
}

interface SignUpStoreAction {
  setErrorMessage: (message: string) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setUsername: (username: string) => void
}

type SignUpStore = SignUpStoreState & SignUpStoreAction

const initialState: SignUpStoreState = {
  errorMessage: '',
  email: '',
  password: '',
  username: '',
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  ...initialState,
  setErrorMessage: (message) =>
    set(() => ({
      errorMessage: message,
    })),
  setEmail: (email) =>
    set(() => ({
      email,
    })),
  setPassword: (password) =>
    set(() => ({
      password,
    })),
  setUsername: (username) =>
    set(() => ({
      username,
    })),
}))
