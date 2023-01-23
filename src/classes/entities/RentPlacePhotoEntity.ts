import { RentPlacePhotos } from '@prisma/client'
import RentPlacePhotoDTO from '../dtos/RentPlacePhotoDTO'
import RentPlaceEntity from './RentPlaceEntity'

export default class RentPlacePhotoEntity {
  public id!: number
  public name!: string
  public url!: string | null
  public rentPlaceId!: number

  constructor(
    id?: number,
    name?: string,
    url?: string | null,
    rentPlaceId?: number
  ) {
    if (id !== undefined) this.id = id
    if (name !== undefined) this.name = name
    if (url !== undefined) this.url = url ?? null
    if (rentPlaceId !== undefined) this.rentPlaceId = rentPlaceId
  }

  static fromDTO(data: RentPlacePhotoDTO) {
    return new RentPlacePhotoEntity(data.id, data.name, data.url)
  }

  static fromEntity(data: RentPlacePhotos) {
    return new RentPlacePhotoEntity(
      data.id,
      data.name,
      data.url,
      data.rentPlaceId
    )
  }
}
