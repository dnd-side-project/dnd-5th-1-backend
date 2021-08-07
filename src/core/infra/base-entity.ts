import { UniqueEntityId } from 'core/infra/unique-entity-id'

export abstract class BaseEntity<T> {
  protected readonly _id: UniqueEntityId
  public readonly props: T

  constructor(props: T, _id?: UniqueEntityId) {
    this._id = _id ? _id : new UniqueEntityId()
    this.props = props
  }
}
