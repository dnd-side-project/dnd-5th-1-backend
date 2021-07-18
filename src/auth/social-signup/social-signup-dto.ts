import { User } from 'users/domain/user'

export interface SocialSignupInputDto {
  vendor: string
  vendorAccountId: string
  email?: string
  nickname: string
}

export interface SocialSignupOutputDto {
  user: User
  accessToken: string
}
