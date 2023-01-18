import SetupServer from './SetupServer';

async function bootstrap() {
  const server = new SetupServer(3000);
  await server.init();
  server.start();
}

bootstrap();
