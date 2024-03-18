import { UserModel } from '@/database'

export const signIn = async ({
  email,
  password,
}: {
  email: string
  password?: string
}): Promise<UserModel | null> => {
  const emailSignInUser = !!password
  try {
    if (emailSignInUser) {
      // TODO: encrypt password with salt
      return null
    } else {
      const userModel = new UserModel({
        email: email,
        password: null,
        passwordSalt: null,
        createdAt: null,
        id: null,
      })
      const user = await userModel.create()
      return user
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
