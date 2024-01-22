import { prisma } from '..'
import decodeToken from '../utils/decodeToken'
import encryptPassword from '../utils/encryptPassword'

class User {
  public id?: number

  public email!: string

  public password!: string

  public passwordConfirm?: string

  public isAdmin!: boolean

  public passwordSalt?: string

  public createdAt?: Date

  constructor(
    params: Pick<
      User,
      | 'id'
      | 'email'
      | 'password'
      | 'passwordSalt'
      | 'passwordConfirm'
      | 'createdAt'
      | 'isAdmin'
    >
  ) {
    const {
      id,
      email,
      password,
      passwordConfirm,
      passwordSalt,
      createdAt,
      isAdmin,
    } = params
    this.id = id
    this.email = email
    this.password = password
    this.passwordConfirm = passwordConfirm
    this.passwordSalt = passwordSalt
    this.isAdmin = isAdmin
    this.createdAt = createdAt
  }

  public async create() {
    const { encrypted, salt } = encryptPassword({
      plain: this.password,
    })

    const created = await prisma.user.create({
      data: {
        email: this.email,
        password: encrypted,
        passwordSalt: salt,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
      },
    })
    return created
  }

  public static async findByEmail(
    email: string,
    select: {
      // eslint-disable-next-line no-unused-vars
      [key in keyof Partial<
        Pick<
          User,
          | 'password'
          | 'passwordConfirm'
          | 'passwordSalt'
          | 'createdAt'
          | 'isAdmin'
        >
      >]: boolean
    }
  ) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        ...select,
        id: true,
        email: true,
      },
    })
    return user
  }

  public static async findById(
    id: number,
    select: {
      // eslint-disable-next-line no-unused-vars
      [key in keyof Partial<
        Pick<
          User,
          | 'password'
          | 'passwordConfirm'
          | 'passwordSalt'
          | 'createdAt'
          | 'isAdmin'
        >
      >]: boolean
    }
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...select,
        id: true,
        email: true,
      },
    })
    return user
  }

  public static async findByToken(token: string) {
    const decoded = decodeToken(token)
    if (!decoded) return null
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    })
    return user
  }

  public static async checkAdmin(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isAdmin: true,
      },
    })
    if (!user) {
      return false
    }

    return user.isAdmin
  }
}

export default User
