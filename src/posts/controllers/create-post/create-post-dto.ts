import { Post } from 'posts/domain/post'

export interface CreatePostInputDto {
  title: string
  expiredAt: Date
  userId: string
}

export interface CreatePostOutputDto {
  postId: string
}
