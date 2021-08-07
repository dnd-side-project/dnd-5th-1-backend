import { BaseController } from 'core/infra/base-controller'
import { autoInjectable } from 'tsyringe'
import { UseCaseError } from 'core/infra/user-case-error'
import { CreateVoteInputDto } from './create-vote-dto'
import { CreateVote } from '../../use-cases/create-vote/create-vote'
import {
  AlreadyExists,
  InvalidCategory,
} from '../../use-cases/create-vote/create-vote-error'

@autoInjectable()
export class CreateVoteController extends BaseController {
  constructor(private useCase: CreateVote) {
    super()
  }

  async executeImpl(): Promise<any> {
    const dto: CreateVoteInputDto = {
      userId: this.req.body.userId,
      postId: this.req.body.postId,
      postImageID: this.req.body.postImageID,
      category: this.req.body.category,
    } as CreateVoteInputDto

    try {
      const result = await this.useCase.execute(dto)
      console.log(`CreateVote Usecase result: ${result}`)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case InvalidCategory:
            return this.forbidden(result.message)
          case AlreadyExists:
            return this.alreadyExists(result.message)
        }
      } else {
        return this.ok(this.res, 200)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
