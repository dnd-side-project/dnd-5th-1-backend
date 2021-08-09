import { BaseController } from 'core/infra/base-controller'
import { DeletePost } from '../../use-cases/delete-post/delete-post-use-case'
import { UseCaseError } from '../../../core/infra/use-case-error'
import * as DeletePostErrors from '../../use-cases/delete-post/delete-post-error'
import { DeletePostInputDto } from './delete-post-dto'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class DeletePostController extends BaseController {
  constructor(private useCase: DeletePost) {
    super()
  }

  async executeImpl(): Promise<any> {
    const postId = this.req.params.post_id
    const deletePostInputDto = { postId }
    try {
      const result = await this.useCase.execute(deletePostInputDto)

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
