import SpecificationEntity from '../entities/SpecificationEntity'

export default class SpecificationDTO {
  public description?: string
  public amount?: number

  constructor(description: string, amount: number) {
    if (description !== undefined) this.description = description
    if (amount !== undefined) this.amount = amount
  }

  static fromEntity(specificationEntity: SpecificationEntity) {
    return new SpecificationDTO(
      specificationEntity.description,
      specificationEntity.amount
    )
  }
}
