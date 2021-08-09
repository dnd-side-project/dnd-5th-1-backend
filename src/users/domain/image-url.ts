export class ImageUrl {
  private _value: string

  constructor(imageUrl?: string) {
    this._value = imageUrl ? imageUrl : 'default image url'
  }

  public get value(): string {
    return this._value
  }
}
