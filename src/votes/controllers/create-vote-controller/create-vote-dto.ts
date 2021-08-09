export class CreateVoteInputDto {
  userId: string
  postId: string
  postImageId: string
  category: string
}

export class CreateVoteOutputDto {
  userId: string
  postId: string
}
