import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { UserModel } from 'infra/models/user-model'
import { Nickname } from 'users/domain/nickname'
import { User } from 'users/domain/user'
import { ImageUrl } from '../domain/image-url'
import { Vendor, VendorType } from '../domain/vendor'

export class UserMapper {
  public static toPersistence(user: User): any {
    return {
      nickname: user.nickname.value,
      email: user.email,
      image_url: user.imageUrl,
      vendor: user.vendor.value,
      vendorAccountId: user.vendorAccountId,
    }
  }

  public static toDomain(userModel: UserModel): User {
    const nickname = new Nickname(userModel.nickname)
    const imageUrl = new ImageUrl(userModel.image_url)
    const vendor = new Vendor(userModel.vendor as VendorType)

    const user = new User(
      {
        nickname: nickname,
        email: userModel.email,
        imageUrl: imageUrl,
        vendor: vendor,
        vendorAccountId: userModel.vendorAccountId,
      },
      new UniqueEntityId(userModel.id)
    )

    return user
  }
}
