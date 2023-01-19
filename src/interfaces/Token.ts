import PayloadDTO from '../classes/dtos/PayloadDTO'

export interface Token {
  payload: PayloadDTO
  iat: number
  exp: number
}
