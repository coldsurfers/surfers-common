import { UserModel } from '@/database/models'
import { UserModelSerialzedSchemaType } from '@/database/models/User'

enum CHECK_EMAIL_SIGN_UP_SERVICE_ERROR_CODE {
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

export const checkEmailForSignUp = async ({
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
