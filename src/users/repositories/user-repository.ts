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
  findUserById(userId: UniqueEntityId): User | null {
    const user = this.findOne({
      id: userId.toString(),
    })
    return user instanceof UserModel ? UserMapper.toDomain(user) : null
  }

  findByVendorAndVendorAccountId(
    vendor: Vendor,
    vendorAccountId: string
  ): User | null {
    const user = this.findOne({
      where: [{ vendor: vendor.value }, { vendor_account_id: vendorAccountId }],
    })

    return user instanceof UserModel ? UserMapper.toDomain(user) : null
  }

  createAndSave(user: User): User | null {
    const createdUser = this.save(UserMapper.toPersistence(user))
    console.log(`User create and save result: ${createdUser}`)
    return createdUser instanceof UserModel
      ? UserMapper.toDomain(createdUser)
      : null
  }

  exists(user: User): boolean {
    const userExists = this.findByVendorAndVendorAccountId(
      user.vendor,
      user.vendorAccountId
    )
    console.log(`User find by Vendor result: ${userExists}`)
    return userExists ? true : false
  }

  saveEntity(user: User): void {
    const exists = this.exists(user)
    try {
      if (!exists) {
        this.createAndSave(user)
      } else {
        this.save(UserMapper.toPersistence(user))
      }
    } catch (error) {
      console.log(error)
    }
  }

  deleteEntity(user: User): void {
    const exists = this.findByVendorAndVendorAccountId(
      user.vendor,
      user.vendorAccountId
    )
    try {
      if (exists) {
        this.remove(UserMapper.toPersistence(exists))
      }
    } catch (error) {
      console.log(error)
    }
  }
}
