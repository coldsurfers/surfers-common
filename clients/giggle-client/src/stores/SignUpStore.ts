import { create } from 'zustand'

export type SignUpTermsAndConditions = {
  termsAndConditions: boolean
  collectionData: boolean
} | null

export type SignUpStoreStateMetaType = {
  provider: 'google' | 'credentials' | null
  accessToken: string | null
}

interface SignUpStoreState {
  errorMessage: string
  email: string
  password: string
  username: string
  termsAndConditions: SignUpTermsAndConditions
  emailVerificationCode: string
  meta: SignUpStoreStateMetaType
}

interface SignUpStoreAction {
  setErrorMessage: (message: string) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setUsername: (username: string) => void
  setTermsAndConditions: (termsAndConditions: SignUpTermsAndConditions) => void
  setEmailVerificationCode: (emailVerificationCode: string) => void
  setMeta: (meta: SignUpStoreStateMetaType) => void
}

type SignUpStore = SignUpStoreState & SignUpStoreAction

const initialState: SignUpStoreState = {
  errorMessage: '',
  email: '',
  password: '',
  username: '',
  termsAndConditions: null,
  emailVerificationCode: '',
  meta: {
    provider: null,
    accessToken: null,
  },
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
  setEmailVerificationCode: (emailVerificationCode) =>
    set(() => ({
      emailVerificationCode,
    })),
  setMeta: (meta) => set(() => ({ meta })),
}))
