import { UserModel } from '@/database/models'

enum SIGN_UP_SERVICE_ERROR_CODE {
  ALREADY_EXISTING_EMAIL = 'ALREADY_EXISTING_EMAIL',
  PASSWORD_NOT_MATCH = 'PASSWORD_NOT_MATCH',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type SignUpReturnType =
  | {
      isError: false
      data: UserModel
    }
  | {
      isError: true
      data: null
      errorCode: SIGN_UP_SERVICE_ERROR_CODE
    }

export const signUp = async (): Promise<SignUpReturnType> => {}
