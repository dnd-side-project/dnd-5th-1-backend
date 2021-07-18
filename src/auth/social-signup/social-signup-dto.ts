import { User } from 'infra/models/user-model'

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
