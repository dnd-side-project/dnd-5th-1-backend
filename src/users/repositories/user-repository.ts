import { EntityRepository, Repository } from 'typeorm'
import { User } from 'users/domain/user'
import { IUserRepository } from 'users/repositories/user-repository.interface'

@EntityRepository(User)
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  public async findUserById(userId: string): Promise<User | null> {
    const user = await this.findOne({
      id: userId,
    })
    if (!user) {
      return null
    }
    return user
  }

  public async findByVendorAndVendorAccountId(
    vendor: string,
    vendorAccountId: string
  ): Promise<User | null> {
    const user = await this.findOne({
      where: [{ vendor: vendor }, { vendor_account_id: vendorAccountId }],
    })

    return user ? user : null
  }

  public async createUser(
    nickname: string,
    vendor: string,
    vendorAccountId: string,
    email: string,
    image_url: string
  ): Promise<User | null > {
    const user = this.create({
      nickname: nickname,
      vendor: vendor,
      vendorAccountId: vendorAccountId,
      email: email,
      image_url: image_url
    })
    const createdUser = await this.save(user)
    return createdUser ? createdUser : null
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
