import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { Entity } from '../../core/infra/entity'
import { Nickname } from './nickname'
import { ImageUrl } from './image-url'
import { Vendor } from './vendor'

interface UserProps {
  nickname: Nickname
  email: string
  imageUrl: ImageUrl
  vendor: Vendor
  vendorAccountId: string
}

export class User extends Entity<UserProps> {
  get id(): UniqueEntityId {
    return this._id
  }

  get nickname(): Nickname {
    return this.props.nickname
  }

  get email(): string {
    return this.props.email
  }

  get imageUrl(): ImageUrl {
    return this.props.imageUrl
  }

  get vendor(): Vendor {
    return this.props.vendor
  }

  get vendorAccountId(): string {
    return this.props.vendorAccountId
  }

  constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id)
  }
  @Column('varchar', {
    name: 'email',
    nullable: true,
    comment: 'email',
    length: 200,
  })
  email!: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: 'created date',
  })
  createdAt!: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: 'updated date',
  })
  updatedAt!: Date
}
