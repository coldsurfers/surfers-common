import { PrismaClient } from '@prisma/client'

// for encode password for prisma postresql DATABASE_URL
export function percentEncodeAllChars(plainPassword: string) {
  var strEncoded = ''
  for (var i = 0, ilen = plainPassword.length; i < ilen; i++) {
    // @ts-ignore
    var strHex = parseInt(plainPassword.charCodeAt(i)).toString(16)
    strEncoded += '%' + strHex
  }
  return strEncoded
}

export const prismaClient = new PrismaClient()
