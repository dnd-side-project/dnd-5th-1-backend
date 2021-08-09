const VendorType = {
  Kakao: 'Kakao',
  Apple: 'Apple',
} as const

export type VendorType = typeof VendorType[keyof typeof VendorType]

export class Vendor {
  private _value: VendorType

  constructor(vendor: VendorType) {
    this._value = vendor
  }

  public get value(): VendorType {
    return this._value
  }

  public static isVendor(vendor: string): boolean {
    return vendor === 'Apple' || vendor === 'Kakao'
  }
}
