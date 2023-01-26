import { Address } from '@prisma/client'
import AddressDTO from '../dtos/AddressDTO'

export default class AddressEntity {
  public id!: number
  public streetName!: string
  public buildingCode!: string
  public complement!: string | null
  public neighborhood!: string
  public city!: string
  public state!: string
  public zipCode!: string

  constructor(
    id?: number,
    streetName?: string,
    buildingCode?: string,
    complement?: string | null,
    neighborhood?: string,
    city?: string,
    state?: string,
    zipCode?: string
  ) {
    if (id !== undefined) this.id = id
    if (streetName !== undefined) this.streetName = streetName.trim()
    if (buildingCode !== undefined) this.buildingCode = buildingCode.trim()
    if (complement !== undefined)
      this.complement = complement ? complement.trim() : null
    if (neighborhood !== undefined) this.neighborhood = neighborhood.trim()
    if (city !== undefined) this.city = city
    if (state !== undefined) this.state = state
    if (zipCode !== undefined) this.zipCode = zipCode
  }

  public static fromDTO(data: AddressDTO) {
    return new AddressEntity(
      data.id,
      data.streetName,
      data.buildingCode,
      data.complement,
      data.neighborhood,
      data.city,
      data.state,
      data.zipCode
    )
  }

  static fromEntity(addressEntity: Address) {
    return new AddressEntity(
      addressEntity.id,
      addressEntity.streetName,
      addressEntity.buildingCode,
      addressEntity.complement,
      addressEntity.neighborhood,
      addressEntity.city,
      addressEntity.state,
      addressEntity.zipCode
    )
  }

  overrideBasedOnDTO(data: AddressDTO) {
    if (data.streetName !== undefined) this.streetName = data.streetName.trim()
    if (data.buildingCode !== undefined)
      this.buildingCode = data.buildingCode.trim()
    if (data.complement !== undefined)
      this.complement = data.complement ? data.complement.trim() : null
    if (data.neighborhood !== undefined)
      this.neighborhood = data.neighborhood.trim()
    if (data.zipCode !== undefined) this.zipCode = data.zipCode
  }
}
