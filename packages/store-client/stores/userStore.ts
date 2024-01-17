/* eslint-disable import/no-extraneous-dependencies */
import { create } from 'zustand'
import { UserType } from '@coldsurfers/store-client/models/User'

export const useUserStore = create<{
  user: UserType | null
  // eslint-disable-next-line no-unused-vars
  login: (user: UserType) => void
}>((set) => ({
  user: null,
  login: (user) => set({ user }),
}))
