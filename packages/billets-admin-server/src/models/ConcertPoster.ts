import { prisma } from '..'

class ConcertPoster {
  public id?: number

  public concertId?: number

  public imageURL!: string

  public createdAt?: Date

  constructor(
    params?: Pick<ConcertPoster, 'id' | 'concertId' | 'imageURL' | 'createdAt'>
  ) {
    if (!params) return
    this.id = params.id
    this.concertId = params.concertId
    this.imageURL = params.imageURL
    this.createdAt = params.createdAt
  }

  public async create() {
    if (!this.concertId) return null
    const created = await prisma.concertPoster.create({
      data: {
        concertId: this.concertId,
        imageURL: this.imageURL,
      },
      select: {
        concertId: true,
        createdAt: true,
        id: true,
        imageURL: true,
      },
    })
    return created
  }

  public static async update(
    id: number,
    params: Partial<Pick<ConcertPoster, 'imageURL'>>
  ) {
    const updated = await prisma.concertPoster.update({
      data: params,
      where: {
        id,
      },
    })
    return updated
  }
}

export default ConcertPoster
