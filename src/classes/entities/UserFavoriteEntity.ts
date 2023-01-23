import { RentPlace, UserFavorites } from '@prisma/client'
import RentPlaceEntity from './RentPlaceEntity'
import UserEntity from './UserEntity'

export default class UserFavoriteEntity {
  public user!: UserEntity
  public rentPlace!: RentPlaceEntity

  constructor(user?: UserEntity, rentPlace?: RentPlaceEntity) {
    if (user !== undefined) this.user = user
    if (rentPlace !== undefined) this.rentPlace = rentPlace
  }

  static fromEntity(
    userFavoriteEntity: UserFavorites & {
      rentPlace?: RentPlace
    }
  ) {
    return new UserFavoriteEntity(
      new UserEntity(userFavoriteEntity.userId),
      userFavoriteEntity.rentPlace
        ? RentPlaceEntity.fromEntity(userFavoriteEntity.rentPlace)
        : new RentPlaceEntity(userFavoriteEntity.rentPlaceId)
    )
  }
}
