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
  MESSAGE_FROM_ROOM = 'message_from_room',
}

export enum RentPlaceType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  KITNET = 'kitnet',
}

export enum RentPlaceRoomType {
  PRIVATE = 'private',
  SHARED = 'shared',
  ALL = 'all',
}

export enum RentPlaceSpecification {
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  LIVING_ROOM = 'living_room',
  GARAGE = 'garage',
  LODGER = 'lodger',
  LAUNDRY = 'laundry',
}

export enum ComplaintType {
  INCORRET = 'incorrect',
  UNTRUE = 'untrue',
  GOLPE = 'golpe',
  DUPLICATED = 'duplicated',
}
