import { PrismaClient } from '.prisma/client'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import DomainException from '../exceptions/DomainException'
import { hashPassword } from '../helpers/functions'
import { UserDTO } from '../classes/dtos/UserDTO'
import UserEntity from '../classes/entities/UserEntity'
import UserFavoriteEntity from '../classes/entities/UserFavoriteEntity'
import { UpdateUserDTO } from '../dtos/UpdateUserDTO'
import PayloadDTO from '../classes/dtos/PayloadDTO'
import { Prisma } from '@prisma/client'
import { ResponseDTO } from '../classes/dtos/ResponseDTO'
import { StatusCodes } from 'http-status-codes'
import UserFavoriteDTO from '../classes/dtos/UserFavoriteDTO'
import ResumedRentPlaceDTO from '../classes/dtos/ResumedRentPlaceDTO'

export default class UserService {
  private database: PrismaClient

  constructor(database: PrismaClient) {
    this.database = database
  }

  public async create(createUserDTO: CreateUserDTO) {
    console.debug(
      'Criando novo usuário: ',
      JSON.stringify(createUserDTO, null, 2)
    )
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

    console.debug(`Usuário criado com sucesso: ${userEntity.id}`)

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

  public async handleFavorite(payload: PayloadDTO, rentPlaceId: number) {
    console.debug(
      'Adicionando ou removendo imóvel dos favoritos: ',
      rentPlaceId
    )
    const userEntity = await this.getOrFailBy(
      { id: payload.userId },
      'Usuário não encontrado'
    )
    const rentPlaceEntity = await this.database.rentPlace.findFirst({
      where: { id: rentPlaceId },
    })
    if (!rentPlaceEntity)
      throw DomainException.entityNotFound('Imóvel não encontrado')
    const entity = await this.database.userFavorites.findFirst({
      where: { userId: userEntity.id, rentPlaceId: rentPlaceEntity.id },
    })

    if (entity) {
      const savedEntity = await this.database.userFavorites.delete({
        where: { userId_rentPlaceId: { rentPlaceId, userId: payload.userId } },
      })
      return new ResponseDTO(
        StatusCodes.OK,
        'Imóvel removido dos favoritos',
        UserFavoriteEntity.fromEntity(savedEntity)
      )
    } else {
      const savedEntity = await this.database.userFavorites.create({
        data: { userId: userEntity.id, rentPlaceId: rentPlaceEntity.id },
      })
      return new ResponseDTO(
        StatusCodes.OK,
        'Imóvel adicionado aos favoritos',
        UserFavoriteDTO.fromEntity(UserFavoriteEntity.fromEntity(savedEntity))
      )
    }
  }

  public async listFavorites(userId: number) {
    const userEntity = await this.getOrFailBy(
      { id: userId },
      'Usuário não encontrado'
    )
    const userFavoriteEntities = await this.database.userFavorites.findMany({
      where: { userId: userEntity.id },
      include: {
        rentPlace: {
          include: {
            rentPlacePhotos: true,
            address: true,
          },
        },
      },
    })
    return userFavoriteEntities.map((entity) =>
      ResumedRentPlaceDTO.fromPrismaEntity(entity.rentPlace)
    )
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
