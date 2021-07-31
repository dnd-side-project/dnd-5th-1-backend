import { BaseController } from 'core/infra/base-controller'
import { UseCaseError } from '../../core/infra/user-case-error'
import { autoInjectable } from 'tsyringe'
import { ListPosts } from './list-post-use-case'
import { ListPostsInputDto, ListPostsOutputDto } from './list-post-dto'
import * as ListPostsErrors from './list-post-error'

@autoInjectable()
export class SocialSigninController extends BaseController {
  constructor(private useCase: ListPosts) {
    super()
  }

  async executeImpl(): Promise<any> {
    const dto: ListPostsInputDto = this.req.body as ListPostsInputDto

    try {
      const result = await this.useCase.execute(dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case ListPostsErrors.SomeProperListPostError:
          // return this.someProperResponseFunction in base controller
        }
      } else {
        const outputDto: ListPostsOutputDto = result
        return this.ok(this.res, 200, outputDto)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
