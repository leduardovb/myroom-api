import { PrismaClient } from '@prisma/client'
import { LoginDTO } from '../dtos/LoginDTO'
import DomainException from '../exceptions/DomainException'
import { comparePasswords, createToken } from '../helpers/functions'
import PayloadDTO from '../classes/dtos/PayloadDTO'

export default class AuthenticationService {
  private database: PrismaClient

  constructor(database: PrismaClient) {
    this.database = database
  }

  public async login(loginDTO: LoginDTO) {
    const userEntity = await this.database.user.findFirst({
      where: { email: loginDTO.email },
    })

    if (!userEntity)
      throw DomainException.invalidState('Senha ou email inválidos')

    const isPasswordValid = await comparePasswords(
      userEntity.password,
      loginDTO.password
    )

    if (!isPasswordValid)
      throw DomainException.invalidState('Senha ou email inválidos')

    if (!userEntity.isActive)
      throw DomainException.entityDisabled('Usuário inativo')

    const token = createToken(
      new PayloadDTO(userEntity.id, userEntity.isActive, userEntity.verified)
    )
    return token
  }
}
