// import { BaseController } from 'core/infra/base-controller'
// import { CreateUserUseCase } from '@/users/use-cases/create-user/create-user-use-case'
// import { CreateUserDTO } from './create-user-dto'

// export class CreateUserController extends BaseController {
//   private useCase: CreateUserUseCase

//   constructor(useCase: CreateUserUseCase) {
//     super()
//     this.useCase = useCase
//   }

//   async executeImpl(): Promise<any> {
//     const dto: CreateUserDTO = this.req.body as CreateUserDTO

//     try {
//       const result = await this.useCase.execute(dto)

//       /*TO-DO: result error handling
//       if (result.isError())
//       else
//       */
//       return this.ok(this.res, 200)
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return this.fail(error)
//       }
//     }
//   }
// }
