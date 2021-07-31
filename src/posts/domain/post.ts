import { BaseEntity } from 'core/infra/BaseEntity'
import { UniqueEntityId } from 'core/infra/unique-entity-id'

interface PostProps {
  title: string
  description?: string
  expiredAt: Date
}

export class Post extends BaseEntity<PostProps> {
  get id(): UniqueEntityId {
    return this._id
  }

  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  get expiredAt(): Date {
    return this.props.expiredAt
  }

  constructor(props: PostProps, id?: UniqueEntityId) {
    super(props, id)
  }
}
