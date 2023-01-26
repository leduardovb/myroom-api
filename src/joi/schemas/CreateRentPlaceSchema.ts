import Joi from 'joi'
import { DefaultSchema } from './DefaultSchema'
import {
  RentPlaceRoomType,
  RentPlaceSpecification,
  RentPlaceType,
} from '../../helpers/enums'

export default class CreateRentPlaceSchema extends DefaultSchema {
  static schema = this.dataSchema(
    Joi.object({
      name: Joi.string().trim().required().min(4).max(60),
      description: Joi.string().trim().required().min(4).max(300),
      type: Joi.string()
        .required()
        .valid(
          RentPlaceType.APARTMENT,
          RentPlaceType.HOUSE,
          RentPlaceType.KITNET
        ),
      roomType: Joi.string()
        .required()
        .valid(
          RentPlaceRoomType.ALL,
          RentPlaceRoomType.SHARED,
          RentPlaceRoomType.PRIVATE
        ),
      value: Joi.number().required().greater(1),
      address: Joi.object({
        streetName: Joi.string().trim().required().min(10).max(60),
        buildingCode: Joi.string().trim().required().min(1).max(10),
        complement: Joi.string().trim().min(4).max(45).allow(null),
        neighborhood: Joi.string().trim().required().min(4).max(60),
        zipCode: Joi.string().trim().required().length(8).pattern(/^\d+$/),
      }).required(),
      photos: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().trim().required().min(4).max(60),
            dataUrl: Joi.string().required(),
          })
        )
        .min(1)
        .max(10)
        .unique('name')
        .required(),
      specifications: Joi.array()
        .items(
          Joi.object({
            description: Joi.string()
              .required()
              .valid(
                RentPlaceSpecification.BATHROOM,
                RentPlaceSpecification.BEDROOM,
                RentPlaceSpecification.GARAGE,
                RentPlaceSpecification.LIVING_ROOM,
                RentPlaceSpecification.LODGER,
                RentPlaceSpecification.LAUNDRY
              ),
            amount: Joi.number().required().greater(0).max(10),
          })
        )
        .min(1)
        .required()
        .unique('description'),
    }).required()
  )
}
