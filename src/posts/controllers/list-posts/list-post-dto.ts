export interface ListPostsInputDto {
  userId: string
  page: number
  limit: number
}

export interface IPostItem {
  title: string
  thumbnailUrl: string
  participantsNum: number
}

export interface ListPostsOutputDto {
  posts: IPostItem[]
  total: number
}
