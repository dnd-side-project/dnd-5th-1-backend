import { UniqueEntityId } from 'core/infra/unique-entity-id'
import {
  CreatePostReportInputDto,
  CreatePostReportOutputDto,
} from 'posts/controllers/create-post-report/create-post-report-dto'
import { PostReportModel } from 'infra/models/post-report-model'
import { getRepository } from 'typeorm'

type Response = CreatePostReportOutputDto
//   | CreatePostErrors.InvalidTitle
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
        throw new Error('Already reported post')
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
      throw new Error(error.message)
    }
  }
}
