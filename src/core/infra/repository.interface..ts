export interface Repository<T> {
  exists(t: T): Promise<boolean>
  saveEntity(t: T): Promise<void>
  deleteEntity(t: T): Promise<void>
}
