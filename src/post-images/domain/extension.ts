const ExtensionType = {
  jpeg: 'jpeg',
  jpg: 'jpg',
  png: 'png'
} as const

export type ExtensionType = typeof ExtensionType[keyof typeof ExtensionType]

export class Extension {
  private _value: ExtensionType

  constructor(extension: ExtensionType) {
    this._value = extension
  }

  public get value(): ExtensionType {
    return this._value
  }

  public static isExtension(extension: string): boolean {
    return extension === 'jpeg' || extension === 'jpg' ||extension === 'png'
  }
}
