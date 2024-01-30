import jwt, { VerifyErrors } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const { JWT_SECRET: secret } = process.env

interface EnvNotPreparedError {
  name: string
  message: string
}

export interface DecodeTokenError {
  error: VerifyErrors | EnvNotPreparedError
}

export interface DecodeTokenResponse {
  userId: string
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
}

// export interface DecodeSocialTokenResponse {
//     socialId: string
//     iss: string
//     sub: string
//     aud: string
//     exp: number
//     iat: number
// }

export const oneDay = 60 * 60 * 1000 * 24
export const oneWeek = oneDay * 7
export const oneYear = oneWeek * 52 + oneDay

export const generateToken = (userId: string): string | null => {
  if (!secret) {
    return null
  }
  const token = jwt.sign(
    {
      userId,
      iss: 'imnotserious.club',
      sub: 'jwt authentication token',
      aud: 'users',
      exp: Date.now() + oneYear,
      iat: Date.now(),
    },
    secret
  )

  return token
}

// export const generateTokenWithSocialId = (socialId: string): string | null => {
//     if (!secret) {
//         return null
//     }
//     const token = jwt.sign({
//         socialId,
//         iss: 'imnotserious.club',
//         sub: 'jwt authentication token',
//         aud: 'users',
//         exp: Date.now() + oneYear,
//         iat: Date.now(),
//     }, secret)

//     return token
// }

export const decodeToken = (
  token: string
): DecodeTokenResponse | DecodeTokenError => {
  if (!secret) {
    return {
      error: {
        name: 'EnvNotPrepared',
        message: 'invalid env secret',
      } as EnvNotPreparedError,
    }
  }
  try {
    const verified = jwt.verify(token, secret)
    if (verified) {
      const decoded = jwt.decode(token)
      if (!decoded) {
        return {
          error: {
            name: 'JsonWebTokenError',
            message: 'jwt malformed',
          },
        } as DecodeTokenError
      }
      return decoded as DecodeTokenResponse
    }
    return {
      error: {
        name: 'JsonWebTokenError',
        message: 'jwt malformed',
      },
    } as DecodeTokenError
  } catch (e) {
    return {
      error: e as VerifyErrors,
    } as DecodeTokenError
  }
}

// export const decodeSocialToken = (token: string): DecodeSocialTokenResponse | DecodeTokenError => {
//     if (!secret) {
//         return {
//             error: {
//                 name: "EnvNotPrepared",
//                 message: "invalid env secret"
//             } as EnvNotPreparedError
//         }
//     }
//     try {
//         const verified = jwt.verify(token, secret)
//         if (verified) {
//             const decoded = jwt.decode(token)
//             if (!decoded) {
//                 return {
//                     error: {
//                         name: "JsonWebTokenError",
//                         message: "jwt malformed"
//                     }
//                 } as DecodeTokenError
//             }
//             return decoded as DecodeSocialTokenResponse
//         }
//         return {
//             error: {
//                 name: "JsonWebTokenError",
//                 message: "jwt malformed"
//             }
//         } as DecodeTokenError
//     } catch (e) {
//         return {
//             error: e as VerifyErrors
//         } as DecodeTokenError
//     }
// }
