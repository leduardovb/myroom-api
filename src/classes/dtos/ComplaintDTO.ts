import ComplaintEntity from '../entities/ComplaintEntity'

export default class ComplaintDTO {
  public id!: number
  public type!: string
  public description!: string
  public rentPlaceId!: number
  public userId!: number

  constructor(
    id?: number,
    type?: string,
    description?: string,
    rentPlaceId?: number,
    userId?: number
  ) {
    if (id !== undefined) this.id = id
    if (type !== undefined) this.type = type
    if (description !== undefined) this.description = description.trim()
    if (rentPlaceId !== undefined) this.rentPlaceId = rentPlaceId
    if (userId !== undefined) this.userId = userId
  }

  public static fromEntity(complaintEntity: ComplaintEntity) {
    return new ComplaintDTO(
      complaintEntity.id,
      complaintEntity.type,
      complaintEntity.description,
      complaintEntity.rentPlaceId,
      complaintEntity.userId
    )
  }
}
