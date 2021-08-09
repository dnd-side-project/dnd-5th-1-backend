import { IPostRepository } from 'posts/repositories/post-repository.interface'
import * as DeletePostErrors from './delete-post-error'
import { DeletePostInputDto } from '../../controllers/delete-post/delete-post-dto'
import { inject, injectable } from 'tsyringe'
import { PostMapper } from 'posts/mappers/post-mapper'

type Response =
  | DeletePostErrors.NotFound
  | DeletePostErrors.NotAuthorized
  | Error
  | boolean

@injectable()
export class DeletePost {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  public async execute(inputDto: DeletePostInputDto): Promise<Response> {
    try {
      const { postId } = inputDto
      const post = this.postRepository.exists(postId)
      if (!post) {
        return new DeletePostErrors.NotFound()
      }
      const deleted = this.postRepository.deleteEntity(postId)
      return deleted
    } catch (error) {
      throw new Error()
    }
  }
}
