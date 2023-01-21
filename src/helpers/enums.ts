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
}
