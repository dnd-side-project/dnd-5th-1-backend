import { User } from 'users/domain/user'

export interface SocialSigninInputDto {
  vendor: string
  vendorAccountId: string
  email?: string
}

export interface SocialSigninOutputDto {
  user: User
  accessToken: string
}
