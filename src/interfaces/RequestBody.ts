import PayloadDTO from '../classes/dtos/PayloadDTO'
import { RequestDTO } from '../dtos/RequestDTO'

export interface RequestBody<T> extends RequestPayload {
  body: RequestDTO<T>
}

export interface RequestPayload extends Express.Request {
  payload?: PayloadDTO
}
