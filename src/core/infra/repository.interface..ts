import { Post } from 'posts/domain/post'

export interface Repository<T> {
  exists(id: string): Promise<boolean>
  saveEntity(t: T): Promise<Post>
  deleteEntity(id: string): Promise<boolean>
}
