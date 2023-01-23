import {
  Address,
  RentPlace,
  RentPlacePhotos,
  Specification,
} from '@prisma/client'
import RentPlaceDTO from '../dtos/RentPlaceDTO'
import AddressEntity from './AddressEntity'
import SpecificationEntity from './SpecificationEntity'
import UserEntity from './UserEntity'
import RentPlacePhotoEntity from './RentPlacePhotoEntity'

type RentPlacePrismaEntity = RentPlace & {
  specifications: Specification[]
  address: Address
  rentPlacePhotos: Array<RentPlacePhotos>
}

export default class RentPlaceEntity {
  public id!: number
  public name!: string
  public description!: string | null
  public type!: string
  public roomType!: string
  public value!: number
  public user!: UserEntity
  public address!: AddressEntity
  public rentPlacePhotos!: Array<RentPlacePhotoEntity>
  public specifications!: Array<SpecificationEntity>
  public createdAt!: Date

  constructor(
    id?: number,
    name?: string,
    description?: string | null,
    type?: string,
    roomType?: string,
    value?: number,
    user?: UserEntity,
    address?: AddressEntity,
    rentPlacePhotos?: Array<RentPlacePhotoEntity>,
    specifications?: Array<SpecificationEntity>,
    createdAt?: Date
  ) {
    if (id !== undefined) this.id = id
    if (name !== undefined) this.name = name.trim()
    if (description !== undefined)
      this.description = description ? description.trim() : null
    if (type !== undefined) this.type = type
    if (roomType !== undefined) this.roomType = roomType
    if (value !== undefined) this.value = value
    if (user !== undefined) this.user = user
    if (address !== undefined) this.address = address
    if (rentPlacePhotos !== undefined) this.rentPlacePhotos = rentPlacePhotos
    if (specifications !== undefined) this.specifications = specifications
    if (createdAt !== undefined) this.createdAt = createdAt
  }

  public static fromDTO(data: RentPlaceDTO) {
    return new RentPlaceEntity(
      undefined,
      data.name,
      data.description,
      data.type,
      data.roomType,
      data.value,
      undefined,
      data.address && AddressEntity.fromDTO(data.address),
      data.photos?.map((photo) => RentPlacePhotoEntity.fromDTO(photo)),
      data.specifications?.map((specification) =>
        SpecificationEntity.fromDTO(specification)
      )
    )
  }

  public static fromEntity(rentPlaceEntity: RentPlacePrismaEntity) {
    return new RentPlaceEntity(
      rentPlaceEntity.id,
      rentPlaceEntity.name,
      rentPlaceEntity.description,
      rentPlaceEntity.type,
      rentPlaceEntity.roomType,
      Number(rentPlaceEntity.value),
      undefined,
      AddressEntity.fromEntity(rentPlaceEntity.address),
      rentPlaceEntity.rentPlacePhotos.map((photo) =>
        RentPlacePhotoEntity.fromEntity(photo)
      ),
      rentPlaceEntity.specifications.map((specification) =>
        SpecificationEntity.fromEntity(specification)
      ),
      rentPlaceEntity.createdAt
    )
  }
}
