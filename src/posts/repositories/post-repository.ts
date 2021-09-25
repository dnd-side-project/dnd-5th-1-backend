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
import {
  IRetrievePost,
  RetrievePostQueryObject,
} from 'posts/controllers/retrieve-post/retrieve-post-dto'
import express from 'express'
import { NotFound } from 'posts/use-cases/retrieve-post/retrieve-post-error'

@singleton()
@EntityRepository(PostModel)
export class PostRepository implements IPostRepository {
  private ormRepository: Repository<PostModel>

  constructor() {
    this.ormRepository = getRepository(PostModel)
  }

  public async listPosts(page: number, limit: number) {
    try {
      const posts = await this.ormRepository
        .createQueryBuilder('p')
        .innerJoin('p.user', 'u')
        .leftJoin('p.votes', 'v')
        .leftJoin('p.images', 'pi')
        .addSelect('pi.id')
        .addSelect('pi.thumbnailUrl')
        .addSelect('u.nickname')
        .addSelect('u.imageUrl')
        .loadRelationCountAndMap('p.participantsNum', 'p.votes')
        .orderBy('p.createdAt', 'DESC')
        .skip(page)
        .take(limit)
        .getMany()

      const total = await this.ormRepository.createQueryBuilder('p').getCount()

      console.log(page)
      console.log(limit)

      posts.forEach((post) => {
        post.images = [post.images[0], post.images[1]]
      })
      return {
        posts,
        total,
      }
    } catch (error) {
      console.log('###########: ' + error.code)
    }
  }

  public async test() {
    const result = await this.ormRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .getRawMany()

    return result
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

  public async retrieve(req: express.Request, postId: string): Promise<any> {
    try {
      const voteRepository = getRepository(VoteModel)
      // first, getRawMany where p.id = :postId -> will return several imageUrl separated into several object parts.
      const query = await this.ormRepository
        .createQueryBuilder('p')
        .leftJoin('p.images', 'pi')
        .leftJoin('p.user', 'u')
        .where('p.id = :postId', { postId })
        .select([
          'pi.id AS id',
          'pi.imageUrl AS imageUrl',
          'p.id AS postId',
          'pi.isFirstPick AS isFirstPick',
          'p.expiredAt AS expiredAt',
          'p.title AS title',
          'p.userId AS userId',
          'u.nickname AS nickname',
          'u.imageUrl AS userImageProfile',
        ])
        .orderBy('pi.imageIndex')
        .getRawMany()

      if (query.length === 0) {
        return new NotFound()
      }

      let votesResult: [VoteModel[], number]
      const images = []
      let firstPickIndex = 0
      let isVoted = false
      let participantsNum = 0
      let votedImageIndex = null
      let title = ''
      let expiredAt = ''
      let nickname = ''
      let userProfileUrl = ''
      let index = 0
      // second, according to the way above,
      // I should map image information to the raw query result.

      // await Promise.all(
      // query.forEach(async (image, i) => {
      for (const image of query) {
        // assign each image information related with the post
        const imageInfoObject = {} as RetrievePostQueryObject
        const imageId = image.id
        votesResult = await voteRepository
          .createQueryBuilder('v')
          .where('v.postImageId = :imageId', { imageId })
          .getManyAndCount()

        // console.log('votesResult', votesResult)

        if (index === 0) {
          nickname = image.nickname
          userProfileUrl = image.userImageProfile
        }
        if (image.postId === postId) {
          title = image.title
          expiredAt = image.expiredAt
        }
        imageInfoObject.id = image.id
        if (image.isFirstPick === 1) {
          imageInfoObject.isFirstPick = 1
        }
        votesResult[0].forEach((voteResult) => {
          if (voteResult.userId === req.user) {
            isVoted = true
            votedImageIndex = index
          }
        })
        // console.log(votesResult)
        // if (image.userId = req.user) {
        //   votedImageIndex = index
        //  }
        participantsNum += votesResult[1]

        imageInfoObject.pickedNum = votesResult[1]
        imageInfoObject.imageUrl = image.imageUrl
        imageInfoObject.emotion = votesResult[0].filter(
          (vote) => vote.category === 'emotion'
        ).length
        imageInfoObject.color = votesResult[0].filter(
          (vote) => vote.category === 'color'
        ).length
        imageInfoObject.composition = votesResult[0].filter(
          (vote) => vote.category === 'composition'
        ).length
        imageInfoObject.light = votesResult[0].filter(
          (vote) => vote.category === 'light'
        ).length
        imageInfoObject.skip = votesResult[0].filter(
          (vote) => vote.category === 'skip'
        ).length
        images.push(imageInfoObject)
        index++
      }

      images.forEach((image, i) => {
        if (image.isFirstPick === 1) {
          firstPickIndex = i
        }
      })

      const result = {
        nickname,
        userProfileUrl,
        firstPickIndex,
        isVoted,
        participantsNum,
        votedImageIndex,
        expiredAt,
        title,
        images,
      }

      return result
    } catch (error) {
      throw error
    }
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
