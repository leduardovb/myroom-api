import PhotoDTO from './PhotoDTO'
import AddressDTO from './AddressDTO'
import SpecificationDTO from './SpecificationDTO'
import RentPlaceEntity from '../entities/RentPlaceEntity'

export default class RentPlaceDTO {
  public id?: number
  public name?: string
  public description?: string | null
  public type?: string
  public roomType?: string
  public value?: number
  public address?: AddressDTO
  public photos?: Array<PhotoDTO>
  public specifications?: Array<SpecificationDTO>

  constructor(
    id?: number,
    name?: string,
    description?: string | null,
    type?: string,
    roomType?: string,
    value?: number,
    address?: AddressDTO,
    photos?: Array<PhotoDTO>,
    specifications?: Array<SpecificationDTO>
  ) {
    if (id !== undefined) this.id = id
    if (name !== undefined) this.name = name
    if (description !== undefined) this.description = description
    if (type !== undefined) this.type = type
    if (roomType !== undefined) this.roomType = roomType
    if (value !== undefined) this.value = value
    if (address !== undefined) this.address = address
    if (photos !== undefined) this.photos = photos
    if (specifications !== undefined) this.specifications = specifications
  }

  static fromEntity(rentPlaceEntity: RentPlaceEntity) {
    return new RentPlaceDTO(
      rentPlaceEntity.id,
      rentPlaceEntity.name,
      rentPlaceEntity.description,
      rentPlaceEntity.type,
      rentPlaceEntity.roomType,
      rentPlaceEntity.value,
      rentPlaceEntity.address && AddressDTO.fromEntity(rentPlaceEntity.address),
      undefined,
      rentPlaceEntity.specifications &&
        rentPlaceEntity.specifications.map((specification) =>
          SpecificationDTO.fromEntity(specification)
        )
    )
  }
}
