import { Post } from 'posts/domain/post'

export interface CreatePostInputDto {
  title: string
  description: string
  expiredAt: Date
}

export interface CreatePostOutputDto {
  title: string
  description: string
  expiredAt: Date
}
