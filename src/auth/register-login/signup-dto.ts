import { User } from 'users/domain/user'

export interface SignupInputDto {
  vendor: string
  vendorAccountId: string
  email: string
  nickname: string
  imageUrl: string
}

export interface SignupOutputDto {
  user: User
  accessToken: string
}