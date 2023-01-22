import { Address, RentPlace, Specification } from '@prisma/client'
import RentPlaceDTO from '../dtos/RentPlaceDTO'
import AddressEntity from './AddressEntity'
import SpecificationEntity from './SpecificationEntity'
import UserEntity from './UserEntity'

type RentPlacePrismaEntity = RentPlace & {
  specifications: Specification[]
  address: Address
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
      rentPlaceEntity.specifications.map((specification) =>
        SpecificationEntity.fromEntity(specification)
      ),
      rentPlaceEntity.createdAt
    )
  }
}
