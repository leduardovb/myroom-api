import AddressDTO from './AddressDTO'
import SpecificationDTO from './SpecificationDTO'
import RentPlaceEntity from '../entities/RentPlaceEntity'
import RentPlacePhotoDTO from './RentPlacePhotoDTO'
import { UserDTO } from './UserDTO'

export default class RentPlaceDTO {
  public id?: number
  public name?: string
  public description?: string | null
  public type?: string
  public roomType?: string
  public value?: number
  public owner?: UserDTO
  public address?: AddressDTO
  public photos?: Array<RentPlacePhotoDTO>
  public specifications?: Array<SpecificationDTO>

  constructor(
    id?: number,
    name?: string,
    description?: string | null,
    type?: string,
    roomType?: string,
    value?: number,
    owner?: UserDTO,
    address?: AddressDTO,
    photos?: Array<RentPlacePhotoDTO>,
    specifications?: Array<SpecificationDTO>
  ) {
    if (id !== undefined) this.id = id
    if (name !== undefined) this.name = name
    if (description !== undefined) this.description = description
    if (type !== undefined) this.type = type
    if (roomType !== undefined) this.roomType = roomType
    if (value !== undefined) this.value = value
    if (owner !== undefined) this.owner = owner
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
      rentPlaceEntity.user && UserDTO.fromEntityOwnerMap(rentPlaceEntity.user),
      rentPlaceEntity.address && AddressDTO.fromEntity(rentPlaceEntity.address),
      rentPlaceEntity.rentPlacePhotos &&
        rentPlaceEntity.rentPlacePhotos.map((photo) =>
          RentPlacePhotoDTO.fromEntity(photo)
        ),
      rentPlaceEntity.specifications &&
        rentPlaceEntity.specifications.map((specification) =>
          SpecificationDTO.fromEntity(specification)
        )
    )
  }
}
