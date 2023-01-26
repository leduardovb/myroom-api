import { RentPlaceComplaints } from '@prisma/client'
import { CreateComplaintDTO } from '../../dtos/CreateComplaintDTO'

export default class ComplaintEntity {
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

  public static fromDTO(
    userId: number,
    createComplaintDTO: CreateComplaintDTO
  ) {
    return new ComplaintEntity(
      undefined,
      createComplaintDTO.type,
      createComplaintDTO.description,
      createComplaintDTO.rentPlaceId,
      userId
    )
  }

  public static fromEntity(complaintEntity: RentPlaceComplaints) {
    return new ComplaintEntity(
      complaintEntity.id,
      complaintEntity.type,
      complaintEntity.description,
      complaintEntity.rentPlaceId,
      complaintEntity.userId
    )
  }
}
