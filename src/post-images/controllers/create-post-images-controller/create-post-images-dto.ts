interface imageSize {
  width: number
  height: number
}

interface imagesMetaData {
  isFirstPick: number
  sizes: imageSize[]
}

export interface CreatePostImagesInputDto {
  postId: string
  imageFiles: Express.Multer.File[]
  metadata: imagesMetaData
}

export interface CreatePostImagesOutputDto {
  postId: string
}
