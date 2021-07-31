import { EntityRepository, getRepository, Repository } from 'typeorm'
import { UniqueEntityId } from '../../core/infra/unique-entity-id'
import { singleton } from 'tsyringe'
import { IPostRepository } from './post-repository.interface'
import { PostModel } from 'infra/models/post-model'
import { Post } from 'posts/domain/post'
import { PostMapper } from 'posts/mappers/post-mapper'
import { ImageModel } from 'infra/models/image-model'
import * as DeletePostErrors from '../delete-post/delete-post-error'

@singleton()
@EntityRepository(PostModel)
export class PostRepository implements IPostRepository {
  private ormRepository: Repository<PostModel>

  constructor() {
    this.ormRepository = getRepository(PostModel)
  }

  listPosts(page: number, limit: number) {
    this.ormRepository.createQueryBuilder('p').skip(page).take(limit).getMany()
  }

  public async findPostById(postId: UniqueEntityId): Promise<Post> {
    const post = await this.ormRepository.findOne({
      where: {
        id: postId,
      },
    })

    return post ? PostMapper.toDomain(post) : null
  }

  public async createAndSave(post: Post): Promise<Post | null> {
    const createPost = await this.ormRepository.save(
      PostMapper.toPersistence(post)
    )
    console.log(
      `Post create and save result: ${JSON.stringify(createPost, null, 4)}`
    )
    return createPost ? PostMapper.toDomain(createPost) : null
  }

  public async savePostImages(postId: string, images: ImageModel[]) {
    const post = await this.ormRepository.findOne(postId)
    images.forEach((image) => {
      image.post = post
    })
  }

  public async saveThumbnailUrl(postId: string, images: ImageModel[]) {
    const post = await this.ormRepository.findOne(postId)
    images.forEach((image) => {
      if (image.isPicked === true) {
        post.thumbnailUrl = image.thumbnailUrl
      }
    })
  }

  public async exists(post: Post): Promise<boolean> {
    const postExists = await this.findPostById(post.id)
    console.log(`Post found by id: ${JSON.stringify(postExists, null, 4)}`)
    return postExists ? true : false
  }

  public async saveEntity(post: Post): Promise<void> {
    const exists = await this.exists(post)
    try {
      if (!exists) {
        this.createAndSave(post)
      } else {
        this.ormRepository.save(PostMapper.toPersistence(post))
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async deleteEntity(post: Post): Promise<void> {
    // deleteEntity in IRepositoryInterface should be editted later.
    // It needs to have userId as parameter to check if the request is authorized.
    // But, I don't think this kind of method abstraction is a flexible way to handle various cases.
  }

  public async delete(postId: string, userId: string): Promise<any> {
    const exists = await this.ormRepository.findOne(postId)
    if (exists) {
      const isAuthorized = exists.user.id === userId
      if (isAuthorized) {
        await this.ormRepository.remove(exists)
        return true
      } else {
        return DeletePostErrors.NotAuthorized
      }
    } else {
      return DeletePostErrors.NotFound
    }
  }
}
