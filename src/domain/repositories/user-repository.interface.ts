import { Repository } from 'core/infra/Repository.interface.'
import { User } from 'domain/entities/User'

export interface IUserRepository extends Repository<User> {
  findUserById(userId: string): Promise<User>
}
