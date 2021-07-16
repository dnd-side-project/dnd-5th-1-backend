import { User } from 'users/domain/user'
import { IUserRepository } from 'users/repositories/user-repository.interface'

export class UserRepository implements IUserRepository {
  private data: any

  constructor() {
    this.data = {}
  }

  public async findUserById(userId: string): Promise<User | null> {
    const user = await this.data[userId]
    if (!!user == true) {
      return user
    }
    return null
  }

  public async exists(user: User): Promise<boolean> {
    const userId = user.id.toString()
    if (userId in this.data) {
      return !!user === true
    }
    return false
  }

  public async save(t: User): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public async delete(t: User): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
