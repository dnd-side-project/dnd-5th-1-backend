import { BaseEntity } from 'core/infra/base-entity'
import { UniqueEntityId } from 'core/infra/unique-entity-id'

interface PostProps {
  title: string
  expiredAt: Date
  userId: UniqueEntityId
}

export class Post extends BaseEntity<PostProps> {
  get id(): UniqueEntityId {
    return this._id
  }

  get userId(): UniqueEntityId {
    return this.props.userId
  }

  get title(): string {
    return this.props.title
  }

  get expiredAt(): Date {
    return this.props.expiredAt
  }

  constructor(props: PostProps, id?: UniqueEntityId) {
    super(props, id)
  }
}
