import { UniqueEntityId } from 'core/infra/unique-entity-id'
import { VoteModel } from 'infra/models/vote-model'
import { Repository, getRepository } from 'typeorm'
import { Vote } from '../domain/vote'
import { IVoteRepository } from './vote-repository.interface'
import { VoteMapper } from '../mappers/vote-mapper'
import { singleton } from 'tsyringe'

@singleton()
export class VoteRepository implements IVoteRepository {
  private ormRepository: Repository<VoteModel>

  constructor() {
    this.ormRepository = getRepository(VoteModel)
  }

  public async findVoteById(voteId: UniqueEntityId): Promise<Vote> {
    const vote = await this.ormRepository.findOne({
      id: voteId.toString(),
    })

    return vote ? VoteMapper.toDomain(vote) : null
  }

  public async findVoteByUserIdAndPostId(
    userId: UniqueEntityId,
    postId: UniqueEntityId
  ): Promise<Vote> {
    const vote = await this.ormRepository.findOne({
      userId: userId.toString(),
      postId: postId.toString(),
    })

    return vote ? VoteMapper.toDomain(vote) : null
  }

  public async exists(vote: Vote): Promise<boolean> {
    const result = await this.findVoteById(vote.id)

    return result ? true : false
  }

  public async saveEntity(vote: Vote): Promise<void> {
    await this.ormRepository.save(VoteMapper.toPersistence(vote))
  }

  public async deleteEntity(vote: Vote): Promise<void> {
    await this.ormRepository.remove(VoteMapper.toPersistence(vote))
  }
}
