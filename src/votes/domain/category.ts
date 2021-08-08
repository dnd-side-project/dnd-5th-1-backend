const CategoryType = {
  emotion: 'emotion',
  color: 'color',
  composition: 'composition',
  light: 'light',
  skip: 'skip',
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
      category === 'emotion' ||
      category === 'color' ||
      category === 'composition' ||
      category === 'light' ||
      category === 'skip'
    )
  }
}
