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

export interface RetirevePostOutputDto {
  post: IRetrievePost
}
