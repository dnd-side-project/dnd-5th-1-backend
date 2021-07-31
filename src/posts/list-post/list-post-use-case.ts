import { IPostRepository } from 'posts/repositories/post-repository.interface'
import * as ListPostErrors from './list-post-error'
import { ListPostsInputDto, ListPostsOutputDto } from './list-post-dto'
import { inject, injectable } from 'tsyringe'

type Response = ListPostsOutputDto | ListPostErrors.SomeProperListPostError

@injectable()
export class ListPosts {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  public async execute(inputDto: ListPostsInputDto): Promise<Response> {
    try {
      const { page, limit } = inputDto

      const list = await this.postRepository.listPosts(page, limit)

      const outputDto: ListPostsOutputDto = list
      return outputDto
    } catch (error) {
      throw new Error()
    }
  }
}
