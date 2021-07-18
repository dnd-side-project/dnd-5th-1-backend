import { Repository } from 'core/infra/repository.interface.'
import { User } from 'users/domain/user'

export interface IUserRepository extends Repository<User> {
  findUserById(userId: string): Promise<User | null>
  findByVendorAndVendorAccountId(
    vendor: string,
    vendorAccountId: string
  ): Promise<User | null>
  createUser(
    nickname: string,
    vendor: string,
    vendorAccountId: string,
    email: string,
    image_url: string
  ): Promise<User | null >
}
