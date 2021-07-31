import { BaseController } from 'core/infra/base-controller'
import { CreatePost } from '../../use-cases/create-post/create-post-use-case'
import { UseCaseError } from '../../../core/infra/user-case-error'
import { CreatePostInputDto, CreatePostOutputDto } from './create-post-dto'
import * as CreatePostErrors from '../../use-cases/create-post/create-post-error'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class CreatePostController extends BaseController {
  constructor(private useCase: CreatePost) {
    super()
  }

  async executeImpl(): Promise<any> {
    const inputDto: CreatePostInputDto = this.req.body as CreatePostInputDto

    try {
      const result = await this.useCase.execute(inputDto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          default:
            return this.clientError(result.message)
        }
      } else {
        const outputDto: CreatePostOutputDto = result
        return this.ok(this.res, 200, outputDto)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
