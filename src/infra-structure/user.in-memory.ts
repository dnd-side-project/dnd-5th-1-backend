import { User } from 'domain/entities/User'
import { IUserRepository } from 'domain/repositories/user-repository.interface'

export class UserRepository implements IUserRepository {
  private data: any

  constructor() {
    this.data = {}
  }

  findUserById(userId: string): Promise<User> {
    throw new Error('Method not implemented.')
  }

  exists(t: User): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  save(t: User): Promise<any> {
    throw new Error('Method not implemented.')
  }

  delete(t: User): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
