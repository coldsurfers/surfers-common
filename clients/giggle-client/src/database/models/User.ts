import { prismaClient } from '@/libs/database'
import { User } from '@prisma/client'
import { z } from 'zod'

export const UserModelSchema = z.object({
  id: z.number().nullable(),
  createdAt: z.string().datetime().nullable(),
  email: z.string().email(),
  password: z.string().nullable(),
  passwordSalt: z.string().nullable(),
})

export type UserModelSchemaType = z.infer<typeof UserModelSchema>

class UserModel {
  public id: number | null
  public createdAt: string | null
  public email!: string
  public password: string | null
  public passwordSalt: string | null

  constructor(params: UserModelSchemaType) {
    this.id = params.id
    this.createdAt = params.createdAt
    this.email = params.email
    this.password = params.password
    this.passwordSalt = params.passwordSalt
  }

  private static modelize(prismaModel: User) {
    return new UserModel({
      id: prismaModel.id,
      email: prismaModel.email,
      password: prismaModel.password,
      passwordSalt: prismaModel.passwordSalt,
      createdAt: prismaModel.createdAt.toISOString(),
    })
  }

  async create() {
    const created = await prismaClient.user.create({
      data: {
        email: this.email,
        password: this.password,
        passwordSalt: this.passwordSalt,
      },
    })

    return UserModel.modelize(created)
  }

  static async findByEmail(email: string) {
    const existing = await prismaClient.user.findFirst({
      where: {
        email,
      },
    })

    if (!existing) return null

    return UserModel.modelize(existing)
  }
}

export default UserModel
