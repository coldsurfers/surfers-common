import Event from './Event'

export default class Venue {
  public id!: number

  public createdAt!: Date

  public events!: Event[]
}
