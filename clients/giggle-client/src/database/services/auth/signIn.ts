import { UserModel } from '@/database'
import encryptPassword from '@/libs/encryptPassword'
import googleOAuthClient from '../../libs/googleOAuthClient'
import { UserModelSerialzedSchemaType } from '@/database/models/User'

export enum EMAIL_SIGN_IN_SERVICE_ERROR_CODE {
  ALREADY_EXISTING_EMAIL = 'ALREADY_EXISTING_EMAIL',
  PASSWORD_NOT_MATCH = 'PASSWORD_NOT_MATCH',
  NOT_EXISTING_ACCOUNT = 'NOT_EXISTING_ACCOUNT',
  PASSWORD_NOT_EXISTING = 'PASSWORD_NOT_EXISTING',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type EmailSignInReturnType =
  | {
      isError: false
      data: UserModelSerialzedSchemaType
    }
  | {
      isError: true
      data: null
      errorCode: EMAIL_SIGN_IN_SERVICE_ERROR_CODE
    }

const emailSignIn = async ({
  email,
  password,
}: {
  email: string
  password?: string
}): Promise<EmailSignInReturnType> => {
  try {
    // check existing email
    const existing = await UserModel.findByEmail(email)
    if (!existing) {
      return {
        isError: true,
        data: null,
        errorCode: EMAIL_SIGN_IN_SERVICE_ERROR_CODE.NOT_EXISTING_ACCOUNT,
      }
    }

    if (!existing.password || !existing.passwordSalt) {
      return {
        isError: true,
        data: null,
        errorCode: EMAIL_SIGN_IN_SERVICE_ERROR_CODE.PASSWORD_NOT_EXISTING,
      }
    }

    // existing account with email and password login
    if (
      existing.password !==
      encryptPassword({
        plain: password ?? '',
        originalSalt: existing.passwordSalt,
      }).encrypted
    ) {
      // password not correct
      return {
        isError: true,
        errorCode: EMAIL_SIGN_IN_SERVICE_ERROR_CODE.PASSWORD_NOT_MATCH,
        data: null,
      }
    }

    return {
      isError: false,
      data: existing.serialize(),
    }
  } catch (e) {
    console.error(e)
    return {
      isError: true,
      data: null,
      errorCode: EMAIL_SIGN_IN_SERVICE_ERROR_CODE.UNKNOWN_ERROR,
    }
  }
}

const AuthSignInService = {
  emailSignIn,
}

export default AuthSignInService