import { getRepository, Repository } from 'typeorm'
import { IPostImageRepository } from './post-image-repository.interface'
import { PostImage } from '../domain/post-image'
import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { PostImageModel } from 'infra/models/post-image-model'
import { PostImageMapper } from 'post-images/mappers/post-image-mapper'

export class PostImageRepository implements IPostImageRepository {
  private ormRepository: Repository<PostImageModel>

  constructor() {
    this.ormRepository = getRepository(PostImageModel)
  }

  public async findPostImageById(
    postImageId: UniqueEntityId
  ): Promise<PostImage> {
    const postImage = await this.ormRepository.findOne({
      id: postImageId.toString(),
    })

    return postImage ? PostImageMapper.toDomain(postImage) : null
  }

  public async findFirtPickByPostId(
    postId: UniqueEntityId
  ): Promise<PostImage> {
    const postImage = await this.ormRepository.findOne({
      id: postId.toString(),
      isFirstPick: true,
    })

    return postImage ? PostImageMapper.toDomain(postImage) : null
  }

  public async findAllByPostId(postId: UniqueEntityId): Promise<PostImage[]> {
    const postImages = await this.ormRepository.find({
      id: postId.toString(),
    })

    return postImages
      ? postImages.map((postImage) => {
          return PostImageMapper.toDomain(postImage)
        })
      : null
  }

  public async deleteAllByPostId(postId: UniqueEntityId): Promise<void> {
    const postImages = await this.findAllByPostId(postId)
    try {
      if (postImages) {
        postImages.forEach(async (postImage, idx) => {
          await this.ormRepository.remove(
            PostImageMapper.toPersistence(postImage)
          )
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async exists(postImage: PostImage): Promise<boolean> {
    const result = await this.findPostImageById(postImage.id)

    return result ? true : false
  }

  public async save(postImage: PostImage): Promise<void> {
    await this.ormRepository.save(PostImageMapper.toPersistence(postImage))
  }

  public async delete(postImage: PostImage): Promise<void> {
    await this.ormRepository.remove(PostImageMapper.toPersistence(postImage))
  }
}
