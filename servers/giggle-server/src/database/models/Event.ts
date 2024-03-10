import Artist from './Artist'
import Promoter from './Promoter'
import Venue from './Venue'

export default class Event {
  public id!: number

  public createdAt!: Date

  public promoter?: Promoter

  public promoterId?: number

  public venue?: Venue

  public venueId?: number

  public artist?: Artist

  public artistId?: number
}
