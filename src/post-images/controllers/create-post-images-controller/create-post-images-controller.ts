import { BaseController } from 'core/infra/base-controller'
import { autoInjectable } from 'tsyringe'
import { CreatePostImagesInputDto } from './create-post-images-dto'
import { CreatePostImages } from 'post-images/use-cases/create-images/create-post-images'
import { UseCaseError } from 'core/infra/user-case-error'
import {
  InvalidExtension,
  PostImageExists,
  S3UploadFailed,
} from 'post-images/use-cases/create-images/create-post-images-error'

@autoInjectable()
export class CreateImagesController extends BaseController {
  constructor(private useCase: CreatePostImages) {
    super()
  }

  async executeImpl(): Promise<any> {
    const dto: CreatePostImagesInputDto = {
      postId: this.req.query.post_id,
      imageFiles: this.req.files,
      isFirstPick: this.req.body.isFirstPick,
      sizes: this.req.body.sizes,
    } as CreatePostImagesInputDto

    console.log(
      `formdata files: ${JSON.stringify(this.req.files, (key, val) => {
        if (key === 'buffer') return 'image buffer data'
        else return val
      })}`
    )

    try {
      const result = await this.useCase.execute(dto)
      console.log(`CreateImages Usecase result: ${result}`)

      if (result instanceof UseCaseError) {
        switch (result.constructor) {
          case S3UploadFailed:
            return this.forbidden(result.message)
          case PostImageExists:
            return this.alreadyExists(result.message)
          case InvalidExtension:
            return this.forbidden(result.message)
        }
      } else {
        return this.ok(this.res, 200)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.fail(error)
      }
    }
  }
}
