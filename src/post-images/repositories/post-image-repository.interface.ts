import { Repository } from 'core/infra/repository.interface.'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { PostImage } from 'post-images/domain/post-image'

export interface IPostImageRepository extends Repository<PostImage> {
  findPostImageById(postImageId: UniqueEntityId): Promise<PostImage>
  findFirtPickByPostId(postId: UniqueEntityId): Promise<PostImage>
  findAllByPostId(postId: UniqueEntityId): Promise<PostImage[]>
  deleteAllByPostId(postId: UniqueEntityId): Promise<void>
}
