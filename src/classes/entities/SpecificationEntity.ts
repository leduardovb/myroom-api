import { Specification } from '@prisma/client'
import SpecificationDTO from '../dtos/SpecificationDTO'
import RentPlaceEntity from './RentPlaceEntity'

export default class SpecificationEntity {
  public description!: string
  public amount!: number
  public rentPlace!: RentPlaceEntity

  constructor(
    description?: string,
    amount?: number,
    rentPlace?: RentPlaceEntity
  ) {
    if (description !== undefined) this.description = description
    if (amount !== undefined) this.amount = amount
    if (rentPlace !== undefined) this.rentPlace = rentPlace
  }

  static fromDTO(data: SpecificationDTO) {
    return new SpecificationEntity(data.description, data.amount, undefined)
  }

  static fromEntity(specificationEntity: Specification) {
    return new SpecificationEntity(
      specificationEntity.description,
      specificationEntity.amount,
      undefined
    )
  }
}
