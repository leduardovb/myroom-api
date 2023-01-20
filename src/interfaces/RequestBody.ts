import PayloadDTO from '../classes/dtos/PayloadDTO'
import { RequestDTO } from '../dtos/RequestDTO'

export interface RequestBody<T> extends RequestPaylad {
  body: RequestDTO<T>
}

export interface RequestPaylad extends Express.Request {
  payload?: PayloadDTO
}
