import { prisma } from '../libs/prismaClient'
import { EmailAuthRequestModelSchemaType } from './schema'

export class EmailAuthRequestModel {
  private props: EmailAuthRequestModelSchemaType

  constructor(props: EmailAuthRequestModelSchemaType) {
    this.props = props
  }

  public get email() {
    return this.props.email
  }

  public get authcode() {
    return this.props.authcode
  }

  public get authenticated() {
    return this.props.authenticated
  }

  public async create() {
    const created = await prisma.emailAuthRequest.create({
      data: {
        authcode: this.props.authcode,
        email: this.props.email,
      },
    })

    return new EmailAuthRequestModel({
      ...created,
    })
  }

  public async updateAuthcode(authcode: string) {
    const updated = await prisma.emailAuthRequest.update({
      where: {
        id: this.props.id,
      },
      data: {
        authcode,
      },
    })
    return new EmailAuthRequestModel({
      ...updated,
    })
  }

  public async authenticate(): Promise<void> {
    await prisma.emailAuthRequest.update({
      where: {
        id: this.props.id,
      },
      data: {
        authenticated: true,
      },
    })
  }

  public static async findLatestByEmail(email: string) {
    const existing = await prisma.emailAuthRequest.findFirst({
      where: {
        email,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!existing) return null

    return new EmailAuthRequestModel({
      ...existing,
    })
  }
}
