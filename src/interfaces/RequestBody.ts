import { Request } from 'express'
import PayloadDTO from '../classes/dtos/PayloadDTO'
import { RequestDTO } from '../dtos/RequestDTO'
import { Pagination } from './Pagination'

export interface RequestBody<T> extends RequestPayload {
  body: RequestDTO<T>
}

export interface RequestPayload extends Request {
  payload?: PayloadDTO
}

export interface RequestPaginated extends Express.Request {
  payload?: PayloadDTO
  query: Pagination
}
