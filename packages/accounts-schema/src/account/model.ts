import { prisma } from '../libs/prismaClient'
import { StaffModel } from '../staff/model'
import { AccountModelSchemaType, AccountSerializedSchemaType } from './schema'

export class AccountModel {
  private props: AccountModelSchemaType

  constructor(props: AccountModelSchemaType) {
    this.props = props
  }

  public get id() {
    return this.props.id
  }

  public get email() {
    return this.props.email
  }

  public get staff() {
    return this.props.staff
  }

  public get created_at() {
    return this.props.created_at
  }

  public get password() {
    return this.props.password
  }

  public get passwordSalt() {
    return this.props.passwordSalt
  }

  public static async findByAccessToken(accessToken: string) {
    const authToken = await prisma.authToken.findFirst({
      where: {
        access_token: accessToken,
      },
    })
    if (!authToken) return null

    // eslint-disable-next-line no-underscore-dangle
    const _account = await prisma.account.findUnique({
      where: {
        id: authToken.account_id,
      },
      include: {
        staff: true,
      },
    })

    if (!_account) return null

    const account = new AccountModel({
      id: _account.id,
      password: _account.password ?? undefined,
      passwordSalt: _account.passwordSalt ?? undefined,
      provider: _account.provider ?? undefined,
      staff: _account.staff ?? undefined,
      username: _account.username ?? undefined,
      email: _account.email,
      created_at: _account.created_at ?? undefined,
    })

    return account
  }

  public static async findById(id: string) {
    // eslint-disable-next-line no-underscore-dangle
    const _account = await prisma.account.findUnique({
      where: {
        id,
      },
      include: {
        staff: true,
      },
    })

    if (!_account) return null

    const account = new AccountModel({
      id: _account.id,
      password: _account.password ?? undefined,
      passwordSalt: _account.passwordSalt ?? undefined,
      provider: _account.provider ?? undefined,
      staff: _account.staff ?? undefined,
      username: _account.username ?? undefined,
      email: _account.email,
      created_at: _account.created_at ?? undefined,
    })

    return account
  }

  public static async findByEmail(email: string) {
    // eslint-disable-next-line no-underscore-dangle
    const _user = await prisma.account.findUnique({
      where: {
        email,
      },
    })

    if (!_user) return null

    const user = new AccountModel({
      ..._user,
      username: _user.username ?? undefined,
      password: _user.password ?? undefined,
      passwordSalt: _user.passwordSalt ?? undefined,
      provider: _user.provider ?? undefined,
    })

    return user
  }

  public static async list({
    skip,
    take,
    includeStaff = false,
  }: {
    skip: number
    take: number
    includeStaff?: boolean
  }): Promise<{
    list: AccountModel[]
    totalCount: number
  }> {
    const [list, totalCount] = await prisma.$transaction([
      prisma.account.findMany({
        include: {
          staff: includeStaff,
        },
        skip,
        take,
      }),
      prisma.account.count(),
    ])

    const accountList = list.map(
      (_user) =>
        new AccountModel({
          ..._user,
          username: _user.username ?? undefined,
          password: _user.password ?? undefined,
          passwordSalt: _user.passwordSalt ?? undefined,
          provider: _user.provider ?? undefined,
          staff: _user.staff ? _user.staff : undefined,
        })
    )

    return {
      list: accountList,
      totalCount,
    }
  }

  public async create(): Promise<AccountModel> {
    const created = await prisma.account.create({
      data: {
        ...this.props,
        staff: {
          create: {
            is_authorized: false,
            is_staff: false,
          },
        },
      },
    })

    return new AccountModel({
      ...created,
      email: created.email,
      password: created.password ?? undefined,
      passwordSalt: created.passwordSalt ?? undefined,
      provider: created.provider ?? undefined,
      username: created.username ?? undefined,
    })
  }

  public static async changeEmail({
    userId,
    email,
  }: {
    userId: string
    email: string
  }) {
    const updated = await prisma.account.update({
      where: {
        id: userId,
      },
      data: {
        email,
      },
    })

    const user = new AccountModel({
      ...updated,
      username: updated.username ?? undefined,
      password: updated.password ?? undefined,
      passwordSalt: updated.passwordSalt ?? undefined,
      provider: updated.provider ?? undefined,
    })

    return user
  }

  public static async changePassword({
    userId,
    password,
    passwordSalt,
  }: {
    userId: string
    password: string
    passwordSalt: string
  }) {
    const updated = await prisma.account.update({
      where: {
        id: userId,
      },
      data: {
        password,
        passwordSalt,
      },
    })

    const user = new AccountModel({
      ...updated,
      username: updated.username ?? undefined,
      password: updated.password ?? undefined,
      passwordSalt: updated.passwordSalt ?? undefined,
      provider: updated.provider ?? undefined,
    })

    return user
  }

  public serialize(): AccountSerializedSchemaType {
    const staff = this.props.staff
      ? new StaffModel({
          ...this.props.staff,
        })
      : undefined
    return {
      id: this.props.id ?? '',
      email: this.props.email,
      username: this.props.username ?? '',
      created_at: this.props.created_at?.toISOString() ?? '',
      staff: staff?.serialize() ?? undefined,
    }
  }
}
