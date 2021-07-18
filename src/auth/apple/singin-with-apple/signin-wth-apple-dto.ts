import { User } from 'users/domain/user'

export interface SigninWithAppleInputDto {
  vendor: string
  vendorAccountId: string
  email: string
}

export interface SigninWithAppleOutputDto {
  user: User
  accessToken: string
}
