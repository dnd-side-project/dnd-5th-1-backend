import { Repository } from 'core/infra/repository.interface.'
import { Vote } from '../domain/vote'
import { UniqueEntityId } from '../../src/core/infra/unique-entity-id'

export interface IVoteRepository extends Repository<Vote> {
  findVoteById(voteId: UniqueEntityId): Promise<Vote>
  findVoteByUserIdAndPostId(
    userId: UniqueEntityId,
    postId: UniqueEntityId
  ): Promise<Vote>
}
