import {
  ConcertTicketPriceModelSchemaType,
  ConcertTicketPriceModelSerializedSchemaType,
} from './schema'

// eslint-disable-next-line import/prefer-default-export
export class ConcertTicketPriceModel {
  private props: ConcertTicketPriceModelSchemaType

  constructor(props: ConcertTicketPriceModelSchemaType) {
    this.props = props
  }

  public serialize(): ConcertTicketPriceModelSerializedSchemaType {
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
    }
  }
}
