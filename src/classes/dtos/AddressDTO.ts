import AddressEntity from '../entities/AddressEntity'

export default class AddressDTO {
  public id?: number
  public streetName?: string
  public buildingCode?: string
  public complement?: string | null
  public neighborhood?: string
  public city?: string
  public state?: string
  public zipCode?: string

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
    if (streetName !== undefined) this.streetName = streetName
    if (buildingCode !== undefined) this.buildingCode = buildingCode
    if (complement !== undefined) this.complement = complement
    if (neighborhood !== undefined) this.neighborhood = neighborhood
    if (city !== undefined) this.city = city
    if (state !== undefined) this.state = state
    if (zipCode !== undefined) this.zipCode = zipCode
  }

  static fromEntity(addressEntity: AddressEntity) {
    return new AddressDTO(
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
}
