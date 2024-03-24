import { signIn } from '@/libs/auth'
import { AuthError } from 'next-auth'

export const login = async () => {
  try {
    await signIn('google')
  } catch (e) {
    console.log(e instanceof AuthError)
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
