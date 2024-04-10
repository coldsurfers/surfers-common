import { create } from 'zustand'

export type SignUpTermsAndConditions = {
  termsAndConditions: boolean
  collectionData: boolean
} | null

interface SignUpStoreState {
  errorMessage: string
  email: string
  password: string
  username: string
  termsAndConditions: SignUpTermsAndConditions
}

interface SignUpStoreAction {
  setErrorMessage: (message: string) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setUsername: (username: string) => void
  setTermsAndConditions: (termsAndConditions: SignUpTermsAndConditions) => void
}

type SignUpStore = SignUpStoreState & SignUpStoreAction

const initialState: SignUpStoreState = {
  errorMessage: '',
  email: '',
  password: '',
  username: '',
  termsAndConditions: null,
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
  setTermsAndConditions: (termsAndConditions) =>
    set(() => ({
      termsAndConditions,
    })),
}))
