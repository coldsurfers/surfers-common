import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import jwtDecode from 'jwt-decode'
import { FstvlLifeJwtPayload } from './types'

dotenv.config()

const { JWT_SECRET: secret } = process.env

/* eslint-disable import/prefer-default-export */
export function generateToken(payload: FstvlLifeJwtPayload) {
  if (!secret) {
    throw new Error('no secret')
  }
  return jwt.sign(payload, secret)
}

export function decodeToken(token: string) {
  try {
    const decoded = jwtDecode<FstvlLifeJwtPayload>(token)
    return decoded
  } catch (e) {
    return null
  }
}
