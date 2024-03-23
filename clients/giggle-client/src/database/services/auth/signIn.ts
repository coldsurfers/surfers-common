import { UserModel } from '@/database'
import encryptPassword from '@/libs/encryptPassword'
import googleOAuthClient from '../../libs/googleOAuthClient'

enum SIGN_IN_SERVICE_ERROR_CODE {
  ALREADY_EXISTING_EMAIL = 'ALREADY_EXISTING_EMAIL',
  PASSWORD_NOT_MATCH = 'PASSWORD_NOT_MATCH',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type SignInReturnType =
  | {
      isError: false
      data: UserModel
    }
  | {
      isError: true
      data: null
      errorCode: SIGN_IN_SERVICE_ERROR_CODE
    }

export const signIn = async ({
  email,
  password,
}: {
  email: string
  password?: string
}): Promise<SignInReturnType> => {
  const emailSignInUser = !!password
  try {
    // TODO: check existing email
    const existing = await UserModel.findByEmail(email)
    if (!existing) {
      // TODO: signup
      if (emailSignInUser) {
        // TODO: signup with email and password
        const encrypted = encryptPassword({
          plain: password,
        })
        const { encrypted: encryptedPassword, salt: passwordSalt } = encrypted
        const user = await new UserModel({
          email: email,
          password: encryptedPassword,
          passwordSalt: passwordSalt,
          id: null,
          createdAt: null,
        }).create()
        return {
          isError: false,
          data: user,
        }
      } else {
        // TODO: signup with social login services
        const user = await new UserModel({
          email: email,
          password: null,
          passwordSalt: null,
          id: null,
          createdAt: null,
        }).create()
        return {
          isError: false,
          data: user,
        }
      }
    }

    // TODO: existing account with email and password login
    if (!!existing.password && !!existing.passwordSalt) {
      if (
        existing.password !==
        encryptPassword({
          plain: password ?? '',
          originalSalt: existing.passwordSalt,
        }).encrypted
      ) {
        // TODO: password not correct
        return {
          isError: true,
          errorCode: SIGN_IN_SERVICE_ERROR_CODE.PASSWORD_NOT_MATCH,
          data: null,
        }
      }
    }

    // TODO: social logged in users
    return {
      isError: false,
      data: existing,
    }
  } catch (e) {
    console.error(e)
    return {
      isError: true,
      data: null,
      errorCode: SIGN_IN_SERVICE_ERROR_CODE.UNKNOWN_ERROR,
    }
  }
}

export const verifyGoogleAccessToken = async (accessToken: string) => {
  try {
    const verified = await googleOAuthClient.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })
    return verified
  } catch (e) {
    console.error(e)
    return undefined
  }
}
