type imageSize = number[]

export interface CreatePostImagesInputDto {
  postId: string
  imageFiles: Express.Multer.File[]
  isFirstPick: boolean[]
  sizes: imageSize[]
}

export interface CreatePostImagesOutputDto {
  postId: string
}
