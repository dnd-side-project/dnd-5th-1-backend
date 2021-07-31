export class LengthCheck {
  private _value: string

  constructor(text) {
    this._value = text
  }

  public get value(): string {
    return this._value
  }

  public static isValidLength(text: string, range: number[]): boolean {
    return range[0] <= text.length && text.length <= range[1]
  }
}
