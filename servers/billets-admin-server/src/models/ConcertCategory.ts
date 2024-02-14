import { prisma } from '..'

export default class ConcertCategory {
  public id?: number

  public title: string

  constructor(
    params: Required<Pick<ConcertCategory, 'title'>> &
      Pick<ConcertCategory, 'id'>
  ) {
    const { id, title } = params
    this.id = id
    this.title = title
  }

  public async create() {
    const { title } = this
    const created = await prisma.concertCategory.create({
      data: {
        title,
      },
    })
    return created
  }

  public static async find(id: number) {
    const concertCategory = await prisma.concertCategory.findUnique({
      where: {
        id,
      },
    })
    return concertCategory
  }

  public static async listAll() {
    const list = await prisma.concertCategory.findMany({})
    return list
  }
}
