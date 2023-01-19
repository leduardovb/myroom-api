import PayloadDTO from '../classes/dtos/PayloadDTO'
import { RequestDTO } from '../dtos/RequestDTO'

export interface RequestBody<T> extends Express.Request {
  body: RequestDTO<T>
  payload?: PayloadDTO
}
