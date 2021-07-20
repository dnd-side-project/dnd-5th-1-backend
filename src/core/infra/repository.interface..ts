export interface Repository<T> {
  exists(t: T): boolean
  saveEntity(t: T): void
  deleteEntity(t: T): void
}
