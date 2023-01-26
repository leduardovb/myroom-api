import { ComplaintType } from '../helpers/enums'

export interface CreateComplaintDTO {
  type: ComplaintType
  description: string
  rentPlaceId: number
}
