import { getRepository } from 'typeorm'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
import User from '../entity/User'
import { decodeToken, DecodeTokenResponse } from './token'

dotenv.config()

const {
  HEADER_AUTHORIZATION_SECRET: headerAuthorizationSecret,
  PASSWORD_SECRET: passwordSecret,
} = process.env

export const getUser = async (token: string) => {
  try {
    const decoded = decodeToken(token) as { userId: string } | null
    if (!decoded) {
      return null
    }
    const user = await getRepository(User).findOne({
      where: {
        id: decoded.userId,
      },
    })
    if (!user) {
      return null
    }
    return user
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getSocialUser = async (encrypted: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      encrypted,
      headerAuthorizationSecret ?? ''
    )

    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as {
      socialId: string
      socialCompany: 'APPLE' | 'KAKAO'
      emailUserToken: string
      userEmail: string
    }
    if (decrypted.socialId && decrypted.socialCompany) {
      const user = await getRepository(User).findOne({
        where: {
          socialId: decrypted.socialId,
          socialCompany: decrypted.socialCompany,
        },
      })
      if (!user) {
        return null
      }
      return user
    }
    if (decrypted.userEmail && decrypted.emailUserToken) {
      const decodedToken = decodeToken(
        decrypted.emailUserToken
      ) as DecodeTokenResponse
      const user = await getRepository(User).findOne({
        where: {
          email: decrypted.userEmail,
        },
      })
      if (!user || user.id !== decodedToken.userId) {
        return null
      }
      return user
    }
    return null
  } catch (e) {
    return null
  }
}

export function validateUsername(username: string): boolean {
  // eslint-disable-next-line prefer-regex-literals
  const instagramUsernameRegex = new RegExp(
    /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/
  )
  const validated = instagramUsernameRegex.test(username)

  return validated
}

export function encryptPassword(password: string): string {
  if (!passwordSecret) {
    throw Error('password secret key is not existing')
  }
  const encrypted = CryptoJS.AES.encrypt(password, passwordSecret)
  return encrypted.toString()
}

export function decryptPassword(encrypted: string): string {
  if (!passwordSecret) {
    throw Error('password secret key is not existing')
  }
  const decrypted = CryptoJS.AES.decrypt(encrypted, passwordSecret)
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export function generateEmailValidationCode(): number {
  return Math.floor(100000 + Math.random() * 900000)
}

export function generateRandomHash(): string {
  return Math.random().toString(36).substring(7)
}

// 최소 1개의 대문자, 1개의 소문자, 1개의 특수문자, 최소 8자이상 최대 32자 이하
export function validatePassword(password: string) {
  const checkSpecial = /[*@!#%&()^~{}]+/.test(password)
  const checkUpper = /[A-Z]+/.test(password)
  const checkLower = /[a-z]+/.test(password)
  const checkLength = password.length >= 8 && password.length <= 32
  let r = false

  if (checkUpper && checkLower && checkSpecial && checkLength) {
    r = true
  }

  return r
}
