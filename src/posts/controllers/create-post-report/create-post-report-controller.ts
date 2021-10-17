import { BaseController } from 'core/infra/base-controller'
import { UseCaseError } from 'core/infra/use-case-error'
import { CreatePostReport } from 'posts/use-cases/create-post-report/create-post-report-use-case'
import { autoInjectable } from 'tsyringe'
import {
  CreatePostReportInputDto,
  CreatePostReportOutputDto,
} from './create-post-report-dto'

@autoInjectable()
export class CreatePostReportController extends BaseController {
  constructor(private useCase: CreatePostReport) {
    super()
  }

  async executeImpl(): Promise<any> {
    const inputDto: CreatePostReportInputDto = {
      userId: this.req.user,
      postId: this.req.body.postId,
    } as CreatePostReportInputDto

    try {
      const result = await this.useCase.execute(inputDto)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          default:
            return this.clientError(result.message)
        }
      } else {
        const outputDto: CreatePostReportOutputDto = result
        return this.ok(this.res, 200, outputDto)
      }
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
