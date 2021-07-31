import { BaseController } from 'core/infra/base-controller'
import { DeletePost } from './delete-post-use-case'
import { UseCaseError } from '../../core/infra/user-case-error'
import * as DeletePostErrors from './delete-post-error'
import { DeletePostInputDto } from './delete-post-dto'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class CreatePostController extends BaseController {
  constructor(private useCase: DeletePost) {
    super()
  }

  async executeImpl(): Promise<any> {
    const inputDto: DeletePostInputDto = this.req.body as DeletePostInputDto

    try {
      const result = await this.useCase.execute(inputDto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case DeletePostErrors.NotFound: {
            return this.notFound(result.message)
          }
          case DeletePostErrors.NotAuthorized: {
            return this.clientError(result.message)
          }
          default:
            return this.fail(result.message)
        }
      } else {
        return this.ok(this.res, 200, result)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
