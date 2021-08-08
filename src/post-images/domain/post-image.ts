import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { BaseEntity } from '../../core/infra/base-entity'
import { Extension } from './extension'

interface PostImageProps {
  postId: UniqueEntityId
  originalName: string
  imageUrl: string
  thumbnailUrl: string
  isFirstPick: boolean
  extension: Extension
  width: number
  height: number
}

export class PostImage extends BaseEntity<PostImageProps> {
  get id(): UniqueEntityId {
    return this._id
  }

  get originalName(): string {
    return this.props.originalName
  }

  get postId(): UniqueEntityId {
    return this.props.postId
  }

  get imageUrl(): string {
    return this.props.imageUrl
  }

  get thumbnailUrl(): string {
    return this.props.thumbnailUrl
  }

  get isFirstPick(): boolean {
    return this.props.isFirstPick
  }

  get extension(): Extension {
    return this.props.extension
  }

  get width(): number {
    return this.props.width
  }

  get height(): number {
    return this.props.height
  }

  constructor(props: PostImageProps, id?: UniqueEntityId) {
    super(props, id)
  }
}
