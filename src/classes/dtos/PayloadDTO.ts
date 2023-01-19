export default class PayloadDTO {
  userId: number
  isActive: boolean
  verified: boolean

  constructor(userId: number, isActive: boolean, verified: boolean) {
    this.userId = userId
    this.isActive = isActive
    this.verified = verified
  }
}
