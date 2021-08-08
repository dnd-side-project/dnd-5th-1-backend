export class CreateVoteInputDto {
  userId: string
  postId: string
  postImageID: string
  category: string
}

export class CreateVoteOutputDto {
  userId: string
  postId: string
}
