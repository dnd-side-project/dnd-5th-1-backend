import { IPostRepository } from 'posts/repositories/post-repository.interface'
import * as ListPostErrors from './list-post-error'
import {
  ListPostsInputDto,
  ListPostsOutputDto,
} from '../../controllers/list-posts/list-post-dto'
import { inject, injectable } from 'tsyringe'

type Response = ListPostsOutputDto | ListPostErrors.SomeProperListPostError

@injectable()
export class ListPosts {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  public async execute(inputDto: ListPostsInputDto): Promise<Response> {
    try {
      let { page, limit } = inputDto
      page = page - 1
      page = page * limit
      
      if (page < 0) page = 0

      const result = await this.postRepository.listPosts(page, limit)

      const outputDto: ListPostsOutputDto = result
      return outputDto
    } catch (error) {
      console.log(error)
      throw new Error()
    }
  }
}
