import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { BaseEntity } from '../../core/infra/base-entity'
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

export interface IDeleteUser {
  vendor: string
  vendorAccountId: string
}

export class User extends BaseEntity<UserProps> {
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
}
