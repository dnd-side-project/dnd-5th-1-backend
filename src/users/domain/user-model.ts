import { BaseEntity } from 'core/infra/base-entity'
import { UniqueEntityId } from 'core/infra/unique-entity-id'

interface UserProps {
  name: string
  email: string
  image_url?: string
}

export class User extends BaseEntity<UserProps> {
  get id(): UniqueEntityId {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get image_url(): string | undefined {
    return this.props.image_url
  }

  constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id)
  }
}
