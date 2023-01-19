import { StatusCodes } from "http-status-codes";
import { DomainExceptionType } from "../helpers/enums";

export default class DomainException extends Error {
  public statusCode: StatusCodes;
  public type: DomainExceptionType;

  private constructor(
    statusCode: StatusCodes,
    type: DomainExceptionType,
    message: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }

  static entityNotFound(entityName: string) {
    return new DomainException(
      StatusCodes.BAD_REQUEST,
      DomainExceptionType.EntityNotFound,
      `${entityName} não encontrado`
    );
  }

  static invalidState(message: string) {
    return new DomainException(
      StatusCodes.BAD_REQUEST,
      DomainExceptionType.InvalidState,
      message
    );
  }
}
