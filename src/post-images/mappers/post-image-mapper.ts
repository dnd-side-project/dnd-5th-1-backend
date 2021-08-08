import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { PostImageModel } from 'infra/models/post-image-model'
import { PostImage } from 'post-images/domain/post-image'
import { ExtensionType, Extension } from '../domain/extension'

export class PostImageMapper {
  public static toPersistence(postImage: PostImage): any {
    return {
      postId: postImage.postId.toString(),
      originalName: postImage.originalName,
      imageUrl: postImage.imageUrl,
      thumbnailUrl: postImage.thumbnailUrl,
      isFirstPick: postImage.isFirstPick,
      extension: postImage.extension.value,
    }
  }

  public static toDomain(postImageModel: PostImageModel): PostImage {
    const postId = new UniqueEntityId(postImageModel.postId)
    const extension = new Extension(postImageModel.extension as ExtensionType)

    const postImage = new PostImage(
      {
        postId: postId,
        originalName: postImageModel.originalName,
        imageUrl: postImageModel.imageUrl,
        thumbnailUrl: postImageModel.thumbnailUrl,
        isFirstPick: postImageModel.isFirstPick,
        extension: extension,
        width: postImageModel.width,
        height: postImageModel.height,
      },
      new UniqueEntityId(postImageModel.id)
    )

    return postImage
  }
}
