import { BaseController } from 'core/infra/base-controller'
import { UseCaseError } from '../../../core/infra/use-case-error'
import { autoInjectable } from 'tsyringe'
import { ListPosts } from '../../use-cases/list-posts/list-post-use-case'
import { ListPostsInputDto, ListPostsOutputDto } from './list-post-dto'
import * as ListPostsErrors from '../../use-cases/list-posts/list-post-error'

@autoInjectable()
export class ListPostsController extends BaseController {
  constructor(private useCase: ListPosts) {
    super()
  }

  async executeImpl(): Promise<any> {
    const page = Number.parseInt(this.req.query.page as string)
    const limit = Number.parseInt(this.req.query.limit as string)
    const dto: ListPostsInputDto = { page, limit }

    try {
      const result = await this.useCase.execute(dto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case ListPostsErrors.SomeProperListPostError:
          // return this.someProperResponseFunction in base controller
        }
      } else {
        const outputDto: ListPostsOutputDto = result
        console.log(outputDto)
        return this.ok(this.res, 200, {
          posts: result.posts,
          total: result.total
        })
      }
    } catch (error: any) {
      console.log('#######: ' + error)
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
