import { IPostRepository } from 'posts/repositories/post-repository.interface'
import * as CreatePostErrors from './create-post-error'
import {
  CreatePostInputDto,
  CreatePostOutputDto,
} from '../../controllers/create-post/create-post-dto'
import { inject, injectable } from 'tsyringe'
import { LengthCheck } from 'posts/domain/length-check'
import { Post } from 'posts/domain/post'

type Response =
  | CreatePostOutputDto
  | CreatePostErrors.InvalidTitle
  | CreatePostErrors.InvalidDescription

@injectable()
export class CreatePost {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  public async execute(inputDto: CreatePostInputDto): Promise<Response> {
    try {
      const { title, description, expiredAt } = inputDto
      if (!LengthCheck.isValidLength(title, [1, 50])) {
        return new CreatePostErrors.InvalidTitle()
      }
      if (!LengthCheck.isValidLength(description, [1, 200])) {
        return new CreatePostErrors.InvalidDescription()
      }

      const createdPost = await this.postRepository.saveEntity(
        new Post({ title, description, expiredAt })
      )

      const outputDto: CreatePostOutputDto = {
        title: createdPost.title,
        description: createdPost.description,
        expiredAt: createdPost.expiredAt,
      }
      return outputDto
    } catch (error) {
      throw new Error()
    }
  }
}
