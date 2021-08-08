const CategoryType = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
} as const

export type CategoryType = typeof CategoryType[keyof typeof CategoryType]

export class Category {
  private _value: CategoryType

  constructor(extension: CategoryType) {
    this._value = extension
  }

  public get value(): CategoryType {
    return this._value
  }

  public static isCategory(category: string): boolean {
    return (
      category === '1' ||
      category === '2' ||
      category === '3' ||
      category === '4'
    )
  }
}
