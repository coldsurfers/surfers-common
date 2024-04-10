import { create } from 'zustand'

interface SignUpStoreState {
  step: number | null
  errorMessage: string
}

interface SignUpStoreAction {
  initializeStep: () => void
  increaseStep: () => void
  decreaseStep: () => void
  setErrorMessage: (message: string) => void
}

type SignUpStore = SignUpStoreState & SignUpStoreAction

export const useSignUpStore = create<SignUpStore>((set) => ({
  step: null,
  errorMessage: '',
  initializeStep: () =>
    set(() => ({
      step: null,
    })),
  increaseStep: () =>
    set((state) => ({
      step: typeof state.step === 'number' ? state.step + 1 : 1,
    })),
  decreaseStep: () =>
    set((state) => ({
      step: typeof state.step === 'number' ? state.step - 1 : null,
    })),
  setErrorMessage: (message) =>
    set(() => ({
      errorMessage: message,
    })),
}))
