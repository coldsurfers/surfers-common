import { UserModel } from '@/database/models'
import EmailAuthRequestModel, {
  EmailAuthRequestModelSerializedSchemaType,
} from '@/database/models/EmailAuthRequest'
import { UserModelSerializedSchemaType } from '@/database/models/User'
import authcodeGenerator from '@/libs/authcodeGenerator'
import encryptPassword from '@/libs/encryptPassword'

export enum CHECK_EMAIL_SIGN_UP_SERVICE_ERROR_CODE {
  ALREADY_EXISTING_EMAIL = 'ALREADY_EXISTING_EMAIL',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type CheckEmailSignUpReturnType =
  | {
      isError: false
      data: UserModelSerializedSchemaType | null
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
    // Find user by email
    const user = await UserModel.findByEmail(email)

    // Return user data if found, otherwise return null
    return {
      isError: false,
      data: user ? user.serialize() : null,
    }
  } catch (e) {
    // Log any errors and return an error response
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
  EMAIL_VERIFICATION_CODE_NOT_CORRECT = 'EMAIL_VERIFICATION_CODE_NOT_CORRECT',
}

type EmailSignUpReturnType =
  | {
      isError: false
      data: UserModelSerializedSchemaType | null
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
  verificationCode,
}: {
  email: string
  password: string
  passwordConfirm: string
  verificationCode: string
}): Promise<EmailSignUpReturnType> => {
  try {
    // Check if the user already exists
    const existing = await UserModel.findByEmail(email)
    if (existing) {
      return {
        isError: true,
        errorCode: EMAIL_SIGN_UP_SERVICE_ERROR_CODE.ALREADY_EXISTING_ACCOUNT,
        data: null,
      }
    }

    // Check the verification code and authenticate
    const emailAuthRequest = await EmailAuthRequestModel.findByEmail(email)
    if (!emailAuthRequest || emailAuthRequest.authcode !== verificationCode) {
      return {
        isError: true,
        errorCode:
          EMAIL_SIGN_UP_SERVICE_ERROR_CODE.EMAIL_VERIFICATION_CODE_NOT_CORRECT,
        data: null,
      }
    }
    await emailAuthRequest.authenticate()

    // Check if passwords match
    if (password !== passwordConfirm) {
      return {
        isError: true,
        data: null,
        errorCode:
          EMAIL_SIGN_UP_SERVICE_ERROR_CODE.PASSWORD_CONFIRM_IS_NOT_MATCH,
      }
    }

    // Encrypt the password and create the user
    const encrypted = encryptPassword({ plain: password })
    const { encrypted: encryptedPassword, salt: passwordSalt } = encrypted
    const user = await new UserModel({
      email,
      password: encryptedPassword,
      passwordSalt,
      id: null,
      createdAt: null,
    }).create()

    return {
      isError: false,
      data: user.serialize(),
    }
  } catch (e) {
    // Log any errors and return an error response
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
      data: UserModelSerializedSchemaType | null
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
    // Check if the user already exists
    const existing = await UserModel.findByEmail(email)

    // If the user already exists, return an error
    if (existing) {
      return {
        isError: true,
        errorCode: SOCIAL_SIGN_UP_SERVICE_ERROR_CODE.ALREADY_EXISTING_ACCOUNT,
        data: null,
      }
    }

    // Create a new user
    const user = await new UserModel({
      email,
      password: null,
      passwordSalt: null,
      id: null,
      createdAt: null,
    }).create()

    // Return the serialized user data
    return {
      isError: false,
      data: user.serialize(),
    }
  } catch (e) {
    // Log any errors and return an error response
    console.error(e)
    return {
      isError: true,
      data: null,
      errorCode: SOCIAL_SIGN_UP_SERVICE_ERROR_CODE.UNKNOWN_ERROR,
    }
  }
}

export type CREATE_OR_SEND_SIGN_UP_EMAIL_VERIFICATION_SERVICE_ERROR_CODE =
  | 'ALREADY_AUTHENTICATED'
  | 'UNKNOWN_ERROR'

export type CreateOrSendSignUpEmailVerificationReturnType =
  | {
      isError: false
      data: EmailAuthRequestModelSerializedSchemaType
    }
  | {
      isError: true
      error: CREATE_OR_SEND_SIGN_UP_EMAIL_VERIFICATION_SERVICE_ERROR_CODE
    }

const createOrUpdateSignUpEmailVerification = async (
  email: string
): Promise<CreateOrSendSignUpEmailVerificationReturnType> => {
  try {
    // Check if there's an existing email authentication request
    const existing = await EmailAuthRequestModel.findByEmail(email)

    // If there's an existing request and it's already authenticated, return an error
    if (existing?.authenticated) {
      return {
        isError: true,
        error: 'ALREADY_AUTHENTICATED',
      }
    }

    // If there's an existing request, update it with a new authentication code
    if (existing) {
      const updated = await existing.update(authcodeGenerator.generate())
      return {
        isError: false,
        data: updated.serialize(),
      }
    } else {
      // If there's no existing request, create a new one
      const created = await new EmailAuthRequestModel({
        email,
        authcode: authcodeGenerator.generate(),
        authenticated: false,
        id: null,
        createdAt: null,
      }).create()
      return {
        isError: false,
        data: created.serialize(),
      }
    }
  } catch (e) {
    // Log any errors and return an error response
    console.error(e)
    return {
      isError: true,
      error: 'UNKNOWN_ERROR',
    }
  }
}

const AuthSignUpService = {
  checkEmailForSignUp,
  emailSignUp,
  socialSignUp,
  createOrUpdateSignUpEmailVerification,
}

export default AuthSignUpService
