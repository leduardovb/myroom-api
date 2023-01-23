import { PrismaClient } from '@prisma/client'
import PayloadDTO from '../classes/dtos/PayloadDTO'
import DomainException from '../exceptions/DomainException'
import { CreateRentPlaceDTO } from '../dtos/CreateRentPlaceDTO'
import FirebaseService from './FirebaseService'
import RentPlaceEntity from '../classes/entities/RentPlaceEntity'
import RentPlaceDTO from '../classes/dtos/RentPlaceDTO'
import ViaCepService from './ViaCepService'
import { Pagination } from '../interfaces/Pagination'
import ResumedRentPlaceDTO from '../classes/dtos/ResumedRentPlaceDTO'
import PaginationDTO from '../classes/dtos/PaginationDTO'

export default class RentPlaceService {
  constructor(
    private database: PrismaClient,
    private firebaseService: FirebaseService,
    private viaCepService: ViaCepService
  ) {}

  public async create(payload: PayloadDTO, data: CreateRentPlaceDTO) {
    const userOwner = await this.database.user.findUnique({
      where: { id: payload.userId },
    })
    if (!userOwner) throw DomainException.entityNotFound('Usuário')
    if (!userOwner.isActive)
      throw DomainException.entityDisabled('Usuário desativado')

    const cepInfo = await this.viaCepService.getAddressByZipCode(
      data.address.zipCode
    )
    if (!cepInfo) throw DomainException.invalidState('CEP informado inválido')

    const rentPlaceEntity = RentPlaceEntity.fromDTO(data)
    const newPlaceEntity = await this.database.rentPlace.create({
      data: {
        ...rentPlaceEntity,
        id: undefined,
        user: {
          connect: { id: payload.userId },
        },
        address: {
          create: {
            ...rentPlaceEntity.address,
            city: cepInfo.localidade,
            state: cepInfo.uf,
          },
        },
        specifications: {
          create: rentPlaceEntity.specifications,
        },
        rentPlacePhotos: {
          createMany: {
            data: rentPlaceEntity.rentPlacePhotos,
          },
        },
      },
      include: {
        address: true,
        specifications: true,
        rentPlacePhotos: true,
      },
    })

    const savedRentPlaceEntity = RentPlaceEntity.fromEntity(newPlaceEntity)

    for (const image of data.photos) {
      const bucketPath = `rent-place:${newPlaceEntity.id}/${image.name}`
      const snapshot = await this.firebaseService.uploadToBucket(
        bucketPath,
        image.dataUrl
      )
      const rentPlacePhotoEntity = savedRentPlaceEntity.rentPlacePhotos.find(
        (photo) => photo.name === image.name
      )
      rentPlacePhotoEntity!.url = snapshot.url
    }

    for (const rentPlacePhoto of savedRentPlaceEntity.rentPlacePhotos) {
      await this.database.rentPlacePhotos.update({
        data: rentPlacePhoto,
        where: { id: rentPlacePhoto.id },
      })
    }

    console.debug(`Novo imóvel cadastrado: ${newPlaceEntity.id}`)

    const rentPlaceDTO = RentPlaceDTO.fromEntity(savedRentPlaceEntity)
    return rentPlaceDTO
  }

  public async list(pagination: Pagination) {
    const rentPlaceEntities = await this.database.rentPlace.findMany({
      skip: (Number(pagination.page) - 1) * Number(pagination.limit),
      take: Number(pagination.limit),
      include: {
        address: true,
        rentPlacePhotos: true,
      },
    })

    const resumedRentPlaceDTOs = rentPlaceEntities.map((rentPlaceEntity) =>
      ResumedRentPlaceDTO.fromPrismaEntity(rentPlaceEntity)
    )
    const paginationDTO = new PaginationDTO<ResumedRentPlaceDTO>(
      resumedRentPlaceDTOs,
      pagination.page,
      pagination.limit
    )

    return paginationDTO
  }

  public async single(id: number) {
    const rentPlaceEntity = await this.database.rentPlace.findUnique({
      where: { id },
      include: {
        address: true,
        specifications: true,
        rentPlacePhotos: true,
        user: true,
      },
    })
    if (!rentPlaceEntity) throw DomainException.entityNotFound('Imóvel')

    const rentPlaceDTO = RentPlaceDTO.fromEntity(
      RentPlaceEntity.fromEntity(rentPlaceEntity)
    )
    return rentPlaceDTO
  }
}
