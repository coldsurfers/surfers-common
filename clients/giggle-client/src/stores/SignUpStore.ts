import { create } from 'zustand'

interface SignUpStoreState {
  step: number | null
}

interface SignUpStoreAction {
  increaseStep: () => void
  decreaseStep: () => void
}

type SignUpStore = SignUpStoreState & SignUpStoreAction

const useSignUpStore = () =>
  create<SignUpStore>((set) => ({
    step: null,
    increaseStep: () =>
      set((state) => ({
        step: typeof state.step === 'number' ? state.step + 1 : 1,
      })),
    decreaseStep: () =>
      set((state) => ({
        step: typeof state.step === 'number' ? state.step - 1 : null,
      })),
  }))

const SignUpStore = {
  useSignUpStore,
}

export default SignUpStore
