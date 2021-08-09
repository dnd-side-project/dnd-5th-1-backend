import { Vote } from '../domain/vote'
import { Category, CategoryType } from '../domain/category'
import { UniqueEntityId } from '../../core/infra/unique-entity-id'
import { VoteModel } from 'infra/models/vote-model'

export class VoteMapper {
  public static toPersistence(vote: Vote): any {
    console.log(vote)
    return {
      userId: vote.userId.toString(),
      postId: vote.postId.toString(),
      postImageId: vote.postImageId.toString(),
      category: vote.category.value,
    }
  }

  public static toDomain(voteModel: VoteModel): Vote {
    const userId = new UniqueEntityId(voteModel.userId)
    const postId = new UniqueEntityId(voteModel.postId)
    const postImageId = new UniqueEntityId(voteModel.postImageId)
    const category = new Category(voteModel.category as CategoryType)

    const vote = new Vote(
      {
        userId: userId,
        postId: postId,
        postImageId: postImageId,
        category: category,
      },
      new UniqueEntityId(voteModel.id)
    )

    return vote
  }
}
