import moment from 'moment'
import { UserDTO } from '../dtos/UserDTO'
import { User } from '@prisma/client'

export default class UserEntity {
  id!: number
  name!: string
  email!: string
  document!: string
  gender!: string
  phone?: string | null
  password!: string
  verified!: boolean
  isActive!: boolean
  createdAt!: Date

  constructor(
    id?: number,
    name?: string,
    email?: string,
    document?: string,
    gender?: string,
    phone?: string | null,
    password?: string,
    verified?: boolean,
    isActive?: boolean,
    createdAt?: Date
  ) {
    if (id !== undefined) this.id = id
    if (name !== undefined) this.name = name.trim()
    if (email !== undefined) this.email = email.trim()
    if (document !== undefined) this.document = document
    if (gender !== undefined) this.gender = gender
    if (phone !== undefined) this.phone = phone
    if (password !== undefined) this.password = password
    if (verified !== undefined) this.verified = verified
    if (isActive !== undefined) this.isActive = isActive
    if (createdAt !== undefined) this.createdAt = createdAt
  }

  static fromDTO(dto: UserDTO) {
    return new UserEntity(
      dto.id,
      dto.name,
      dto.email,
      dto.document,
      dto.gender,
      dto.phone,
      dto.password,
      dto.verified,
      dto.isActive,
      dto.createdAt
    )
  }

  static fromEntity(entity: User) {
    return new UserEntity(
      entity.id,
      entity.name,
      entity.email,
      entity.document,
      entity.gender,
      entity.phone,
      entity.password,
      entity.verified,
      entity.isActive,
      entity.createdAt
    )
  }

  public overrideFromDTO(dto: UserDTO) {
    return new UserEntity(
      undefined,
      dto.name,
      undefined,
      dto.document,
      dto.gender,
      dto.phone,
      dto.password,
      dto.verified,
      dto.isActive
    )
  }
}
