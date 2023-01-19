import moment from 'moment'
import { UserDTO } from '../dtos/UserDTO'

export default class UserEntity {
  id!: number
  name!: string
  email!: string
  document!: string
  birthDate!: Date
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
    birthDate?: Date | string,
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
    if (birthDate !== undefined) this.birthDate = moment(birthDate).toDate()
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
      dto.birthDate,
      dto.gender,
      dto.phone,
      dto.password,
      dto.verified,
      dto.isActive,
      dto.createdAt
    )
  }
}
