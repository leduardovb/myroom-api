import { PrismaClient } from '.prisma/client'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import DomainException from '../exceptions/DomainException'
import { hashPassword } from '../helpers/functions'
import { UserDTO } from '../classes/dtos/UserDTO'
import UserEntity from '../classes/entities/UserEntity'
import { UpdateUserDTO } from '../dtos/UpdateUserDTO'
import PayloadDTO from '../classes/dtos/PayloadDTO'
import { Prisma } from '@prisma/client'

export default class UserService {
  private database: PrismaClient

  constructor(database: PrismaClient) {
    this.database = database
  }

  public async create(createUserDTO: CreateUserDTO) {
    await this.failIfEntityExistsBy(
      { email: createUserDTO.email },
      'Email já cadastrado'
    )

    await this.failIfEntityExistsBy(
      { document: createUserDTO.document },
      'CPF já cadastrado'
    )

    const newUserEntity = UserEntity.fromDTO(createUserDTO)
    newUserEntity.password = await hashPassword(createUserDTO.password)
    const userEntity = await this.database.user.create({ data: newUserEntity })

    return UserDTO.fromEntity(userEntity)
  }

  public async update(paylodDTO: PayloadDTO, updateUserDTO: UpdateUserDTO) {
    const userEntity = await this.getOrFailBy(
      { id: paylodDTO.userId },
      'Usuário não encontrado'
    )

    if (
      updateUserDTO.document &&
      updateUserDTO.document !== userEntity.document
    )
      await this.failIfEntityExistsBy(
        { document: updateUserDTO.document },
        'Documento já cadastrado'
      )

    const newUserEntity =
      UserEntity.fromEntity(userEntity).overrideFromDTO(updateUserDTO)

    const updatedUserEntity = await this.database.user.update({
      data: newUserEntity,
      where: { id: paylodDTO.userId },
    })
    return UserDTO.fromEntity(updatedUserEntity)
  }

  public async single(id: number) {
    const userEntity = await this.getOrFailBy(
      { id: id },
      'Usuário não encontrado'
    )
    return UserDTO.fromEntity(userEntity)
  }

  private async failIfEntityExistsBy(
    where: Prisma.UserWhereInput,
    message: string
  ) {
    const userExists = (await this.database.user.findFirst({ where })) !== null
    if (userExists) throw DomainException.entityAlreadyExists(message)
  }

  private async getOrFailBy(where: Prisma.UserWhereInput, message: string) {
    const userExists = await this.database.user.findFirst({ where })
    if (!userExists) throw DomainException.entityNotFound(message)
    return userExists
  }
}
