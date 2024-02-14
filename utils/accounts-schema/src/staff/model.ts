import { prisma } from '../libs/prismaClient'
import { StaffModelSchemaType, StaffSerializedSchemaType } from './schema'

export class StaffModel {
  private props: StaffModelSchemaType

  public constructor(props: StaffModelSchemaType) {
    this.props = props
  }

  public async create(): Promise<StaffModel> {
    const created = await prisma.staff.create({
      data: {
        ...this.props,
      },
    })

    return new StaffModel({
      ...created,
    })
  }

  public static async findByStaffId(
    staffId: string
  ): Promise<StaffModel | null> {
    const found = await prisma.staff.findUnique({
      where: {
        id: staffId,
      },
    })
    if (!found) return null
    return new StaffModel({
      ...found,
    })
  }

  public static async findByAccountId(
    accountId: string
  ): Promise<StaffModel | null> {
    const staff = await prisma.staff.findUnique({
      where: {
        account_id: accountId,
      },
    })

    if (!staff) return null

    return new StaffModel({
      ...staff,
    })
  }

  public static async list({
    skip,
    take,
  }: {
    skip: number
    take: number
  }): Promise<StaffModel[]> {
    const list = await prisma.staff.findMany({
      skip,
      take,
    })

    return list.map(
      (staffEach) =>
        new StaffModel({
          ...staffEach,
        })
    )
  }

  public static async authorizeByStaffId(staffId: string): Promise<StaffModel> {
    const staff = await prisma.staff.update({
      where: {
        id: staffId,
      },
      data: {
        is_authorized: true,
      },
    })
    return new StaffModel({
      ...staff,
    })
  }

  public get is_staff() {
    return this.props.is_staff ?? false
  }

  public serialize(): StaffSerializedSchemaType {
    return {
      id: this.props.id ?? '',
      is_authorized: this.props.is_authorized ?? false,
      is_staff: this.props.is_staff ?? false,
      created_at: this.props.created_at?.toISOString() ?? '',
    }
  }
}
