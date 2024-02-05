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
}
