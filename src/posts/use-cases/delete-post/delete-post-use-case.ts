import { IPostRepository } from 'posts/repositories/post-repository.interface'
import * as DeletePostErrors from './delete-post-error'
import { DeletePostInputDto } from '../../controllers/delete-post/delete-post-dto'
import { inject, injectable } from 'tsyringe'

type Response =
  | DeletePostErrors.NotFound
  | DeletePostErrors.NotAuthorized
  | Error

@injectable()
export class DeletePost {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  public async execute(inputDto: DeletePostInputDto): Promise<Response> {
    try {
      const { postId, userId } = inputDto

      const deleted = this.postRepository.delete(postId, userId)
      return deleted
    } catch (error) {
      throw new Error()
    }
  }
}
