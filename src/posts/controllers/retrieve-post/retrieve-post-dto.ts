export interface RetirevePostInputDto {
  postId: string
}

export interface IRetrievePost {
  isVoted: boolean
  votedImageId: string
  title: string
  description: string
  images: [
    {
      imageId: string
      imageUrl: string
      pickedNum: number
    },
    {
      imageId: string
      imageUrl: string
      pickedNum: number
    },
    {
      imageId: string
      imageUrl: string
      pickedNum: number
    }
  ]
  participantsNum: number
}

export interface RetrievePostQueryObject {
  id: string
  imageUrl: string
  isFirstPick: number
  pickedNum: number
  emotion: number
  color: number
  composition: number
  light: number
  skip: number
}

export interface RetirevePostOutputDto {
  post: IRetrievePost
}
