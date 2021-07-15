import { UniqueEntityId } from 'domain/value-objects/UniqueEntityId'
import { Entity } from './Entitiy'

interface UserProps {
  id: string
  name: string
  email: string
  image_url?: string
}

export class User extends Entity<UserProps> {
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

// const buildCreateUser = ({ Id }) => {
//   const CreateUser = ({
//     id = Id.createId(),
//     name,
//     email,
//     image_url,
//   }: CreateUserProps) => {
//     // TO-DO: add proper validation methods for each VOs
//     if (!Id.isValidId(id)) {
//       throw new Error('User must have a valid id')
//     }
//     if (!name) {
//       throw new Error('User must have a name')
//     }
//     if (!email) {
//       throw new Error('User must have an email')
//     }

//     return Object.freeze({
//       getId: () => id,
//       getName: () => name,
//       getEmail: () => email,
//       getImageUrl: () => image_url,
//     })
//   }
//   return CreateUser
// }

// export default buildCreateUser
