import { EntityRepository, Repository } from 'typeorm'
import { User } from 'users/domain/user'
import { IUserRepository } from 'users/repositories/user-repository.interface'

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {

  public async findUserById(userId: string): Promise<User | null> {
    const user = await this.findOne({
      id: userId
    })
    if (!user) {
      return null
    }
    return user
  }

  public async exists(user: User): Promise<boolean> {
    return false
  }

  public async save(t: User): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public async delete(t: User): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
