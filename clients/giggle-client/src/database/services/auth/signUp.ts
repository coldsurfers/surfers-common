import { UserModel } from '@/database/models'
import { UserModelSerialzedSchemaType } from '@/database/models/User'
import encryptPassword from '@/libs/encryptPassword'

export enum CHECK_EMAIL_SIGN_UP_SERVICE_ERROR_CODE {
  ALREADY_EXISTING_EMAIL = 'ALREADY_EXISTING_EMAIL',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type CheckEmailSignUpReturnType =
  | {
      isError: false
      data: UserModelSerialzedSchemaType | null
    }
  | {
      isError: true
      data: null
      errorCode: CHECK_EMAIL_SIGN_UP_SERVICE_ERROR_CODE
    }

const checkEmailForSignUp = async ({
  email,
}: {
  email: string
}): Promise<CheckEmailSignUpReturnType> => {
  try {
    const user = await UserModel.findByEmail(email)
    return {
      isError: false,
      data: user ? user.serialize() : null,
    }
  } catch (e) {
    console.error(e)
    return {
      isError: true,
      data: null,
      errorCode: CHECK_EMAIL_SIGN_UP_SERVICE_ERROR_CODE.UNKNOWN_ERROR,
    }
  }
}

export enum EMAIL_SIGN_UP_SERVICE_ERROR_CODE {
  PASSWORD_CONFIRM_IS_NOT_MATCH = 'PASSWORD_CONFIRM_IS_NOT_MATCH',
  ALREADY_EXISTING_ACCOUNT = 'ALREADY_EXISTING_ACCOUNT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type EmailSignUpReturnType =
  | {
      isError: false
      data: UserModelSerialzedSchemaType | null
    }
  | {
      isError: true
      data: null
      errorCode: EMAIL_SIGN_UP_SERVICE_ERROR_CODE
    }

const emailSignUp = async ({
  email,
  password,
  passwordConfirm,
}: {
  email: string
  password: string
  passwordConfirm: string
}): Promise<EmailSignUpReturnType> => {
  try {
    // check existing
    const existing = await UserModel.findByEmail(email)
    if (existing) {
      return {
        isError: true,
        errorCode: EMAIL_SIGN_UP_SERVICE_ERROR_CODE.ALREADY_EXISTING_ACCOUNT,
        data: null,
      }
    }

    if (password !== passwordConfirm) {
      return {
        isError: true,
        data: null,
        errorCode:
          EMAIL_SIGN_UP_SERVICE_ERROR_CODE.PASSWORD_CONFIRM_IS_NOT_MATCH,
      }
    }

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
      data: user.serialize(),
    }
  } catch (e) {
    console.error(e)
    return {
      isError: true,
      data: null,
      errorCode: EMAIL_SIGN_UP_SERVICE_ERROR_CODE.UNKNOWN_ERROR,
    }
  }
}

export enum SOCIAL_SIGN_UP_SERVICE_ERROR_CODE {
  ALREADY_EXISTING_ACCOUNT = 'ALREADY_EXISTING_ACCOUNT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type SocialSignUpReturnType =
  | {
      isError: false
      data: UserModelSerialzedSchemaType | null
    }
  | {
      isError: true
      data: null
      errorCode: SOCIAL_SIGN_UP_SERVICE_ERROR_CODE
    }

const socialSignUp = async ({
  email,
}: {
  email: string
}): Promise<SocialSignUpReturnType> => {
  try {
    const existing = await UserModel.findByEmail(email)
    if (existing) {
      return {
        isError: true,
        errorCode: SOCIAL_SIGN_UP_SERVICE_ERROR_CODE.ALREADY_EXISTING_ACCOUNT,
        data: null,
      }
    }

    const user = await new UserModel({
      email: email,
      password: null,
      passwordSalt: null,
      id: null,
      createdAt: null,
    }).create()

    return {
      isError: false,
      data: user.serialize(),
    }
  } catch (e) {
    console.error(e)
    return {
      isError: true,
      data: null,
      errorCode: SOCIAL_SIGN_UP_SERVICE_ERROR_CODE.UNKNOWN_ERROR,
    }
  }
}

const AuthSignUpService = {
  checkEmailForSignUp,
  emailSignUp,
  socialSignUp,
}

export default AuthSignUpService
