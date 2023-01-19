import { User } from '@prisma/client'
import moment from 'moment'

export class UserDTO {
  id?: number
  name?: string
  email?: string
  document?: string
  birthDate?: Date | string
  gender?: string
  phone?: string | null
  password?: string
  verified?: boolean
  isActive?: boolean
  createdAt?: Date

  constructor(
    id?: number,
    name?: string,
    email?: string,
    document?: string,
    birthDate?: Date,
    gender?: string,
    phone?: string | null,
    password?: string,
    verified?: boolean,
    isActive?: boolean,
    createdAt?: Date
  ) {
    if (id !== undefined) this.id = id
    if (name !== undefined) this.name = name
    if (email !== undefined) this.email = email
    if (document !== undefined) this.document = document
    if (birthDate !== undefined)
      this.birthDate = moment(birthDate).format('DD/MM/YYYY')
    if (gender !== undefined) this.gender = gender
    if (phone !== undefined) this.phone = phone
    if (password !== undefined) this.password = password
    if (verified !== undefined) this.verified = verified
    if (isActive !== undefined) this.isActive = isActive
    if (createdAt !== undefined) this.createdAt = createdAt
  }

  static fromEntity(entity: User) {
    return new UserDTO(
      entity.id,
      entity.name,
      entity.email,
      entity.document,
      entity.birthDate,
      entity.gender,
      entity.phone,
      undefined,
      entity.verified,
      entity.isActive
    )
  }
}
