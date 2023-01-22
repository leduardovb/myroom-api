export enum DomainExceptionType {
  Unreachable,
  InvalidState,
  EntityNotFound,
  EntityDisabled,
  EntityAlreadyExists,
  InvalidArguments,
  ClientUnavaible,
}

export enum SocketNamespace {
  CONNECTION = 'connection',
  QUEUES = 'queues',
  DISCONNECT = 'disconnect',
  CONNECT_ROOM = 'connect_room',
  CONNECTED_ROOM = 'connected_room',
  MESSAGE_TO_ROOM = 'message_to_room',
}

export enum RentPlaceType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  KITNET = 'kitnet',
}

export enum RentPlaceRoomType {
  SINGLE = 'single',
  SHARED = 'shared',
  ALL = 'all',
}

export enum RentPlaceSpecification {
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  LIVING_ROOM = 'living_room',
  GARAGE = 'garage',
  LODGER = 'lodger',
}

export enum PermitedExtension {
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
}
