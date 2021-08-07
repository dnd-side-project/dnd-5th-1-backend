import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { PostModel } from 'infra/models/post-model'
import { Post } from 'posts/domain/post'

export class PostMapper {
  public static toPersistence(post: Post): any {
    return {
      title: post.title,
      description: post.description,
      expiredAt: post.expiredAt
    }
  }

  public static toDomain(postModel: PostModel): Post {
    const post = new Post(
      {
        title: postModel.title,
        description: postModel.description,
        expiredAt: postModel.expiredAt,
      },
      new UniqueEntityId(postModel.id)
    )

    return post
  }
}
