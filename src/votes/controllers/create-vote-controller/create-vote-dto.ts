export interface CreateVoteInputDto {
  userId: string
  postId: string
  postImageId: string
  category: string
}

export interface CreateVoteOutputDto {
  userId: string
  postId: string
}
