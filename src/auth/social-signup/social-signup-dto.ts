import { User } from 'users/domain/user'

export interface SocialSignupInputDto {
  vendor: string
  vendorAccountId: string
  nickname: string
  email?: string
  email: string
  nickname: string
  imageUrl: string
}

export interface SocialSignupOutputDto {
  user: User
  accessToken: string
}
