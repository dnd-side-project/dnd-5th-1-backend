import * as CreateVoteError from './create-vote-error'
import { inject, injectable } from 'tsyringe'
import { IVoteRepository } from '../../repositories/vote-repository.interface'
import { Category, CategoryType } from '../../domain/category'
import {
  CreateVoteInputDto,
  CreateVoteOutputDto,
} from '../../controllers/create-vote-controller/create-vote-dto'
import { Vote } from '../../domain/vote'
import { UniqueEntityId } from 'core/infra/unique-entity-id'

type Response = CreateVoteOutputDto | CreateVoteError.InvalidCategory

@injectable()
export class CreateVote {
  constructor(
    @inject('IVoteRepository')
    private voteRepository: IVoteRepository
  ) {}

  public async execute(inputDto: CreateVoteInputDto): Promise<Response> {
    if (!Category.isCategory(inputDto.category)) {
      return new CreateVoteError.InvalidCategory()
    }

    const category = new Category(inputDto.category as CategoryType)
    const userId = new UniqueEntityId(inputDto.userId)
    const postId = new UniqueEntityId(inputDto.postId)
    const postImageId = new UniqueEntityId(inputDto.postImageId)

    const voteAlreadyExists =
      await this.voteRepository.findVoteByUserIdAndPostId(userId, postId)
    if (voteAlreadyExists) {
      return new CreateVoteError.AlreadyExists()
    }

    const vote = new Vote({
      userId: userId,
      postId: postId,
      postImageId: postImageId,
      category: category,
    })

    try {
      await this.voteRepository.save(vote)
    } catch (error) {
      return new Error(
        `vote save failed, userId: ${userId.toString()}, postId: ${postId.toString()}`
      )
    }

    const outputDto: CreateVoteOutputDto = {
      userId: userId.toString(),
      postId: postId.toString(),
    }
    return outputDto
  }
}
