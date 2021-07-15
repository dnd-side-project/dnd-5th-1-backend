import { UniqueEntityId } from 'domain/value-objects/UniqueEntityId'

export abstract class Entity<T> {
  // chagne _id type to id VO
  protected readonly _id: UniqueEntityId
  public readonly props: T

  constructor(props: T, _id?: UniqueEntityId) {
    this._id = _id ? _id : new UniqueEntityId()
    this.props = props
  }
}
