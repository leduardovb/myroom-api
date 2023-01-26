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
import { CreateComplaintDTO } from '../dtos/CreateComplaintDTO'
import ComplaintEntity from '../classes/entities/ComplaintEntity'
import ComplaintDTO from '../classes/dtos/ComplaintDTO'

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
    console.debug(`Listando imóveis: ${pagination.page}/${pagination.limit}`)
    const countRentPlaces = await this.database.rentPlace.count()
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
      pagination.limit,
      countRentPlaces
    )

    return paginationDTO
  }

  public async listByUser(pagination: Pagination, userId: number) {
    console.debug(
      `Listando imóveis do usuário ${userId}: ${pagination.page}/${pagination.limit}`
    )
    const countRentPlaces = await this.database.rentPlace.count({
      where: { userId },
    })
    const rentPlaceEntities = await this.database.rentPlace.findMany({
      skip: (Number(pagination.page) - 1) * Number(pagination.limit),
      take: Number(pagination.limit),
      where: { userId },
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
      pagination.limit,
      countRentPlaces
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

  public async isFavorite(id: number, userId: number) {
    const isFavorite =
      (await this.database.userFavorites.findFirst({
        where: {
          userId,
          rentPlaceId: id,
        },
      })) !== null
    return isFavorite
  }

  public async delete(id: number, userId: number) {
    const rentPlaceEntity = await this.database.rentPlace.findUnique({
      where: { id },
    })
    if (!rentPlaceEntity) throw DomainException.entityNotFound('Imóvel')
    if (rentPlaceEntity.userId !== userId)
      throw DomainException.invalidState('Usuário não é dono do imóvel')

    await this.database.rentPlace.delete({
      where: { id },
    })
    return RentPlaceDTO.fromEntity(RentPlaceEntity.fromEntity(rentPlaceEntity))
  }

  public async createComplaint(
    payload: PayloadDTO,
    createComplaintDTO: CreateComplaintDTO
  ) {
    console.debug(`Criando reclamação: ${createComplaintDTO.rentPlaceId}`)

    const rentPlaceEntity = await this.database.rentPlace.findUnique({
      where: { id: createComplaintDTO.rentPlaceId },
    })
    if (!rentPlaceEntity) throw DomainException.entityNotFound('Imóvel')

    const userEntity = await this.database.user.findUnique({
      where: { id: payload.userId },
    })
    if (!userEntity) throw DomainException.entityNotFound('Usuário')

    const complaintEntity = ComplaintEntity.fromDTO(
      userEntity.id,
      createComplaintDTO
    )
    const newComplaintEntity = await this.database.rentPlaceComplaints.create({
      data: {
        ...complaintEntity,
        id: undefined,
      },
      include: {
        user: true,
        rentPlace: true,
      },
    })

    console.debug(`Nova reclamação criada: ${newComplaintEntity.id}`)

    const savedComplaintEntity = ComplaintEntity.fromEntity(newComplaintEntity)
    const complaintDTO = ComplaintDTO.fromEntity(savedComplaintEntity)
    return complaintDTO
  }
}
