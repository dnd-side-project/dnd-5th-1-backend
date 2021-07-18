import { User } from 'users/domain/user'

export interface SigninWithKakaoInputDto {
  vendor: string
  vendorAccountId: string
  email: string
}

export interface SigninWithKakaoOutputDto {
  user: User
  accessToken: string
}
