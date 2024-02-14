import {
  ConcertPosterModelSchemaType,
  ConcertPosterModelSerializedSchemaType,
} from './schema'

// eslint-disable-next-line import/prefer-default-export
export class ConcertPosterModel {
  private props: ConcertPosterModelSchemaType

  constructor(props: ConcertPosterModelSchemaType) {
    this.props = props
  }

  public serialize(): ConcertPosterModelSerializedSchemaType {
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
    }
  }
}
