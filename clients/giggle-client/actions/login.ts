'use server'

import { signIn } from '@/libs/auth'
import { AuthError } from 'next-auth'

export const emailSignInAction = async () => {
  try {
    await signIn('credentials', { redirect: false, email: '', password: '' })
  } catch (e) {
    console.log('My Error', e)
    if (e instanceof AuthError) {
      console.log('ERROR has been occurred')
      // switch (error.type) {
      //   case "CredentialsSignin":
      //     return { error: "Invalid credentials!" }
      //   default:
      //     return { error: "Something went wrong!" }
      // }
    }
  }
}
