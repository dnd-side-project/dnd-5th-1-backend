// import { uuid } from 'uuid'

export class UniqueEntityId {
  private value: string | number

  constructor(id?: string | number) {
    this.value = id ? id : 'sample_uuid'
  }

  public toValue(): number | string {
    return this.value
  }

  public toString(): string {
    return String(this.value)
  }
}
