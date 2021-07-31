import { Repository } from 'core/infra/repository.interface.'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { Post } from 'posts/domain/post'

export interface IPostRepository extends Repository<Post> {
  findPostById(postId: UniqueEntityId): Promise<Post | null>
  listPosts(page: number, limit: number)
  createAndSave(post: Post): Promise<Post | null>
  delete(postId: string, userId: string): Promise<any>
}
