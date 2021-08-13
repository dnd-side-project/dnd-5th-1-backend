import { EntityRepository, getRepository, Repository } from 'typeorm'
import { UniqueEntityId } from '../../core/infra/unique-entity-id'
import { singleton } from 'tsyringe'
import { IPostRepository } from './post-repository.interface'
import { PostModel } from 'infra/models/post-model'
import { Post } from 'posts/domain/post'
import { PostMapper } from 'posts/mappers/post-mapper'
import { VoteModel } from 'infra/models/vote-model'
import { PostImageModel } from 'infra/models/post-image-model'
import { UserModel } from 'infra/models/user-model'
import { IRetrievePost } from 'posts/controllers/retrieve-post/retrieve-post-dto'

@singleton()
@EntityRepository(PostModel)
export class PostRepository implements IPostRepository {
  private ormRepository: Repository<PostModel>

  constructor() {
    this.ormRepository = getRepository(PostModel)
  }

  public async listPosts(page: number, limit: number) {
    try {
    const list = await this.ormRepository
    .createQueryBuilder('p')
    .innerJoin('p.user', 'u')
    .leftJoin('p.votes', 'v')
    .leftJoin('p.images', 'pi')
    .addSelect('pi.thumbnailUrl')
    .loadRelationCountAndMap('p.participantsNum', 'p.votes')
    .getMany()
    list.forEach(post => {
      post.images = [post.images[0], post.images[1]]
    })
    return list
    } catch(error) {
      console.log('###########: ' + error.code)
    }
  }

  public async findPostById(postId: UniqueEntityId): Promise<Post> {
    const post = await this.ormRepository.findOne({
      where: {
        id: postId.toString(),
      },
    })

    return post ? PostMapper.toDomain(post) : null
  }

  public create(post: Post): PostModel {
    const createPost = this.ormRepository.create(
      PostMapper.toPersistence(post) as PostModel
    )
    return createPost
  }

  public async save(postModel: PostModel): Promise<PostModel | null> {
    console.log(postModel)
    const post = await this.ormRepository.save(postModel)
    console.log(`Post create and save result: ${JSON.stringify(post, null, 4)}`)
    return post
  }

  public async saveEntity(post: Post): Promise<Post> {
    const postObj = await this.create(post)
    const result = await this.save(postObj)

    return result ? PostMapper.toDomain(result) : null
  }

  // public async savePostImages(postId: string, images: PostImageModel[]) {
  //   const post = await this.ormRepository.findOne(postId)
  //   images.forEach((image) => {
  //     image.post = post
  //   })
  // }

  // public async saveThumbnailUrl(postId: string, images: PostImageModel[]) {
  //   const post = await this.ormRepository.findOne(postId)
  //   images.forEach((image) => {
  //     if (image.isPicked === true) {
  //       post.thumbnailUrl = image.thumbnailUrl
  //     }
  //   })
  // }

  public async retrieve(postId: string): Promise<any> {
    const detail = this.ormRepository
    .createQueryBuilder('p')
    .leftJoinAndSelect('p.images', 'pi')
    .where('p.id = :postId', { postId })
    .getOne()

    return detail
  }

  public async exists(postId: string): Promise<boolean> {
    const postExists = await this.findPostById(new UniqueEntityId(postId))
    console.log(`Post found by id: ${JSON.stringify(postExists, null, 4)}`)
    return postExists ? true : false
  }

  public async delete(postId: string): Promise<any> {
    // const isAuthorized = exists.user.id === userId
    const result = await this.ormRepository.delete(postId)
    if (result) return true
    return false
  }

  public async deleteEntity(postId: string): Promise<boolean> {
    const deleted = this.delete(postId)
    return deleted
  }
}
