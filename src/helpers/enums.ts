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
