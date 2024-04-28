import { prismaClient } from '@/libs/database'
import { EmailAuthRequest } from '@prisma/client'
import { z } from 'zod'

export const EmailAuthRequestModelSchema = z.object({
  id: z.string().uuid().nullable(),
  email: z.string().email(),
  authcode: z.string().length(6),
  authenticated: z.boolean(),
  createdAt: z.string().datetime().nullable(),
})

export type EmailAuthRequestModelSchemaType = z.TypeOf<
  typeof EmailAuthRequestModelSchema
>

export const EmailAuthRequestModelSerializedSchema = z.object({
  authcode: z.string(),
  authenticated: z.boolean(),
})
export type EmailAuthRequestModelSerializedSchemaType = z.TypeOf<
  typeof EmailAuthRequestModelSerializedSchema
>

class EmailAuthRequestModel {
  public id: string | null
  public email!: string
  public authcode!: string
  public authenticated!: boolean
  public createdAt: string | null

  constructor(params: EmailAuthRequestModelSchemaType) {
    this.id = params.id
    this.email = params.email
    this.authcode = params.authcode
    this.authenticated = params.authenticated
    this.createdAt = params.createdAt
  }

  public serialize(): EmailAuthRequestModelSerializedSchemaType {
    return {
      authcode: this.authcode,
      authenticated: this.authenticated,
    }
  }

  private static modelize(prismaModel: EmailAuthRequest) {
    return new EmailAuthRequestModel({
      id: prismaModel.id,
      authcode: prismaModel.authcode,
      authenticated: prismaModel.authenticated,
      createdAt: prismaModel.createdAt.toISOString(),
      email: prismaModel.email,
    })
  }

  async create() {
    const created = await prismaClient.emailAuthRequest.create({
      data: {
        authcode: this.authcode,
        authenticated: false,
        email: this.email,
      },
    })

    return EmailAuthRequestModel.modelize(created)
  }

  async update(authcode: string) {
    if (!this.id) {
      throw Error('EmailAuthRequestModel.update() - this.id is undefined')
    }
    const updated = await prismaClient.emailAuthRequest.update({
      where: {
        id: this.id,
      },
      data: {
        authcode,
      },
    })

    return EmailAuthRequestModel.modelize(updated)
  }

  static async findByEmail(email: string) {
    const existing = await prismaClient.emailAuthRequest.findFirst({
      where: {
        email,
      },
    })

    if (!existing) return null

    return EmailAuthRequestModel.modelize(existing)
  }

  async authenticate() {
    if (!this.id) {
      throw Error('EmailAuthRequestModel.authenticate() - this.id is undefined')
    }
    const updated = await prismaClient.emailAuthRequest.update({
      where: {
        id: this.id,
      },
      data: {
        authenticated: true,
        authenticatedAt: new Date(),
      },
    })
    return EmailAuthRequestModel.modelize(updated)
  }
}

export default EmailAuthRequestModel
