import { IPostRepository } from 'posts/repositories/post-repository.interface'
import * as RetrievePostErrors from './retrieve-post-error'
import {
  RetirevePostInputDto,
  RetirevePostOutputDto,
} from '../../controllers/retrieve-post/retrieve-post-dto'
import { inject, injectable } from 'tsyringe'
import express from 'express'

type Response = RetirevePostOutputDto | RetrievePostErrors.NotFound

@injectable()
export class RetrievePost {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  public async execute(req: express.Request, inputDto: RetirevePostInputDto): Promise<Response> {
    try {
      const { postId } = inputDto

      const list = await this.postRepository.retrieve(req, postId)

      const outputDto: RetirevePostOutputDto = list
      return outputDto
    } catch (error) {
      throw error
    }
  }
}
