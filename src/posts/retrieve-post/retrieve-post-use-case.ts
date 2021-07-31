import { IPostRepository } from 'posts/repositories/post-repository.interface'
import * as RetrievePostErrors from './retrieve-post-error'
import {
  RetirevePostInputDto,
  RetirevePostOutputDto,
} from './retrieve-post-dto'
import { inject, injectable } from 'tsyringe'

type Response = RetirevePostOutputDto | RetrievePostErrors.NotFound

@injectable()
export class RetrievePost {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  public async execute(inputDto: RetirevePostInputDto): Promise<Response> {
    try {
      const { postId } = inputDto

      const list = await this.postRepository.retrievePost(postId)

      const outputDto: RetirevePostOutputDto = list
      return outputDto
    } catch (error) {
      throw new Error()
    }
  }
}
