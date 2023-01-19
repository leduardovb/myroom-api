import { PrismaClient } from '.prisma/client'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import DomainException from '../exceptions/DomainException'
import { hashPassword } from '../helpers/functions'
import { UserDTO } from '../classes/dtos/UserDTO'
import UserEntity from '../classes/entities/UserEntity'

export default class UserService {
  private database: PrismaClient

  constructor(database: PrismaClient) {
    this.database = database
  }

  public async create(createUserDTO: CreateUserDTO) {
    const userExistsByEmail =
      (await this.database.user.findFirst({
        where: { email: createUserDTO.email },
      })) !== null

    if (userExistsByEmail)
      throw DomainException.entityAlreadyExists('Email já cadastrado')

    const userExistsByDocument =
      (await this.database.user.findFirst({
        where: { document: createUserDTO.document },
      })) !== null

    if (userExistsByDocument)
      throw DomainException.entityAlreadyExists('Documento já cadastrado')

    const newUserEntity = UserEntity.fromDTO(createUserDTO)
    newUserEntity.password = await hashPassword(createUserDTO.password)
    const userEntity = await this.database.user.create({ data: newUserEntity })

    return UserDTO.fromEntity(userEntity)
  }
}
