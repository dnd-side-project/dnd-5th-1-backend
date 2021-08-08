import { EntityRepository, getRepository, Repository } from 'typeorm'
import { UserModel } from 'infra/models/user-model'
import { IUserRepository } from 'users/repositories/user-repository.interface'
import { User } from 'users/domain/user'
import { UserMapper } from 'users/mappers/user-mapper'
import { Vendor } from 'users/domain/vendor'
import { UniqueEntityId } from '../../core/infra/unique-entity-id'
import { singleton } from 'tsyringe'

@singleton()
@EntityRepository(UserModel)
export class UserRepository implements IUserRepository {
  private ormRepository: Repository<UserModel>

  constructor() {
    this.ormRepository = getRepository(UserModel)
  }

  public async findUserById(userId: UniqueEntityId): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      id: userId.toString(),
    })
    return user ? UserMapper.toDomain(user) : null
  }

  public async findByVendorAndVendorAccountId(
    vendor: Vendor,
    vendorAccountId: string
  ): Promise<User | null> {
    const user = await this.ormRepository.findOne({
      where: [{ vendor: vendor.value, vendorAccountId: vendorAccountId }],
    })

    return user ? UserMapper.toDomain(user) : null
  }

  public async createAndSave(user: User): Promise<User | null> {
    const createdUser = await this.ormRepository.save(
      UserMapper.toPersistence(user)
    )
    console.log(
      `User create and save result: ${JSON.stringify(createdUser, null, 4)}`
    )
    return createdUser ? UserMapper.toDomain(createdUser) : null
  }

  public async exists(user: User): Promise<boolean> {
    const userExists = await this.findByVendorAndVendorAccountId(
      user.vendor,
      user.vendorAccountId
    )
    console.log(
      `User find by Vendor result: ${JSON.stringify(userExists, null, 4)}`
    )
    return userExists ? true : false
  }

  public async save(user: User): Promise<void> {
    const exists = await this.exists(user)
    try {
      if (!exists) {
        this.createAndSave(user)
      } else {
        this.ormRepository.save(UserMapper.toPersistence(user))
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async delete(user: User): Promise<void> {
    const exists = await this.findByVendorAndVendorAccountId(
      user.vendor,
      user.vendorAccountId
    )
    try {
      if (exists) {
        this.ormRepository.remove(UserMapper.toPersistence(exists))
      }
    } catch (error) {
      console.log(error)
    }
  }
}
