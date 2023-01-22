import { PrismaClient } from '@prisma/client'
import PayloadDTO from '../classes/dtos/PayloadDTO'
import DomainException from '../exceptions/DomainException'
import { CreateRentPlaceDTO } from '../dtos/CreateRentPlaceDTO'
import FirebaseService from './FirebaseService'
import RentPlaceEntity from '../classes/entities/RentPlaceEntity'
import UserEntity from '../classes/entities/UserEntity'
import PhotoDTO from '../classes/dtos/PhotoDTO'
import RentPlaceDTO from '../classes/dtos/RentPlaceDTO'
import ViaCepService from './ViaCepService'

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
    rentPlaceEntity.user = UserEntity.fromEntity(userOwner)
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
      },
      include: {
        address: true,
        specifications: true,
      },
    })
    const photos = new Array<PhotoDTO>()
    let photoId = 1
    for (const image of data.images) {
      const bucketPath = `rent-place:${newPlaceEntity.id}/${photoId}-${image.name}.${image.extension}`
      const snapshot = await this.firebaseService.uploadToBucket(
        bucketPath,
        image.dataUrl
      )
      photos.push(new PhotoDTO(photoId, snapshot.url, image.name))
      photoId++
    }

    console.debug(`Novo imóvel cadastrado: ${newPlaceEntity.id}`)

    const rentPlaceDTO = RentPlaceDTO.fromEntity(
      RentPlaceEntity.fromEntity(newPlaceEntity)
    )
    rentPlaceDTO.photos = photos
    return rentPlaceDTO
  }
}
