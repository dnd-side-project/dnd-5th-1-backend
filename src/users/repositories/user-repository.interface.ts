import { Repository } from 'core/infra/repository.interface.'
import { User } from 'users/domain/user'

export interface IUserRepository extends Repository<User> {
  findUserById(userId: string): Promise<User | null>
}
