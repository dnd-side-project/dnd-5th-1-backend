import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { PostModel } from 'infra/models/post-model'
import { Post } from 'posts/domain/post'

export class PostMapper {
  public static toPersistence(post: Post): any {
    return {
      title: post.title,
      expiredAt: post.expiredAt,
      userId: post.userId.toString()
    }
  }

  public static toDomain(postModel: PostModel): Post {
    const post = new Post(
      {
        title: postModel.title,
        expiredAt: postModel.expiredAt,
        userId: new UniqueEntityId(postModel.userId)
      },
      new UniqueEntityId(postModel.id)
    )

    return post
  }
}
