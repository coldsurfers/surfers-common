import { EmailAuthRequestModelSchemaType } from './schema'

export class EmailAuthRequestModel {
  private props: EmailAuthRequestModelSchemaType

  constructor(props: EmailAuthRequestModelSchemaType) {
    this.props = props
  }
}
