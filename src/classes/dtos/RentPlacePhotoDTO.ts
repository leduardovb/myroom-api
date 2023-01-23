import RentPlacePhotoEntity from '../entities/RentPlacePhotoEntity'
import RentPlaceDTO from './RentPlaceDTO'

export default class RentPlacePhotoDTO {
  public id?: number
  public name?: string
  public url?: string | null
  public rentPlace?: RentPlaceDTO

  constructor(
    id?: number,
    name?: string,
    url?: string | null,
    rentPlace?: RentPlaceDTO
  ) {
    if (id !== undefined) this.id = id
    if (name !== undefined) this.name = name
    if (url !== undefined) this.url = url
    if (rentPlace !== undefined) this.rentPlace = rentPlace
  }

  static fromEntity(rentPlacePhotoEntity: RentPlacePhotoEntity) {
    return new RentPlacePhotoDTO(
      rentPlacePhotoEntity.id,
      rentPlacePhotoEntity.name,
      rentPlacePhotoEntity.url
    )
  }
}
