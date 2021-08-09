interface imageSize {
  width: number
  height: number
}

interface imageMetaData {
  isFirstPick: boolean
  size: imageSize
}

export interface CreatePostImagesInputDto {
  postId: string
  imageFiles: Express.Multer.File[]
  metadata: imageMetaData[]
}

export interface CreatePostImagesOutputDto {
  postId: string
}
