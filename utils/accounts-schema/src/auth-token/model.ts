import { prisma } from '../libs/prismaClient'
import {
  AuthTokenModelSchemaType,
  AuthTokenSerializedSchemaType,
} from './schema'

export class AuthTokenModel {
  private props: AuthTokenModelSchemaType

  constructor(props: AuthTokenModelSchemaType) {
    this.props = props
  }

  public static async findByAccountId(accountId: string) {
    // eslint-disable-next-line no-return-await, no-underscore-dangle
    const _authToken = await prisma.authToken.findUnique({
      where: {
        account_id: accountId,
      },
    })

    if (!_authToken) return null

    const authToken = new AuthTokenModel({
      access_token: _authToken.access_token,
      refresh_token: _authToken.refresh_token,
      account_id: _authToken.account_id,
      id: _authToken.id,
      created_at: _authToken.created_at,
    })

    return authToken
  }

  public static async deleteByAccountId(accountId: string) {
    await prisma.authToken.delete({
      where: {
        account_id: accountId,
      },
    })
  }

  public static async deleteById(id: string) {
    await prisma.authToken.delete({
      where: {
        id,
      },
    })
  }

  public async create() {
    const existing = await AuthTokenModel.findByAccountId(this.props.account_id)
    if (existing && existing?.props.id) {
      await AuthTokenModel.deleteById(existing.props.id)
    }
    // eslint-disable-next-line no-return-await, no-underscore-dangle
    const _authToken = await prisma.authToken.create({
      data: {
        access_token: this.props.access_token,
        refresh_token: this.props.refresh_token,
        account_id: this.props.account_id,
      },
    })

    const authToken = new AuthTokenModel({
      ..._authToken,
    })

    return authToken
  }

  public serialize(): AuthTokenSerializedSchemaType {
    return {
      access_token: this.props.access_token,
      refresh_token: this.props.refresh_token,
    }
  }
}
