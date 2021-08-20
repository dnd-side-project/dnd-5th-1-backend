import * as CreateImagesError from './create-post-images-error'
import { inject, injectable } from 'tsyringe'
import {
  CreatePostImagesInputDto,
  CreatePostImagesOutputDto,
} from '../../controllers/create-post-images-controller/create-post-images-dto'
import { s3upload, ImageFile } from '../../../lib/aws-s3/s3-upload'
import { PostImage } from 'post-images/domain/post-image'
import { UniqueEntityId } from '../../../core/infra/unique-entity-id'
import { IPostImageRepository } from 'post-images/repositories/post-image-repository.interface'
import { Extension } from 'post-images/domain/extension'
import { ExtensionType } from '../../domain/extension'
import sharp from 'sharp'

type Response = CreatePostImagesOutputDto | CreateImagesError.S3UploadFailed

@injectable()
export class CreatePostImages {
  constructor(
    @inject('IPostImageRepository')
    private postImageRepository: IPostImageRepository
  ) {}

  public async execute(inputDto: CreatePostImagesInputDto): Promise<Response> {
    inputDto.imageFiles.forEach(async (imageFile, idx) => {
      if (Extension.isExtension(imageFile.mimetype)) {
        return new CreateImagesError.InvalidExtension()
      }
      const extension = new Extension(imageFile.mimetype as ExtensionType)

      let imageUrl, thumbnailUrl
      try {
        imageUrl = (await s3upload(imageFile)) as string

        const thumbnailImage: ImageFile = {
          originalname: imageFile.originalname,
          mimetype: imageFile.mimetype,
          buffer: await sharp(imageFile.buffer)
            .resize({ width: 270, height: 270, fit: 'inside' })
            .toBuffer(),
        }
        thumbnailUrl = (await s3upload(thumbnailImage)) as string
      } catch (error) {
        return new CreateImagesError.S3UploadFailed()
      }

      const postId = new UniqueEntityId(inputDto.postId)
      const originalName = imageFile.originalname
      const isFirstPick = idx === inputDto.metadata.isFirstPick ? true : false
      const width = inputDto.metadata.sizes[idx].width
      const height = inputDto.metadata.sizes[idx].height

      const postImage = new PostImage({
        originalName,
        postId,
        imageUrl,
        thumbnailUrl,
        isFirstPick,
        extension,
        width,
        height,
      })

      const alreadyExists = await this.postImageRepository.exists(postImage)
      if (alreadyExists) {
        return new CreateImagesError.PostImageExists()
      }

      try {
        console.log('here')
        await this.postImageRepository.save(postImage)
      } catch (error) {
        return new Error(
          `postImage save failed, postId: ${inputDto.postId}, imageUrl: ${imageUrl}`
        )
      }
    })

    const outputDto: CreatePostImagesOutputDto = {
      postId: inputDto.postId,
    }
    return outputDto
  }
}
