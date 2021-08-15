import { BaseController } from 'core/infra/base-controller'
import { UseCaseError } from '../../../core/infra/use-case-error'
import { autoInjectable } from 'tsyringe'
import { RetrievePost } from '../../use-cases/retrieve-post/retrieve-post-use-case'
import {
  RetirevePostInputDto,
  RetirevePostOutputDto,
} from './retrieve-post-dto'
import * as RetirevePostErrors from '../../use-cases/retrieve-post/retrieve-post-error'

@autoInjectable()
export class RetrievePostController extends BaseController {
  constructor(private useCase: RetrievePost) {
    super()
  }

  async executeImpl(): Promise<any> {
    const postId = this.req.params.post_id
    const dto: RetirevePostInputDto = {
      postId,
    }
    
    try {
      const result = await this.useCase.execute(this.req, dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case RetirevePostErrors.NotFound:
          // return this.someProperResponseFunction in base controller
        }
      } else {
        const outputDto: RetirevePostOutputDto = result
        return this.ok(this.res, 200, outputDto)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
