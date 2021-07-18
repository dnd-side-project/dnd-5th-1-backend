import { EntityRepository, Repository } from 'typeorm'
import { UserModel } from 'infra/models/user-model'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import { User } from 'users/domain/user'
import { UserMapper } from 'users/mappers/user-mapper'
import { Vendor } from 'users/domain/vendor'
import { UniqueEntityId } from '../../core/infra/unique-entity-id'

@EntityRepository(UserModel)
export class UserRepository
  extends Repository<UserModel>
  implements IUserRepository
{
  public async findUserById(userId: UniqueEntityId): Promise<User | null> {
    const user = await super.findOne({
      id: userId.toString(),
    })
    return user ? UserMapper.toDomain(user) : null
  }

  public async findByVendorAndVendorAccountId(
    vendor: Vendor,
    vendorAccountId: string
  ): Promise<User | null> {
    const user = await super.findOne({
      where: [{ vendor: vendor.value }, { vendor_account_id: vendorAccountId }],
    })

    return user ? UserMapper.toDomain(user) : null
  }

  public async createAndSave(user: User): Promise<User | null> {
    const createdUser = await super.save(UserMapper.toPersistence(user))
    return createdUser ? UserMapper.toDomain(createdUser) : null
  }

  public async exists(user: User): Promise<boolean> {
    const userExists = await this.findByVendorAndVendorAccountId(
      user.vendor,
      user.vendorAccountId
    )
    return userExists ? true : false
  }

  public async saveEntity(user: User): Promise<void> {
    const exists = await this.exists(user)
    try {
      if (!exists) {
        await this.createAndSave(user)
      } else {
        await super.save(UserMapper.toPersistence(user))
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async deleteEntity(user: User): Promise<void> {
    const exists = await this.findByVendorAndVendorAccountId(
      user.vendor,
      user.vendorAccountId
    )
    try {
      if (exists) {
        await super.remove(UserMapper.toPersistence(exists))
      }
    } catch (error) {
      console.log(error)
    }
  }
}
