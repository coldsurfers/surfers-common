import Event from './Event'

export default class Artist {
  public id!: number

  public createdAt!: Date

  public events!: Event[]
}
