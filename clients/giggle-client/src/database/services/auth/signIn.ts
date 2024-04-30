import { UserModel } from '@/database'
import encryptPassword from '@/libs/encryptPassword'
import { UserModelSerializedSchemaType } from '@/database/models/User'
import { createErrorResult, createSuccessResult } from '@/libs/createResult'

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
      data: UserModelSerializedSchemaType
    }
  | {
      isError: true
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
    const existingUser = await UserModel.findByEmail(email)

    if (!existingUser) {
      return createErrorResult<EMAIL_SIGN_IN_SERVICE_ERROR_CODE>(
        EMAIL_SIGN_IN_SERVICE_ERROR_CODE.NOT_EXISTING_ACCOUNT
      )
    }

    if (!existingUser.password || !existingUser.passwordSalt) {
      return createErrorResult<EMAIL_SIGN_IN_SERVICE_ERROR_CODE>(
        EMAIL_SIGN_IN_SERVICE_ERROR_CODE.PASSWORD_NOT_EXISTING
      )
    }

    if (
      !comparePasswords(
        password ?? '',
        existingUser.password,
        existingUser.passwordSalt
      )
    ) {
      return createErrorResult<EMAIL_SIGN_IN_SERVICE_ERROR_CODE>(
        EMAIL_SIGN_IN_SERVICE_ERROR_CODE.PASSWORD_NOT_MATCH
      )
    }

    const result = createSuccessResult(existingUser.serialize())
    return result
  } catch (error) {
    console.error(error)
    return createErrorResult<EMAIL_SIGN_IN_SERVICE_ERROR_CODE>(
      EMAIL_SIGN_IN_SERVICE_ERROR_CODE.UNKNOWN_ERROR
    )
  }
}

const comparePasswords = (
  plainPassword: string,
  hashedPassword: string,
  salt: string
): boolean => {
  const encryptedPassword = encryptPassword({
    plain: plainPassword,
    originalSalt: salt,
  }).encrypted
  return encryptedPassword === hashedPassword
}

const AuthSignInService = {
  emailSignIn,
}

export default AuthSignInService
