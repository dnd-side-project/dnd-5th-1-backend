import { BaseController } from 'core/infra/base-controller'
import { autoInjectable } from 'tsyringe'
import { UseCaseError } from 'core/infra/use-case-error'
import { GetUserInputDto } from './get-user-dto'
import { InvalidUserId } from 'users/use-cases/get-user/get-user-error'
import { GetUser } from 'users/use-cases/get-user/get-user-use-case'

@autoInjectable()
export class GetUserController extends BaseController {
  constructor(private useCase: GetUser) {
    super()
  }

  async executeImpl(): Promise<any> {
    const dto: GetUserInputDto = {
      userId: this.req.user,
    } as GetUserInputDto

    try {
      const result = await this.useCase.execute(dto)
      console.log(`GetUser Usecase result: ${result}`)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case InvalidUserId:
            return this.forbidden(result.message)
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
