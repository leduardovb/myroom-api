import { Address, RentPlace, RentPlacePhotos } from '@prisma/client'
import RentPlacePhotoDTO from './RentPlacePhotoDTO'

export default class ResumedRentPlaceDTO {
  constructor(
    public id: number,
    public title: string,
    public value: number,
    public photos: Array<RentPlacePhotoDTO>
  ) {}

  static fromPrismaEntity(
    entity: RentPlace & {
      address: Address
      rentPlacePhotos: RentPlacePhotos[]
    }
  ) {
    return new ResumedRentPlaceDTO(
      entity.id,
      `${entity.name}, ${entity.address.city}-${entity.address.state}`,
      Number(entity.value),
      entity.rentPlacePhotos.map((photo) => RentPlacePhotoDTO.fromEntity(photo))
    )
  }
}
