import { Repository } from 'core/infra/repository.interface.'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { PostModel } from 'infra/models/post-model'
import { Post } from 'posts/domain/post'

export interface IPostRepository extends Repository<Post> {
  findPostById(postId: UniqueEntityId): Promise<Post | null>
  listPosts(page: number, limit: number)
  create(post: Post): PostModel
  save(postModel: PostModel): Promise<PostModel | null>
  delete(postId: string, userId: string): Promise<any>
  retrieve(postId: string)
}
