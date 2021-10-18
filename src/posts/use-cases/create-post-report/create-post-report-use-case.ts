import { UniqueEntityId } from 'core/infra/unique-entity-id'
import {
  CreatePostReportInputDto,
  CreatePostReportOutputDto,
} from 'posts/controllers/create-post-report/create-post-report-dto'
import { PostReportModel } from 'infra/models/post-report-model'
import { getRepository } from 'typeorm'
import * as CreatePostReportErrors from './create-post-report-error'

type Response =
  | CreatePostReportOutputDto
  | CreatePostReportErrors.AlreadyReportedPost
//   | CreatePostErrors.InvalidDescription

export class CreatePostReport {
  public async execute(inputDto: CreatePostReportInputDto): Promise<Response> {
    try {
      const userId = new UniqueEntityId(inputDto.userId)

      const postReportRepository = getRepository(PostReportModel)
      const exists = await postReportRepository.findOne({
        userId: inputDto.userId,
        postId: inputDto.postId,
      })
      if (exists) {
        return new CreatePostReportErrors.AlreadyReportedPost()
      }
      const report = postReportRepository.create({
        userId: inputDto.userId,
        postId: inputDto.postId,
      })

      await postReportRepository.save(report)

      const outputDto: CreatePostReportOutputDto = {
        postId: report.postId.toString(),
      }
      return outputDto
    } catch (error) {
      throw Error(error.message)
    }
  }
}
