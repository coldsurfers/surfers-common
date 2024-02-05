import { ConcertTicketPriceModel } from '../concert-ticket-price'
import {
  ConcertTicketModelSchemaType,
  ConcertTicketModelSerializedSchemaType,
} from './schema'

// eslint-disable-next-line import/prefer-default-export
export class ConcertTicketModel {
  private props: ConcertTicketModelSchemaType

  constructor(props: ConcertTicketModelSchemaType) {
    this.props = props
  }

  public serialize(): ConcertTicketModelSerializedSchemaType {
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
      ticketPrices: this.props.ticketPrices.map((each) =>
        new ConcertTicketPriceModel({
          ...each,
        }).serialize()
      ),
      openDate: this.props.openDate.toISOString(),
    }
  }
}
