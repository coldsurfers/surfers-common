import { prisma } from '..'
import { createEmailAuthCode } from '../utils/createEmailAuthcode'

class EmailAuthRequest {
  public id?: number

  public email!: string

  public authcode?: string

  public authenticated?: boolean

  public createdAt?: Date

  constructor(
    params?: Pick<
      EmailAuthRequest,
      'id' | 'email' | 'authcode' | 'authenticated' | 'createdAt'
    >
  ) {
    if (!params) return
    this.id = params.id
    this.email = params.email
    this.authcode = params.authcode
    this.authenticated = params.authenticated
    this.createdAt = params.createdAt
  }

  public async create() {
    const created = await prisma.emailAuthRequest.create({
      data: {
        email: this.email,
        authcode: createEmailAuthCode(),
      },
      select: {
        id: true,
        email: true,
        authcode: true,
        createdAt: true,
      },
    })
    return created
  }

  public static async getLastOne(email: string) {
    const result = await prisma.emailAuthRequest.findFirst({
      where: {
        email,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        authcode: true,
        authenticated: true,
        createdAt: true,
      },
    })
    return result
  }

  public static async update(
    id: number,
    data: Pick<EmailAuthRequest, 'authenticated'>
  ) {
    const updated = await prisma.emailAuthRequest.update({
      where: {
        id,
      },
      data: {
        authenticated: !!data.authenticated,
      },
      select: {
        id: true,
        email: true,
        authenticated: true,
        createdAt: true,
      },
    })
    return updated
  }
}

export default EmailAuthRequest
