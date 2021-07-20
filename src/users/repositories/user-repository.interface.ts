import { Repository } from 'core/infra/repository.interface.'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { User } from 'users/domain/user'
import { Vendor } from 'users/domain/vendor'

export interface IUserRepository extends Repository<User> {
  findUserById(userId: UniqueEntityId): User | null
  findByVendorAndVendorAccountId(
    vendor: Vendor,
    vendorAccountId: string
  ): User | null
  createAndSave(user: User): User | null
}
