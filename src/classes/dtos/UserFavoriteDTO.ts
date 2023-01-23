import UserFavoriteEntity from '../entities/UserFavoriteEntity'

export default class UserFavoriteDTO {
  public userId?: number
  public rentPlaceId?: number

  constructor(userId?: number, rentPlaceId?: number) {
    if (userId !== undefined) this.userId = userId
    if (rentPlaceId !== undefined) this.rentPlaceId = rentPlaceId
  }

  static fromEntity(userFavoriteEntity: UserFavoriteEntity) {
    return new UserFavoriteDTO(
      userFavoriteEntity.user.id,
      userFavoriteEntity.rentPlace.id
    )
  }
}
