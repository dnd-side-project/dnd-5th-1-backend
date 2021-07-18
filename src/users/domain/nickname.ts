export class Nickname {
  private _value: string

  constructor(nickname?: string) {
    this._value = nickname ? nickname : 'random nickname'
  }

  public get value(): string {
    return this._value
  }
}
