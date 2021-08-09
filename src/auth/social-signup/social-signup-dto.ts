import { User } from 'users/domain/user'

export interface SocialSignupInputDto {
  vendor: string
  vendorAccountId: string
  nickname: string
  email?: string
}

export interface SocialSignupOutputDto {
  user: User
  accessToken: string
}
