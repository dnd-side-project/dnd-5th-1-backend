import { BaseEntity } from 'core/infra/base-entity'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { Category } from './category'

interface VoteProps {
  userId: UniqueEntityId
  postId: UniqueEntityId
  postImageId: UniqueEntityId
  category: Category
}

export class Vote extends BaseEntity<VoteProps> {
  get id(): UniqueEntityId {
    return this._id
  }

  get userId(): UniqueEntityId {
    return this.props.userId
  }

  get postId(): UniqueEntityId {
    return this.props.postId
  }

  get postImageId(): UniqueEntityId {
    return this.props.postImageId
  }

  get category(): Category {
    return this.props.category
  }

  constructor(props: VoteProps, id?: UniqueEntityId) {
    super(props, id)
  }
}
