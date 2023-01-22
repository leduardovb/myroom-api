import SetupServer from './SetupServer'
import { SocketIo } from './socket/SocketIo'

async function bootstrap() {
  const server = new SetupServer(3000)
  await server.init()
  server.start()

  new SocketIo(server.httpServer, server.database).init()
}

bootstrap()
